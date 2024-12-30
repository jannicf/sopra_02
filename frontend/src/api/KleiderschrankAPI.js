import PersonBO from './PersonBO';
import KleiderschrankBO from './KleiderschrankBO';
import KleidungsstueckBO from './KleidungsstueckBO';
import KleidungstypBO from './KleidungstypBO';
import StyleBO from './StyleBO';
import OutfitBO from './OutfitBO';
import KardinalitaetBO from './KardinalitaetBO';
import MutexBO from './MutexBO';
import ImplikationBO from './ImplikationBO';


/**
 * Abstrakte Schnittstelle für die REST API des Python Backends mit komfortablen Zugriffsmethoden.
 * Die Klasse ist als Singleton implementiert.
 */
class KleiderschrankAPI {
    // Singleton Instanz
    static #api = null;

    // Lokales Python Backend
    #KleiderschrankServerBaseURL = '/wardrobe';

    /**
     * Getter für die Singleton Instanz
     */
    static getAPI() {
        if (this.#api == null) {
            this.#api = new KleiderschrankAPI();
        }
        return this.#api;
    }

    // URL Definitionen

    // URLs für Person
    #getPersonURL = (id) => `${this.#KleiderschrankServerBaseURL}/persons/${id}`;
    #addPersonURL = () => `${this.#KleiderschrankServerBaseURL}/persons`;
    #getPersonsURL = () => `${this.#KleiderschrankServerBaseURL}/persons`;
    #updatePersonURL = (id) => `${this.#KleiderschrankServerBaseURL}/persons/${id}`;
    #deletePersonURL = (id) => `${this.#KleiderschrankServerBaseURL}/persons/${id}`;
    #searchPersonByNameURL = (name) => `${this.#KleiderschrankServerBaseURL}/persons-by-name/${name}`;

    // URLs für Kleiderschrank (Wardrobe)
    #getKleiderschrankURL = (id) => `${this.#KleiderschrankServerBaseURL}/wardrobes/${id}`;
    #getKleiderschraenkeURL = () => `${this.#KleiderschrankServerBaseURL}/wardrobes`;
    #addKleiderschrankURL = () => `${this.#KleiderschrankServerBaseURL}/wardrobes`;
    #updateKleiderschrankURL = (id) => `${this.#KleiderschrankServerBaseURL}/wardrobes/${id}`;
    #deleteKleiderschrankURL = (id) => `${this.#KleiderschrankServerBaseURL}/wardrobes/${id}`;

    // URLs für Kleidungsstück (Clothes)
    #getKleidungsstueckURL = (id) => `${this.#KleiderschrankServerBaseURL}/clothes/${id}`;
    #getKleidungsstueckeURL = () => `${this.#KleiderschrankServerBaseURL}/clothes`;
    #addKleidungsstueckURL = () => `${this.#KleiderschrankServerBaseURL}/clothes`;
    #updateKleidungsstueckURL = (id) => `${this.#KleiderschrankServerBaseURL}/clothes/${id}`;
    #deleteKleidungsstueckURL = (id) => `${this.#KleiderschrankServerBaseURL}/clothes/${id}`;

    // URLs für Kleidungstyp (Clothing Types)
    #getKleidungstypURL = (id) => `${this.#KleiderschrankServerBaseURL}/clothing-types/${id}`;
    #getKleidungstypenURL = () => `${this.#KleiderschrankServerBaseURL}/clothing-types`;
    #addKleidungstypURL = () => `${this.#KleiderschrankServerBaseURL}/clothing-types`;
    #updateKleidungstypURL = (id) => `${this.#KleiderschrankServerBaseURL}/clothing-types/${id}`;
    #deleteKleidungstypURL = (id) => `${this.#KleiderschrankServerBaseURL}/clothing-types/${id}`;

    // URLs für Styles
    #getStyleURL = (id) => `${this.#KleiderschrankServerBaseURL}/styles/${id}`;
    #getStylesURL = () => `${this.#KleiderschrankServerBaseURL}/styles`;
    #addStyleURL = () => `${this.#KleiderschrankServerBaseURL}/styles`;
    #updateStyleURL = (id) => `${this.#KleiderschrankServerBaseURL}/styles/${id}`;
    #deleteStyleURL = (id) => `${this.#KleiderschrankServerBaseURL}/styles/${id}`;

    // URLs für Outfits
    #getOutfitURL = (id) => `${this.#KleiderschrankServerBaseURL}/outfits/${id}`;
    #getOutfitsURL = () => `${this.#KleiderschrankServerBaseURL}/outfits`;
    #addOutfitURL = () => `${this.#KleiderschrankServerBaseURL}/outfits`;
    #updateOutfitURL = (id) => `${this.#KleiderschrankServerBaseURL}/outfits/${id}`;
    #deleteOutfitURL = (id) => `${this.#KleiderschrankServerBaseURL}/outfits/${id}`;
    #validateOutfitURL = (id) => `${this.#KleiderschrankServerBaseURL}/outfits/validate/${id}`;
    #getPossibleOutfitsForStyleURL = (styleId, wardrobeId) => `${this.#KleiderschrankServerBaseURL}/styles/${styleId}/wardrobes/${wardrobeId}/possible-outfits`;
    #getPossibleOutfitCompletionsURL = (styleId, kleidungsstueckId) => `${this.#KleiderschrankServerBaseURL}/styles/${styleId}/outfits/complete/${kleidungsstueckId}`;

    // URLs für Constraints
    #getKardinalitaetenURL = () => `${this.#KleiderschrankServerBaseURL}/cardinalityconstraints`;
    #addKardinalitaetURL = () => `${this.#KleiderschrankServerBaseURL}/cardinalityconstraints`;
    #updateKardinalitaetURL = (id) => `${this.#KleiderschrankServerBaseURL}/cardinalityconstraints/${id}`;
    #deleteKardinalitaetURL = (id) => `${this.#KleiderschrankServerBaseURL}/cardinalityconstraints/${id}`;

    #getMutexURL = () => `${this.#KleiderschrankServerBaseURL}/mutexconstraints`;
    #addMutexURL = () => `${this.#KleiderschrankServerBaseURL}/mutexconstraints`;
    #updateMutexURL = (id) => `${this.#KleiderschrankServerBaseURL}/mutexconstraints/${id}`;
    #deleteMutexURL = (id) => `${this.#KleiderschrankServerBaseURL}/mutexconstraints/${id}`;

    #getImplikationenURL = () => `${this.#KleiderschrankServerBaseURL}/implicationconstraints`;
    #addImplikationURL = () => `${this.#KleiderschrankServerBaseURL}/implicationconstraints`;
    #updateImplikationURL = (id) => `${this.#KleiderschrankServerBaseURL}/implicationconstraints/${id}`;
    #deleteImplikationURL = (id) => `${this.#KleiderschrankServerBaseURL}/implicationconstraints/${id}`;

    /**
     * Erweiterte fetch Methode, die auch bei HTTP Fehlern einen Fehler wirft
     */
    #fetchAdvanced = (url, init) => fetch(url, init)
        .then(res => {
            if (!res.ok) {
                throw Error(`${res.status} ${res.statusText}`);
            }
            return res.json();
        })

// Person Methoden
    getPerson(id) {
        return this.#fetchAdvanced(this.#getPersonURL(id), {
            method: 'GET'
        }).then(responseJSON => {
                let personBO = PersonBO.fromJSON(responseJSON)[0];
                return new Promise(function (resolve) {
                    resolve(personBO);
                })
            })
    }

    addPerson(personBO) {
        return this.#fetchAdvanced(this.#addPersonURL(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(personBO)
        }).then(responseJSON => {
            let responsePersonBO = PersonBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responsePersonBO);
            })
        })
    }

    updatePerson(personBO) {
        return this.#fetchAdvanced(this.#updatePersonURL(personBO.getID()), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(personBO)
        }).then(responseJSON => {
            let responsePersonBO = PersonBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responsePersonBO);
            })
        })
    }

    deletePerson(id) {
        return this.#fetchAdvanced(this.#deletePersonURL(id), {
            method: 'DELETE'
        })
    }

    // Kleiderschrank-bezogene Methoden
    getKleiderschrank(id) {
        return this.#fetchAdvanced(this.#getKleiderschrankURL(id))
            .then(responseJSON => {
                let kleiderschrankBO = KleiderschrankBO.fromJSON(responseJSON)[0];
                return new Promise(function (resolve) {
                    resolve(kleiderschrankBO);
                })
            })
    }

    getKleiderschraenke() {
        return this.#fetchAdvanced(this.#getKleiderschraenkeURL())
            .then(responseJSON => {
                let kleiderschrankBOs = KleiderschrankBO.fromJSON(responseJSON);
                return new Promise(function (resolve) {
                    resolve(kleiderschrankBOs);
                })
            })
    }

    addKleiderschrank(kleiderschrankBO) {
        return this.#fetchAdvanced(this.#addKleiderschrankURL(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(kleiderschrankBO)
        }).then(responseJSON => {
            let responseKleiderschrankBO = KleiderschrankBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseKleiderschrankBO);
            })
        })
    }

    updateKleiderschrank(kleiderschrankBO) {
        return this.#fetchAdvanced(this.#updateKleiderschrankURL(kleiderschrankBO.getID()), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(kleiderschrankBO)
        }).then(responseJSON => {
            let responseKleiderschrankBO = KleiderschrankBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseKleiderschrankBO);
            })
        })
    }

    deleteKleiderschrank(id) {
        return this.#fetchAdvanced(this.#deleteKleiderschrankURL(id), {
            method: 'DELETE'
        })
    }

// Kleidungsstück Methoden
    addKleidungsstueck(kleidungsstueckBO) {
        return this.#fetchAdvanced(this.#addKleidungsstueckURL(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(kleidungsstueckBO)
        }).then(responseJSON => {
            let responseKleidungsstueckBO = KleidungsstueckBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseKleidungsstueckBO);
            })
        })
    }

    getKleidungsstueck(id) {
        return this.#fetchAdvanced(this.#getKleidungsstueckURL(id))
            .then(responseJSON => {
                let kleidungsstueckBO = KleidungsstueckBO.fromJSON(responseJSON)[0];
                return new Promise(function (resolve) {
                    resolve(kleidungsstueckBO);
                })
            })
    }

    getKleidungsstuecke() {
        return this.#fetchAdvanced(this.#getKleidungsstueckeURL())
            .then(responseJSON => {
                let kleidungsstueckBOs = KleidungsstueckBO.fromJSON(responseJSON);
                return new Promise(function (resolve) {
                    resolve(kleidungsstueckBOs);
                })
            })
    }

    updateKleidungsstueck(kleidungsstueck) {
        return this.#fetchAdvanced(this.#updateKleidungsstueckURL(kleidungsstueck.id), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                id: kleidungsstueck.id,
                name: kleidungsstueck.name,
                typ: kleidungsstueck.typ_id,
                kleiderschrank_id: kleidungsstueck.kleiderschrank_id
            })
        }).then(responseJSON => {
            let responseKleidungsstueckBO = KleidungsstueckBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseKleidungsstueckBO);
            })
        })
    }

    deleteKleidungsstueck(id) {
        return this.#fetchAdvanced(this.#deleteKleidungsstueckURL(id), {
            method: 'DELETE'
        })
    }

// Kleidungstyp Methoden
    getKleidungstyp(id) {
        return this.#fetchAdvanced(this.#getKleidungstypURL(id))
            .then(responseJSON => {
                let kleidungstypBO = KleidungstypBO.fromJSON(responseJSON)[0];
                return new Promise(function (resolve) {
                    resolve(kleidungstypBO);
                })
            })
    }

    getKleidungstypen() {
        return this.#fetchAdvanced(this.#getKleidungstypenURL())
            .then(responseJSON => {
                let kleidungstypBOs = KleidungstypBO.fromJSON(responseJSON);
                return new Promise(function (resolve) {
                    resolve(kleidungstypBOs);
                })
            })
    }

    addKleidungstyp(kleidungstypBO) {
        return this.#fetchAdvanced(this.#addKleidungstypURL(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(kleidungstypBO)
        }).then(responseJSON => {
            let responseKleidungstypBO = KleidungstypBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseKleidungstypBO);
            })
        })
    }

    updateKleidungstyp(kleidungstypBO) {
        return this.#fetchAdvanced(this.#updateKleidungstypURL(kleidungstypBO.getID()), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(kleidungstypBO)
        }).then(responseJSON => {
            let responseKleidungstypBO = KleidungstypBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseKleidungstypBO);
            })
        })
    }

    deleteKleidungstyp(id) {
        return this.#fetchAdvanced(this.#deleteKleidungstypURL(id), {
            method: 'DELETE'
        })
    }

// Style Methoden
    getStyles() {
    // Fetch mit den standardGetOptions
    return this.#fetchAdvanced(this.#getStylesURL(), {
        method: 'GET',
        headers: {
            'Accept': 'application/json, text/plain'
        }
    }).then(responseJSON => {
        // Array von Style-Objekten erstellen
        let styleBOs = StyleBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
            resolve(styleBOs);
        })
    })
}

    getStyle(id) {
        // Fetch mit den standardGetOptions
        return this.#fetchAdvanced(this.#getStyleURL(id), {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain'
            }
        }).then(responseJSON => {
            // Ein einzelnes Style-Objekt erstellen
            let styleBO = StyleBO.fromJSON([responseJSON])[0];
            return new Promise(function (resolve) {
                resolve(styleBO);
            })
        })
    }

    addStyle(styleBO) {
        // POST Request mit den erwarteten Headers
        return this.#fetchAdvanced(this.#addStyleURL(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(styleBO.toJSON())
        }).then(responseJSON => {
            // Neues Style-Objekt aus der Antwort erstellen
            let responseStyleBO = StyleBO.fromJSON([responseJSON])[0];
            return new Promise(function (resolve) {
                resolve(responseStyleBO);
            })
        })
    }

    updateStyle(styleBO) {
        // PUT Request mit den erwarteten Headers
        return this.#fetchAdvanced(this.#updateStyleURL(styleBO.getID()), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(styleBO.toJSON())
        }).then(responseJSON => {
            let responseStyleBO = StyleBO.fromJSON([responseJSON])[0];
            return new Promise(function (resolve) {
                resolve(responseStyleBO);
            })
        })
    }

    deleteStyle(id) {
        return this.#fetchAdvanced(this.#deleteStyleURL(id), {
            method: 'DELETE'
        })
    }

// Outfit-bezogene Methoden
    getOutfit(id) {
        // Standardisierte GET-Anfrage mit expliziten Optionen
        return this.#fetchAdvanced(this.#getOutfitURL(id), {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain',
            }
        }).then(responseJSON => {
            let outfitBO = OutfitBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(outfitBO);
            })
        })
    }

    getOutfits() {
        // Standardisierte GET-Anfrage mit expliziten Optionen
        return this.#fetchAdvanced(this.#getOutfitsURL(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain',
            }
        }).then(responseJSON => {
            let outfitBOs = OutfitBO.fromJSON(responseJSON);
            return new Promise(function (resolve) {
                resolve(outfitBOs);
            })
        })
    }

    addOutfit(outfitData) {
        // POST-Anfrage bleibt unverändert
        return this.#fetchAdvanced(this.#addOutfitURL(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(outfitData)
        }).then(responseJSON => {
            let responseOutfitBO = OutfitBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseOutfitBO);
            })
        })
    }

    updateOutfit(outfitBO) {
        // PUT-Anfrage bleibt unverändert
        return this.#fetchAdvanced(this.#updateOutfitURL(outfitBO.getID()), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(outfitBO)
        }).then(responseJSON => {
            let responseOutfitBO = OutfitBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseOutfitBO);
            })
        })
    }

    deleteOutfit(id) {
        // DELETE-Anfrage bleibt unverändert
        return this.#fetchAdvanced(this.#deleteOutfitURL(id), {
            method: 'DELETE'
        })
    }

    validateOutfit(outfitId) {
        // Standardisierte GET-Anfrage mit expliziten Optionen
        return this.#fetchAdvanced(this.#validateOutfitURL(outfitId), {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain',
            }
        }).then(responseJSON => {
            return new Promise(function (resolve) {
                resolve(responseJSON.valid);
            })
        })
    }

    getPossibleOutfitsForStyle(styleId, wardrobeId) {
        // Standardisierte GET-Anfrage mit expliziten Optionen
        return this.#fetchAdvanced(this.#getPossibleOutfitsForStyleURL(styleId, wardrobeId), {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain',
            }
        }).then(responseJSON => {
            let possibleOutfits = KleidungsstueckBO.fromJSON(responseJSON);
            return new Promise(function (resolve) {
                resolve(possibleOutfits);
            })
        })
    }

    getPossibleOutfitCompletions(kleidungsstueckId, styleId) {
        // Standardisierte GET-Anfrage mit expliziten Optionen
        return this.#fetchAdvanced(this.#getPossibleOutfitCompletionsURL(styleId, kleidungsstueckId), {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain',
            }
        }).then(responseJSON => {
            return new Promise(function (resolve) {
                resolve(responseJSON);
            })
        })
    }

// Kardinalitäts-Methoden
    getKardinalitaeten() {
        return this.#fetchAdvanced(this.#getKardinalitaetenURL())
            .then(responseJSON => {
                let kardinalitaetBOs = KardinalitaetBO.fromJSON(responseJSON);
                return new Promise(function (resolve) {
                    resolve(kardinalitaetBOs);
                })
            })
    }

    addKardinalitaet(kardinalitaetBO) {
        return this.#fetchAdvanced(this.#addKardinalitaetURL(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(kardinalitaetBO)
        }).then(responseJSON => {
            let responseKardinalitaetBO = KardinalitaetBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseKardinalitaetBO);
            })
        })
    }

    updateKardinalitaet(kardinalitaetBO) {
        return this.#fetchAdvanced(this.#updateKardinalitaetURL(kardinalitaetBO.getID()), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(kardinalitaetBO)
        }).then(responseJSON => {
            let responseKardinalitaetBO = KardinalitaetBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseKardinalitaetBO);
            })
        })
    }

    deleteKardinalitaet(id) {
        return this.#fetchAdvanced(this.#deleteKardinalitaetURL(id), {
            method: 'DELETE'
        })
    }

// Mutex-Methoden
    getMutexConstraints() {
        return this.#fetchAdvanced(this.#getMutexURL())
            .then(responseJSON => {
                let mutexBOs = MutexBO.fromJSON(responseJSON);
                return new Promise(function (resolve) {
                    resolve(mutexBOs);
                })
            })
    }

    addMutexConstraint(mutexBO) {
        return this.#fetchAdvanced(this.#addMutexURL(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(mutexBO)
        }).then(responseJSON => {
            let responseMutexBO = MutexBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseMutexBO);
            })
        })
    }

    updateMutexConstraint(mutexBO) {
        return this.#fetchAdvanced(this.#updateMutexURL(mutexBO.getID()), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(mutexBO)
        }).then(responseJSON => {
            let responseMutexBO = MutexBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseMutexBO);
            })
        })
    }

    deleteMutexConstraint(id) {
        return this.#fetchAdvanced(this.#deleteMutexURL(id), {
            method: 'DELETE'
        })
    }

// Implikations-Methoden
    getImplikationen() {
        return this.#fetchAdvanced(this.#getImplikationenURL())
            .then(responseJSON => {
                let implikationBOs = ImplikationBO.fromJSON(responseJSON);
                return new Promise(function (resolve) {
                    resolve(implikationBOs);
                })
            })
    }

    addImplikation(implikationBO) {
        return this.#fetchAdvanced(this.#addImplikationURL(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(implikationBO)
        }).then(responseJSON => {
            let responseImplikationBO = ImplikationBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseImplikationBO);
            })
        })
    }

    updateImplikation(implikationBO) {
        return this.#fetchAdvanced(this.#updateImplikationURL(implikationBO.getID()), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(implikationBO)
        }).then(responseJSON => {
            let responseImplikationBO = ImplikationBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseImplikationBO);
            })
        })
    }

    deleteImplikation(id) {
        return this.#fetchAdvanced(this.#deleteImplikationURL(id), {
            method: 'DELETE'
        })
    }
}

export default KleiderschrankAPI;