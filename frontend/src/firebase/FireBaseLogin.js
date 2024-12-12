// src/Firebase/FirebaseLogin.js
import { GoogleAuthProvider } from "firebase/auth";
import * as firebaseui from "firebaseui";
import { auth } from './firebaseconfig';  // Importiere auth aus der lokalen config

import 'firebaseui/dist/firebaseui.css'
import { useEffect } from 'react';

export default function FirebaseLogin() {
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

const uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult) {
            const user = authResult.user;
            const googleId = user.uid;
            // Hier können wir später die Google ID an unser Backend senden
            console.log("User eingeloggt mit Google ID:", googleId);
            return true;
        },
        uiShown: function () {
            document.getElementById('loader').style.display = 'none';
        }
    },
    signInSuccessUrl: '/',  // Nach Login zur Hauptseite
    signInOptions: [
        GoogleAuthProvider.PROVIDER_ID,
    ],
    credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
};