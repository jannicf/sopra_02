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

    // Cache für die Person zur Speicherung
    static #cachedPerson = null;

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
    #getPersonByGoogleIdURL = (id) => `${this.#KleiderschrankServerBaseURL}/persons-by-google-id/${id}`;
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
    #getKleidungstypByKleiderschrankIdURL = (kleiderschrankId) =>
    `${this.#KleiderschrankServerBaseURL}/clothing-types/by-kleiderschrank/${kleiderschrankId}`;
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
    #getOutfitByKleiderschrankIdURL = (kleiderschrankId) =>
    `${this.#KleiderschrankServerBaseURL}/outfits/by-kleiderschrank/${kleiderschrankId}`;
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
    getPersonByGoogleId(id) {
        return this.#fetchAdvanced(this.#getPersonByGoogleIdURL(id))
            .then(responseJSON => {
                if (responseJSON && responseJSON.id && responseJSON.google_id) {
                    const person = PersonBO.fromJSON(responseJSON);
                    if (person && person.getKleiderschrank()) {
                        KleiderschrankAPI.#cachedPerson = person;
                        return person;
                    }
                }

                if (KleiderschrankAPI.#cachedPerson) {
                    if (KleiderschrankAPI.#cachedPerson.getGoogleId() == id) {
                        return KleiderschrankAPI.#cachedPerson;
                    }
                }
                return null;
            });
    }


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
    // Debug Log vor dem Request
    console.log("AddPerson Input:", {
        person: personBO,
        hasKleiderschrank: personBO.getKleiderschrank() !== null,
        kleiderschrankName: personBO.getKleiderschrank()?.getName()
    });

    const requestData = {
        vorname: personBO.getVorname(),
        nachname: personBO.getNachname(),
        nickname: personBO.getNickname(),
        google_id: personBO.getGoogleId()
    };

    // Prüfen und Hinzufügen der Kleiderschrank-Daten
    if (personBO.getKleiderschrank()) {
        requestData.kleiderschrank = {
            name: personBO.getKleiderschrank().getName()
        };
        console.log("RequestData mit Kleiderschrank:", requestData);
    }

    return this.#fetchAdvanced(this.#addPersonURL(), {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
        },
        body: JSON.stringify(requestData)
    }).then(responseJSON => {
        console.log("Server Response:", responseJSON);
        const person = PersonBO.fromJSON(responseJSON);
        return person;
        });
    }

    updatePerson(personBO) {
    // Erstelle ein neues Objekt mit den benötigten Daten
    const requestData = {
        id: personBO.getID(),
        vorname: personBO.getVorname(),
        nachname: personBO.getNachname(),
        nickname: personBO.getNickname(),
        google_id: personBO.getGoogleId(),
        kleiderschrank: personBO.getKleiderschrank() ? {
            id: personBO.getKleiderschrank().getID(),
            name: personBO.getKleiderschrank().getName()
        } : null
    };

    return this.#fetchAdvanced(this.#updatePersonURL(personBO.getID()), {
        method: 'PUT',
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
        },
        body: JSON.stringify(requestData)
    }).then(responseJSON => {
        let responsePersonBO = PersonBO.fromJSON(responseJSON);
        return responsePersonBO;
        });
    }

    deletePerson(person) {
        return fetch(this.#deletePersonURL(person.getID()), {
            method: 'DELETE'
        }).then(res => {
            if (!res.ok) {
                throw Error(`${res.status} ${res.statusText}`);
            }
            return; // Keine JSON-Antwort erwartet
        });
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

    // KleiderschrankAPI.js

updateKleiderschrank = async (kleiderschrank) => {
    // Erstelle ein einfaches Objekt für den Request
    const requestData = {
        id: kleiderschrank.getID(),
        name: kleiderschrank.getName(),
        eigentuemer_id: kleiderschrank.getEigentuemer()?.getID()
    };

    return this.#fetchAdvanced(this.#updateKleiderschrankURL(kleiderschrank.getID()), {
        method: 'PUT',
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
        },
        body: JSON.stringify(requestData)
    }).then(responseJSON => {
        return KleiderschrankBO.fromJSON(responseJSON)[0];
        });
    };

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

    getKleidungsstueckByKleiderschrankId(kleiderschrankId) {
        // Standardisierte GET-Anfrage mit expliziten Optionen
        return this.#fetchAdvanced(this.#getKleidungsstueckeURL(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain',
            }
        }).then(responseJSON => {
            // Array von Kleidungsstück-Objekten erstellen, aber nur die,
            // die zum spezifischen Kleiderschrank gehören
            let kleidungsstueckBOs = KleidungsstueckBO.fromJSON(responseJSON);
            // Filtern nach kleiderschrank_id
            return kleidungsstueckBOs.filter(kleidungsstueck =>
                kleidungsstueck.getKleiderschrankId() === kleiderschrankId
            );
        })
    }

    updateKleidungsstueck(kleidungsstueck) {
        // Prüfen ob es ein KleidungsstueckBO oder ein einfaches Objekt ist
        const isBusinessObject = typeof kleidungsstueck.getID === 'function';

        const requestBody = {
            id: isBusinessObject ? kleidungsstueck.getID() : kleidungsstueck.id,
            name: isBusinessObject ? kleidungsstueck.getName() : kleidungsstueck.name,
            typ_id: isBusinessObject ? kleidungsstueck.getTyp().getID() : kleidungsstueck.typ_id,
            kleiderschrank_id: isBusinessObject ? kleidungsstueck.getKleiderschrankId() : kleidungsstueck.kleiderschrank_id
        };

        const id = isBusinessObject ? kleidungsstueck.getID() : kleidungsstueck.id;

        return this.#fetchAdvanced(this.#updateKleidungsstueckURL(id), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(requestBody)
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

    getKleidungstypByKleiderschrankId(kleiderschrankId) {
        return this.#fetchAdvanced(this.#getKleidungstypByKleiderschrankIdURL(kleiderschrankId), {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain',
            }
        }).then(responseJSON => {
            return KleidungstypBO.fromJSON(responseJSON);
        })
}

    addKleidungstyp(kleidungstypData) {
        // Konvertiere die Daten in ein Format, das das Backend erwartet
        const requestData = {
            id: 0,
            bezeichnung: kleidungstypData.bezeichnung,
            verwendungen: kleidungstypData.verwendungen.map(styleId => ({
                id: styleId,
            }))
        };

        return this.#fetchAdvanced(this.#addKleidungstypURL(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(requestData)
        }).then(responseJSON => {
            let responseKleidungstypBO = KleidungstypBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseKleidungstypBO);
            })
        })
    }

    updateKleidungstyp(kleidungstypData) {
        // Konvertiere die Daten in ein Format, das das Backend erwartet
        const requestData = {
            id: kleidungstypData.id,
            bezeichnung: kleidungstypData.bezeichnung,
            verwendungen: kleidungstypData.verwendungen.map(styleId => ({
                id: styleId,
            }))
        };

        return this.#fetchAdvanced(this.#updateKleidungstypURL(kleidungstypData.id), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(requestData)
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

    getStylesByKleiderschrankId(kleiderschrankId) {
        return this.#fetchAdvanced(this.#getStylesURL())
        .then(styles => styles.filter(s => s.kleiderschrank_id === kleiderschrankId));
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

    addStyle(styleData) {
        return this.#fetchAdvanced(this.#addStyleURL(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(styleData)
        }).then(responseJSON => {
            let responseStyleBO = StyleBO.fromJSON([responseJSON])[0];
            return new Promise(function (resolve) {
                resolve(responseStyleBO);
        })
    })
}

    updateStyle(id, styleData) {
        const requestData = {
            name: styleData.name,
            features: Array.isArray(styleData.features) ? styleData.features : [],
            constraints: styleData.constraints // Füge Constraints hinzu
        };

        return this.#fetchAdvanced(this.#updateStyleURL(id), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(requestData)
        }).then(responseJSON => {
            let updatedStyle = StyleBO.fromJSON([responseJSON])[0];
            return new Promise(function (resolve) {
                resolve(updatedStyle);
            });
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

    async getOutfits() {
        try {
          const responseJSON = await this.#fetchAdvanced(this.#getOutfitsURL());

          const outfits = OutfitBO.fromJSON(responseJSON);

          // Lade für jedes Outfit die vollständigen Informationen
          const outfitsWithDetails = await Promise.all(outfits.map(async (outfit) => {
            // Style vollständig laden
            if (outfit.getStyle()) {
              const style = await this.getStyle(outfit.getStyle().getID());
              outfit.setStyle(style);
            }

            // Kleidungsstücke vollständig laden
            const bausteine = outfit.getBausteine();
            if (bausteine && bausteine.length > 0) {
              const vollstaendigeBausteine = await Promise.all(
                bausteine.map(async (baustein) => {
                  const kleidungsstueck = await this.getKleidungsstueck(baustein.getID());
                  return kleidungsstueck;
                })
              );
              // Alte Bausteine entfernen
              while(outfit.getBausteine().length > 0) {
                outfit.getBausteine().pop();
              }
              // Neue vollständige Bausteine hinzufügen
              vollstaendigeBausteine.forEach(baustein => {
                outfit.addBaustein(baustein);
              });
            }

            return outfit;
          }));

          return outfitsWithDetails;
        } catch (error) {
          throw error;
        }
      }

    getOutfitByKleiderschrankId(kleiderschrankId) {
    return this.#fetchAdvanced(this.#getOutfitByKleiderschrankIdURL(kleiderschrankId), {
        method: 'GET',
        headers: {
            'Accept': 'application/json, text/plain',
        }
    }).then(responseJSON => {
        return OutfitBO.fromJSON(responseJSON);
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
            body: JSON.stringify(outfitData),
            kleiderschrank_id: outfitData.kleiderschrank_id
        }).then(responseJSON => {
            let responseOutfitBO = OutfitBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseOutfitBO);
            })
        })
    }

    updateOutfit(outfitBO) {

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
        return this.#fetchAdvanced(`${this.#KleiderschrankServerBaseURL}/outfits/${id}`, {
            method: 'DELETE'
        });
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

    createOutfitFromBaseItem(basisId, ausgewaehlteIds, styleId, kleiderschrankId) {
    const data = {
        style: styleId,
        bausteine: [basisId, ...ausgewaehlteIds],
        kleiderschrank_id: kleiderschrankId
    };

    return this.#fetchAdvanced(this.#addOutfitURL(), {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data)
        }).then(responseJSON => {
            let responseOutfitBO = OutfitBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseOutfitBO);
            })
        });
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
    return this.#fetchAdvanced(this.#getPossibleOutfitCompletionsURL(styleId, kleidungsstueckId))
        .then(responseJSON => {
            return new Promise((resolve) => {
                resolve(KleidungsstueckBO.fromJSON(responseJSON));
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