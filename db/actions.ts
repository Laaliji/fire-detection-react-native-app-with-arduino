import { ref, set , push, get } from "firebase/database";
import { db, getUserId } from "./firebase";
interface HistoricRecord {
    date: string;
    time: string;
    temperature: number;
    gaz: number;
    state: boolean;
    createdAt?: string; 
}

interface SensorDataRecord {
    temperature : string,
    valeur_gaz : string,
    humidite : string,
    gaz_detecte : string
}

export const getSensorData =  async () => {
    try{
        // Get temperature and humidity from capteurs folder
        const tempHumidityRef = ref(db,'capteurs')
        const tempHumiditySnapshot = await get(tempHumidityRef)
        
        // Get gas values from capteursGaz folder
        const gazRef = ref(db,'capteursGaz')
        const gazSnapshot = await get(gazRef)
        
        let sensorData: SensorDataRecord = {
            temperature: '0',
            humidite: '0',
            gaz_detecte: '0',
            valeur_gaz: '0'
        }
        
        if(tempHumiditySnapshot.exists()){
            const tempHumidityData = tempHumiditySnapshot.val()
            sensorData.temperature = tempHumidityData.temperature || '0'
            sensorData.humidite = tempHumidityData.humidite || '0'
        }
        
        if(gazSnapshot.exists()){
            const gazData = gazSnapshot.val()
            sensorData.valeur_gaz = gazData.valeur_gaz || '0'
            
            // In case gaz_detecte is also in the capteursGaz folder
            if(gazData.gaz_detecte !== undefined) {
                sensorData.gaz_detecte = gazData.gaz_detecte || '0'
            } else if(tempHumiditySnapshot.exists() && tempHumiditySnapshot.val().gaz_detecte !== undefined) {
                // Fallback to capteurs folder if gaz_detecte is not in capteursGaz
                sensorData.gaz_detecte = tempHumiditySnapshot.val().gaz_detecte || '0'
            }
        }
        
        return { sensorData }
    }catch(error){
        console.error('Error getting sensor data:', error);
        return { error };
    }
}

export const addHistoric = async (historic:HistoricRecord) => {
    try{
        const { userId } = await getUserId()
        if (!userId) return { error: 'No user ID found' };

        const historicRef = ref(db, `users/${userId}/historic`);
        const newHistoricRef = push(historicRef);
        await set(newHistoricRef, {
            ...historic,
            createdAt: new Date().toISOString()
        });
        return { success: true };
    }catch(error){
        console.error('Error adding project:', error);
        return { error };
    }
};

export const getHistorics = async () => {
    try{
        const { userId } = await getUserId()
        if (!userId) return { error: 'No user ID found' };

        const historicRef = ref(db, `users/${userId}/historic`);
        const snapshot = await get(historicRef);
        if(snapshot.exists()){
            const historicObj = snapshot.val()
            const historicList = Object.entries(historicObj).map(([id,data])=>({
                id,
                ...(data as HistoricRecord),
            }))
            return { histories : historicList  };
        }else{
            return { histories : [] };
        }
    }catch(error){
        console.error('Error adding project:', error);
        return { error };
    }
}