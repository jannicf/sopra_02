import BusinessObject from './BusinessObject.js';
import StyleBO from "./StyleBO.js";

/**
* Repräsentiert einen Kleidungstyp im digitalen Kleiderschranksystem.
*/
export default class KleidungstypBO extends BusinessObject {
        /**
        * Erstellt ein KleidungstypBO Objekt.
        */
        constructor() {
        super();
        this.bezeichnung = "";
        this.verwendungen = []; // Array von StyleBO Objekten
        this.kleiderschrankId = null;
        }

        /**
        * Setzt die Bezeichnung des Kleidungstyps.
        *
        * @param {String} aBezeichnung - Die neue Bezeichnung des Kleidungstyps
        */
        setBezeichnung(aBezeichnung) {
        this.bezeichnung = aBezeichnung;
        }

        /**
        * Gibt die Bezeichnung des Kleidungstyps zurück.
        */
        getBezeichnung() {
        return this.bezeichnung;
        }

        setKleiderschrankId(id) {
            this.kleiderschrankId = id;
        }
        getKleiderschrankId() {
            return this.kleiderschrankId;
        }

        /**
        * Fügt einen Style zur Liste der Verwendungen hinzu.
        * Fügt auch diesem Style den Kleidungstyp hinzu, wenn er noch nicht enthalten ist.
        *
        * @param {StyleBO} aStyle - Der hinzuzufügende Style
        */
         addVerwendung(aStyle) {
            // Sicherstellen, dass verwendungen immer ein Array ist
            if (!this.verwendungen) {
                this.verwendungen = [];
            }

            if (aStyle instanceof StyleBO) {
                this.verwendungen.push(aStyle);
                // Auch dem Style den Kleidungstyp hinzufügen, wenn er nicht schon in der Liste ist
                if (!aStyle.getFeatures().some(feature => feature.getID() === this.getID())) {
                    aStyle.addFeature(this);
                }
            }
        }

        /**
        * Entfernt einen Style aus der Liste der Verwendungen.
        * Entfernt auch den Kleidungstyp aus diesem Style.
        *
        * @param {StyleBO} aStyle - Der zu entfernende Style
        */
        deleteVerwendung(aStyle) {
        const index = this.verwendungen.findIndex(v => v.getID() === aStyle.getId());
        if (index > -1) {
         this.verwendungen.splice(index, 1);
         // Auch aus der anderen Richtung löschen
         if (aStyle.getFeatures().some(feature => feature.getID() === this.getID())) {
           aStyle.removeFeature(this);
         }
        }
        }

        /**
        * Gibt alle Verwendungen (Styles) des Kleidungstyps zurück.
        */
        getVerwendungen() {
            return this.verwendungen || [];
        }

        /**
        * Konvertiert eine JSON-Antwort in ein KleidungstypBO Objekt bzw. Array von KleidungstypBO Objekten.
        *
        * @param {*} clothingTypes - JSON-Daten aus dem Backend
        */
        static fromJSON(clothingTypes) {
        let result = [];

        // Falls ein Array von Kleidungstypen zurückkommt:
        if (Array.isArray(clothingTypes)) {
            clothingTypes.forEach(k => {
                let kleidungstyp = new KleidungstypBO();
                // Hier ID + Bezeichnung + KleiderschrankId setzen
                kleidungstyp.setID(k.id);
                kleidungstyp.setBezeichnung(k.bezeichnung);
                kleidungstyp.setKleiderschrankId(k.kleiderschrank_id);

                // Wenn "Verwendungen" wirklich eine Liste von Style-Objekten ist
                if (Array.isArray(k.verwendungen)) {
                    k.verwendungen.forEach(styleObj => {
                        const style = new StyleBO();
                        style.setID(styleObj.id);
                        style.setName(styleObj.name);
                        kleidungstyp.addVerwendung(style);
                    });
                }

                result.push(kleidungstyp);
            });
        }
        // Falls nur ein einzelner Kleidungstyp als Objekt zurückkommt:
        else if (clothingTypes && typeof clothingTypes === 'object') {
            let k = clothingTypes;
            let kleidungstyp = new KleidungstypBO();
            kleidungstyp.setID(k.id);
            kleidungstyp.setBezeichnung(k.bezeichnung);
            kleidungstyp.setKleiderschrankId(k.kleiderschrank_id);

            if (Array.isArray(k.verwendungen)) {
                k.verwendungen.forEach(styleData => {
                    const style = new StyleBO();
                    style.setID(styleData.id);
                    style.setName(styleData.name);
                    kleidungstyp.addVerwendung(style);
                });
            }
            result.push(kleidungstyp);
        }
        return result;
    }
}