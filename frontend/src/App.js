import React from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { Box, ThemeProvider, Container, CssBaseline } from '@mui/material';
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

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            userHasProfile: false,
            appError: null,
            authError: null
        };
    };

    handleSignIn = () => {
        // Firebase initialisieren
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();

        // Setzt die Sprache auf Englisch
        auth.languageCode = 'en';

        // Startet den Google-Login-Prozess
        signInWithPopup(auth, provider).catch(error => {
            this.setState({
                authError: error
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
                // Token generieren und setzen
                user.getIdToken().then(token => {
                    // Token zu den Cookies des Browsers hinzufügen
                    /** Das Cookie "token" verfügt über keinen gültigen Wert für das "SameSite"-Attribut.
                     * Bald werden Cookies ohne das "SameSite"-Attribut oder mit einem ungültigen Wert
                     * dafür als "Lax" behandelt. Dadurch wird das Cookie nicht länger an Kontexte gesendet,
                     * die zu einem Drittanbieter gehören. Falls Ihre Anwendung das Cookie in diesen Kontexten benötigt,
                     * fügen Sie bitte das Attribut "SameSite=None" zu ihm hinzu.
                     * Für weitere Infos siehe https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie/SameSite.*/
                    document.cookie = `token=${token};path=/;SameSite=None;Secure`;


                    // Prüfen ob ein Profil existiert
                    return KleiderschrankAPI.getAPI().getPersonByGoogleId(user.uid)
                        .then(person => {
                            this.setState({
                                currentUser: user,
                                userHasProfile: person !== null,
                                authError: null
                            })
                        })
                        .catch(e => {
                            this.setState({
                                currentUser: user,
                                userHasProfile: false,
                                authError: e
                            });
                        });
                }).catch(e => {
                    this.setState({
                        authError: e
                    });
                });
            } else {
                // Der Nutzer ist ausgeloggt -> Token löschen
                /** Das Cookie "token" verfügt über keinen gültigen Wert für das "SameSite"-Attribut.
                 * Bald werden Cookies ohne das "SameSite"-Attribut oder mit einem ungültigen Wert
                 * dafür als "Lax" behandelt. Dadurch wird das Cookie nicht länger an Kontexte gesendet,
                 * die zu einem Drittanbieter gehören. Falls Ihre Anwendung das Cookie in diesen Kontexten benötigt,
                 * fügen Sie bitte das Attribut "SameSite=None" zu ihm hinzu.
                 * Für weitere Infos siehe https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie/SameSite.*/
                document.cookie = `token=${token};path=/;SameSite=None;Secure`;

                // Zurücksetzung des ausgeloggten Nutzers
                this.setState({
                    currentUser: null,
                    userHasProfile: false
                });
            }
        });
    }

    render() {
    const { currentUser, appError, authError, userHasProfile } = this.state;

    return (
        <ThemeProvider theme={Theme}>
            <CssBaseline />
            <Router>
                <Container maxWidth='lg' sx={{
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                    <Header user={currentUser} onLogout={this.handleSignOut} />
                    {/* Anzeige des gesamten Seiteninhalts in der Box */}
                    <Box sx={{
                            flex: 1,
                            paddingBottom: '64px'  // reservierter Platz für Footer
                    }}>
                    <Routes>
                        {/* Startseite mit Login */}
                        <Route path="/" element={
                            currentUser ?
                                userHasProfile ?
                                    <Navigate replace to="/kleiderschrank" />
                                    :
                                    <Navigate replace to="/profile" />
                                :
                                <Login onSignIn={this.handleSignIn} />
                        } />

                        {/* Profilseite - als einzige auch ohne Profil zugänglich */}
                        <Route path="/profile" element={
                            currentUser ? <ProfilView user={currentUser} /> : <Navigate to="/" />
                        } />

                        {/* Alle anderen Routen erfordern ein Profil */}
                       <Route path="/kleiderschrank" element={
                            currentUser ? <KleiderschrankView user={currentUser} /> : <Navigate to="/" />
                        } />

                        <Route path="/outfits" element={
                            currentUser && userHasProfile ?
                                <OutfitView
                                    user={currentUser}
                                />
                                :
                                <Navigate to="/profile" />
                        } />

                        <Route path="/outfits/erstellen-nach-style" element={
                            currentUser && userHasProfile ?
                                <StyleBasiertesOutfitView
                                    user={currentUser}
                                />
                                :
                                <Navigate to="/profile" />
                        } />

                        <Route path="/outfits/create-by-item" element={
                            currentUser && userHasProfile ?
                                <KleidungsstueckBasiertesOutfitView
                                    user={currentUser}  // sicherstellen dass currentUser übergeben wird
                                />
                                :
                                <Navigate to="/profile" />
                        } />

                        <Route path="/styles" element={
                            currentUser && userHasProfile ?
                                <StylesView user={currentUser}/>
                                :
                                <Navigate to="/profile" />
                        } />

                        {/* About Seite bleibt öffentlich, braucht aber Login */}
                        <Route path="/about" element={
                            currentUser ?
                                <About />
                                :
                                <Navigate to="/" />
                        } />
                    </Routes>
                    </Box>
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