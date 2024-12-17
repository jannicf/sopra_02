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
   * Konvertiert eine JSON-Antwort in ein OutfitBO Objekt bzw. Array von OutfitBO Objekten.
   *
   * @param {*} outfits - JSON-Daten aus dem Backend
   */
  static fromJSON(outfits) {
    let result = [];

    if (Array.isArray(outfits)) {
      outfits.forEach((o) => {
        let outfit = new OutfitBO();
        outfit.setID(o.id);

        // Style konvertieren wenn vorhanden
        if (o.style) {
          outfit.setStyle(StyleBO.fromJSON([o.style])[0]);
        }

        // Bausteine (Kleidungsstücke) konvertieren wenn vorhanden
        if (o.bausteine && Array.isArray(o.bausteine)) {
          o.bausteine.forEach(baustein => {
            const kleidungsstueck = KleidungsstueckBO.fromJSON([baustein])[0];
            outfit.addBaustein(kleidungsstueck);
          });
        }

        result.push(outfit);
      });
    } else if (outfits) {
      let outfit = new OutfitBO();
      outfit.setID(outfits.id);

      if (outfits.style) {
        outfit.setStyle(StyleBO.fromJSON([outfits.style])[0]);
      }

      if (outfits.bausteine && Array.isArray(outfits.bausteine)) {
        outfits.bausteine.forEach(baustein => {
          const kleidungsstueck = KleidungsstueckBO.fromJSON([baustein])[0];
          outfit.addBaustein(kleidungsstueck);
        });
      }

      result.push(outfit);
    }

    return result;
  }
}