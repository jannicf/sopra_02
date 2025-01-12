import BusinessObject from './BusinessObject.js';
import StyleBO from './StyleBO.js';
import KleidungsstueckBO from './KleidungsstueckBO.js';

/**
 * Repräsentiert ein Outfit im digitalen Kleiderschranksystem.
 */
export default class OutfitBO extends BusinessObject {
  /**
   * Erstellt ein OutfitBO Objekt.
   */
  constructor() {
    super();
    this.bausteine = [];  // Array von KleidungsstueckBO Objekten
    this.style = null;    // StyleBO Objekt
     this.kleiderschrank_id = null;
  }

  /**
   * Fügt ein Kleidungsstück zum Outfit hinzu.
   *
   * @param {KleidungsstueckBO} aKleidungsstueck - Das hinzuzufügende Kleidungsstück
   */
  addBaustein(aKleidungsstueck) {
    if (aKleidungsstueck instanceof KleidungsstueckBO) {
      this.bausteine.push(aKleidungsstueck);
    }
  }

  /**
   * Entfernt ein Kleidungsstück aus dem Outfit.
   *
   * @param {KleidungsstueckBO} aKleidungsstueck - Das zu entfernende Kleidungsstück
   */
  removeBaustein(aKleidungsstueck) {
    const index = this.bausteine.findIndex(b => b.getID() === aKleidungsstueck.getID());
    if (index > -1) {
      this.bausteine.splice(index, 1);
    }
  }

  /**
   * Gibt alle Kleidungsstücke des Outfits zurück.
   */
  getBausteine() {
    return this.bausteine;
  }

  /**
   * Setzt den Style des Outfits.
   *
   * @param {StyleBO} aStyle - Der zu setzende Style
   */
  setStyle(aStyle) {
    if (aStyle instanceof StyleBO) {
      this.style = aStyle;
    }
  }

  /**
   * Gibt den Style des Outfits zurück.
   */
  getStyle() {
    return this.style;
  }

  /**
   * Gibt die Kleiderschrank_id des Outfits zurück.
   */
   setKleiderschrankId(id) {
        this.kleiderschrank_id = id;
    }

    getKleiderschrankId() {
        return this.kleiderschrank_id;
    }

  /**
   * Konvertiert eine JSON-Antwort in ein OutfitBO Objekt bzw. Array von OutfitBO Objekten.
   *
   * @param {*} outfits - JSON-Daten aus dem Backend
   */
  static fromJSON(outfits) {
      let result = [];

      // Debug-Logging
      console.log("OutfitBO.fromJSON input:", outfits);

      if (Array.isArray(outfits)) {
        outfits.forEach((o) => {
          let outfit = new OutfitBO();
          outfit.setID(o.id);
          outfit.setKleiderschrankId(o.kleiderschrank_id);

                      // Style als StyleBO Objekt erstellen
            if (o.style) {
                // Wir erstellen ein neues StyleBO mit der ID
                const style = new StyleBO();
                style.setID(o.style);
                outfit.setStyle(style);
            }

            // Bausteine (Kleidungsstücke) verarbeiten
            if (o.bausteine && Array.isArray(o.bausteine)) {
                o.bausteine.forEach(bausteinId => {
                    // Für jede ID ein neues KleidungsstueckBO erstellen
                    const kleidungsstueck = new KleidungsstueckBO();
                    kleidungsstueck.setID(bausteinId);
                    outfit.addBaustein(kleidungsstueck);
                });
            }

          console.log("Original Outfit-Daten:", o);  // Zeigt die rohen Daten vom Backend
          console.log("Style-Daten:", o.style);      // Zeigt nur die Style-Daten
          console.log("Bausteine-Daten:", o.bausteine); // Zeigt die Bausteine-Daten

          result.push(outfit);
        });
      }

      return result;
    }
}