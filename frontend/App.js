import React from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { ThemeProvider, Container, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorAlert from 'src/dialogs/ErrorAlert';
import LoadingProgress from 'src/dialogs/LoadingProgress';
import Header from 'src/layout/header';
import Login from 'src/pages/Login';
import KleiderschrankView from 'src/pages/KleiderschrankView';
import OutfitsView from 'src/pages/OutfitsView';
import StylesView from 'src/pages/StylesView';
import About from 'src/pages/About';
import firebaseConfig from 'src/firebase/firebaseconfig';

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
                    <Header user={currentUser} />

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
                        <Route path="/about" element={<About />} />
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
                </Container>
            </Router>
        </ThemeProvider>
    );
    }
}