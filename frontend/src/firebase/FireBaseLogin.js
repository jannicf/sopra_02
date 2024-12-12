// Firebase Login Komponente zur Authentifizierung mit Google
import { GoogleAuthProvider } from "firebase/auth";
import * as firebaseui from "firebaseui";
import { auth } from './firebaseconfig';
import 'firebaseui/dist/firebaseui.css'
import { useEffect } from 'react';

export default function FirebaseLogin() {
   // Initialisiere Firebase UI beim ersten Rendern der Komponente
   useEffect(() => {
       const authUI = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
       authUI.start('#firebaseui-auth-container', uiConfig);
   }, []);

   return (
       <>
           <div id="firebaseui-auth-container"></div>
           <div id="loader" className="text-center">Loading form</div>
       </>
   )
}

// Konfiguration für das Firebase Login UI
const uiConfig = {
   callbacks: {
       // Wird nach erfolgreichem Login ausgeführt
       signInSuccessWithAuthResult: function (authResult) {
           const user = authResult.user;
           const googleId = user.uid;
           // Google ID an Backend senden für User-Verifikation
           console.log("User eingeloggt mit Google ID:", googleId);
           return true;
       },
       // Versteckt den Loader wenn UI geladen ist
       uiShown: function () {
           document.getElementById('loader').style.display = 'none';
       }
   },
   signInSuccessUrl: '/',  // Weiterleitung nach erfolgreichem Login
   signInOptions: [
       GoogleAuthProvider.PROVIDER_ID,  // Nur Google Login aktiviert
   ],
   credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
};