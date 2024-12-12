// Importieren der benötigten Funktionen aus den SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Die Firebase-Konfiguration der Webanwendung
const firebaseConfig = {
  apiKey: "AIzaSyAnM_OGFZiDFgWBLlrHGDI8pEL1jbKPaxA",
  authDomain: "sopra-kleiderschrank.firebaseapp.com",
  projectId: "sopra-kleiderschrank",
  storageBucket: "sopra-kleiderschrank.firebasestorage.app",
  messagingSenderId: "149184484663",
  appId: "1:149184484663:web:aa67fce4f30226301ff6b2"
};

// Initialisiere Firebase
const app = initializeApp(firebaseConfig);

// Initialisieren der Firbase-Authentifizierung und Abrufen eines Verweises auf ein Dienst
export const auth = getAuth(app);