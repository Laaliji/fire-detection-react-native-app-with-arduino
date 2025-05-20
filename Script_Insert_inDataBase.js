const { ref, set } = require('firebase/database')
const { db } = require('./db/firebaseNode')
// Valeurs initiales
let gaz_detecte = 0;
let humidite = 0;
let temperature = 0;
let valeur_gaz = 0;

// Fonction pour mettre à jour les valeurs dans Firebase
function updateCapteurs() {
  // Incrémenter chaque valeur de 5
  gaz_detecte += 5;
  humidite += 5;
  temperature += 5;
  valeur_gaz += 5;

  // Envoyer les valeurs de température et humidité dans 'capteurs'
  set(ref(db, 'capteurs'), {
    humidite,
    temperature
  });
  
  // Envoyer les valeurs de gaz dans 'capteursGaz'
  set(ref(db, 'capteursGaz'), {
    valeur_gaz,
    gaz_detecte
  });
  
  console.log('Valeurs mises à jour dans Firebase')
}

// Lancer la boucle toutes les 5 secondes
setInterval(updateCapteurs, 5000);

