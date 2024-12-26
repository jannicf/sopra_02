// KleiderschrankView.js
import { Component } from 'react';
import KleiderschrankAPI from '../api/KleiderschrankAPI';

class KleiderschrankView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            personen: [],
            error: null,
            loadingInProgress: false
        };
    }

    componentDidMount() {
        this.setState({
            loadingInProgress: true
        });

        // Erst Personen laden
        KleiderschrankAPI.getAPI().getPersonen()
            .then(personen => {
                this.setState({
                    personen: personen,
                    error: null,
                    loadingInProgress: false
                });

                // Dann direkt das Update für die erste Person ausführen
                if (personen.length > 0) {
                    const updatedPerson = {
                        id: personen[0].id,
                        vorname: "Max",
                        nachname: "Musterstadt",
                        nickname: "maxi",
                        google_id: "123"
                    };

                    return KleiderschrankAPI.getAPI().updatePerson(personen[0].id, updatedPerson);
                }
            })
            .then(updatedPerson => {
                if (updatedPerson) {
                    this.setState(prevState => ({
                        personen: prevState.personen.map(person =>
                            person.id === updatedPerson.id ? updatedPerson : person
                        )
                    }));
                }
            })
            .catch(e => {
                this.setState({
                    personen: [],
                    error: e,
                    loadingInProgress: false
                });
                console.error("Fehler:", e);
            });
    }

}

export default KleiderschrankView;