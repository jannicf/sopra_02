import React from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            appError: null,
            authError: null,
            authLoading: false
        };
    };
}