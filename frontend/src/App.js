import React from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { ThemeProvider, Container, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Theme from './Theme';
import ErrorAlert from './dialogs/ErrorAlert';
import LoadingProgress from './dialogs/LoadingProgress';
import Header from './layout/header';
import Footer from './layout/footer';
import Login from './pages/Login';
import KleiderschrankView from './pages/KleiderschrankView';
import OutfitsView from './pages/OutfitsView';
import StylesView from './pages/StylesView';
import About from './pages/About';
import firebaseConfig from './firebase/firebaseconfig';

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


    // Login-Vorgang -> Verwendung auf Login-Page (onSignIn)????
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
                console.log("Der Benutzer ist: " + user);
				user.getIdToken().then(token => {
					// Token zu den Cookies des Browsers hinzufügen
					document.cookie = `token=${token};path=/`;
					console.log("Token is: " + document.cookie);

					// Erst danach den Nutzer setzen
					this.setState({
						currentUser: user,
						authError: null,
						authLoading: false
					});
				}).catch(e => {
					this.setState({
						authError: e,
						authLoading: false
					});
				});
			} else {
				// Der Nutzer ist ausgeloggt -> Token löschen
				document.cookie = 'token=;path=/';

				// Zurücksetzung des ausgeloggten Nutzers
				this.setState({
					currentUser: null,
					authLoading: false
				});
			}
		});
	}

    render() {
    const { currentUser, appError, authError, authLoading } = this.state;

    return (
        <ThemeProvider theme={Theme}>
            <CssBaseline />
            <Router>
                <Container maxWidth='md'>
                    <Header user={currentUser} onLogout={this.handleSignOut} />
                    <Routes>
                        {/* Startseite mit Login */}
                        <Route path="/" element={
                            currentUser ?
                                <Navigate replace to="/kleiderschrank" />
                                :
                                <Login onSignIn={this.handleSignIn} />
                        } />

                        {/* Ihre Hauptrouten */}
                        <Route path="/kleiderschrank" element={
                            currentUser ? <KleiderschrankView /> : <Navigate to="/" />
                        } />

                        <Route path="/outfits" element={
                            currentUser ? <OutfitsView /> : <Navigate to="/" />
                        } />

                        <Route path="/styles" element={
                            currentUser ? <StylesView /> : <Navigate to="/" />
                        } />

                        {/* Öffentliche Seite */}
                        <Route path="/about" element={
                            currentUser ? <About /> : <Navigate to="/" />
                        } />
                    </Routes>

                    {authLoading && <LoadingProgress />}
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