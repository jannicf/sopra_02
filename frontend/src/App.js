import React, {Component} from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { Box, ThemeProvider, Container, CssBaseline, CircularProgress } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Theme from './Theme';
import ErrorAlert from './dialogs/ErrorAlert';
import Header from './layout/header';
import Footer from './layout/footer';
import Login from './pages/Login';
import KleiderschrankView from './pages/KleiderschrankView';
import OutfitView from './pages/OutfitView';
import KleidungsstueckBasiertesOutfitView from './pages/KleidungsstueckBasiertesOutfitView';
import StyleBasiertesOutfitView from './pages/StyleBasiertesOutfitView';
import StylesView from './pages/StylesView';
import ProfilView from "./pages/ProfilView";
import About from './pages/About';
import KleiderschrankAPI from "./api/KleiderschrankAPI";
import firebaseConfig from './firebase/firebaseconfig';

// LoadingIndicator Komponente
const LoadingIndicator = () => (
    <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%'
    }}>
        <CircularProgress size={60} thickness={4} />
    </Box>
);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            userHasProfile: false,
            appError: null,
            authError: null,
            authLoading: false
        };
    };


    handleSignIn = () => {
        // Zeigt den LoadingProgress während der Anmeldung
        this.setState({
            authLoading: true
        });

        // Firebase initialisieren
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();

        // Setzt die Sprache auf Englisch
        auth.languageCode = 'en';

        // Startet den Google-Login-Prozess
        signInWithPopup(auth, provider).catch(error => {
            this.setState({
                authError: error,
                authLoading: false
            });
        });
    }

    handleSignOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
        // Logout erfolgreich
        document.cookie = 'token=;path=/';  // Token löschen
        this.setState({
            currentUser: null
        });
    }).catch((error) => {
        this.setState({
            authError: error
        });
    });
}
    // Diese Methode wird beim Start der Anwendung ausgeführt
    componentDidMount() {
    // Firebase initialisieren
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    // Überwacht den Anmeldestatus des Nutzers
    onAuthStateChanged(auth, (user) => {
            if (user) {
                // Nutzer ist eingeloggt
                this.setState({
                    authLoading: true
                });

                // Token generieren und setzen
                user.getIdToken().then(token => {
                    // Token zu den Cookies des Browsers hinzufügen
                    document.cookie = `token=${token};path=/;SameSite=Lax;`

                    // Prüfen ob ein Profil existiert
                    return KleiderschrankAPI.getAPI().getPersonByGoogleId(user.uid)
                        .then(person => {
                            this.setState({
                                currentUser: user,
                                userHasProfile: person !== null,
                                authError: null,
                                authLoading: false
                            });
                        })
                        .catch(e => {
                            this.setState({
                                currentUser: user,
                                userHasProfile: false,
                                authError: e,
                                authLoading: false
                            });
                        });
                }).catch(e => {
                    this.setState({
                        authError: e,
                        authLoading: false
                    });
                });
            } else {
                // Der Nutzer ist ausgeloggt -> Token löschen
                document.cookie = `token=;path=/;SameSite=Lax`;

                // Zurücksetzung des ausgeloggten Nutzers
                this.setState({
                    currentUser: null,
                    userHasProfile: false,
                    authLoading: false
                });
            }
        });
    }

    render() {
    const { currentUser, appError, authError, authLoading, userHasProfile } = this.state;

    return (
        <ThemeProvider theme={Theme}>
            <CssBaseline />
            <Router>
                <Container maxWidth='lg' sx={{
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                    <Header user={currentUser} onLogout={this.handleSignOut} />
                    {/* Anzeige der gesamten Seite innerhalb dieser Box */}
                    <Box sx={{
                            flex: 1,
                            paddingBottom: '64px'
                    }}>
                    <Routes>
                        {/* Login-Seite */}
                        <Route path="/" element={
                            currentUser ?
                                authLoading ?
                                    <LoadingIndicator />
                                    :
                                    userHasProfile ?
                                    <Navigate replace to="/kleiderschrank" />
                                    :
                                    <Navigate replace to="/profile" />
                                :
                                <Login onSignIn={this.handleSignIn} />
                        } />

                        {/* Profilseite */}
                        <Route path="/profile" element={
                            currentUser ?
                                authLoading ?
                                    <LoadingIndicator />
                                    :
                                    <ProfilView user={currentUser} />
                                :
                                <Navigate to="/" />
                        } />

                        {/* Alle anderen Routen */}
                       <Route path="/kleiderschrank" element={
                            currentUser ?
                                authLoading ?
                                    <LoadingIndicator />
                                    :
                                    userHasProfile ?
                                        <KleiderschrankView user={currentUser} />
                                        :
                                        <Navigate to="/profile" />
                                :
                                <Navigate to="/" />
                        } />

                        <Route path="/outfits" element={
                            currentUser ?
                                authLoading ?
                                    <LoadingIndicator />
                                    :
                                    userHasProfile ?
                                <OutfitView user={currentUser} />
                                :
                                <Navigate to="/profile" />
                            :
                            <Navigate to="/" />
                        } />

                        <Route path="/outfits/erstellen-nach-style" element={
                            currentUser ?
                                authLoading ?
                                    <LoadingIndicator />
                                    :
                                    userHasProfile ?
                                <StyleBasiertesOutfitView user={currentUser} />
                                :
                                <Navigate to="/profile" />
                            :
                            <Navigate to="/" />
                        } />

                        <Route path="/outfits/create-by-item" element={
                            currentUser ?
                                authLoading ?
                                    <LoadingIndicator />
                                    :
                                    userHasProfile ?
                                        <KleidungsstueckBasiertesOutfitView user={currentUser} />
                                        :
                                        <Navigate to="/profile" />
                                :
                                <Navigate to="/" />
                        } />

                        <Route path="/styles" element={
                            currentUser ?
                                authLoading ?
                                    <LoadingIndicator />
                                    :
                                    userHasProfile ?
                                        <StylesView user={currentUser} />
                                        :
                                        <Navigate to="/profile" />
                                :
                                <Navigate to="/" />
                        } />

                        {/* About Seite  */}
                        <Route path="/about" element={
                            currentUser ?
                                authLoading ?
                                    <LoadingIndicator />
                                    :
                                    <About />
                                :
                                <Navigate to="/" />
                        } />
                    </Routes>
                    </Box>
                    {authLoading}
                    {/* Fehlerbehandlung für allgemeine App-Fehler */}
                        {appError && (
                            <ErrorAlert
                                message="In der Anwendung ist ein Fehler aufgetreten."
                                onClose={() => this.setState({ appError: null })}
                            />
                        )}

                        {/* Fehlerbehandlung für Auth-Fehler */}
                        {authError && (
                            <ErrorAlert
                                message="Bei der Anmeldung ist ein Fehler aufgetreten."
                                onClose={() => this.setState({ authError: null })}
                            />
                        )}
                    <Footer user={currentUser} />
                </Container>
            </Router>
        </ThemeProvider>
    );
    }
}

export default App;