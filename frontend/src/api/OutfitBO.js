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

      // Debug-Logging
      console.log("OutfitBO.fromJSON input:", outfits);

      if (Array.isArray(outfits)) {
        outfits.forEach((o) => {
          let outfit = new OutfitBO();
          outfit.setID(o.id);

          // Verbesserte Style-Verarbeitung
          if (o.style) {
            // Wenn style direkt eine ID ist
            if (typeof o.style === 'number') {
              const style = new StyleBO();
              style.setID(o.style);
              outfit.setStyle(style);
            }
            // Wenn style ein Objekt ist
            else if (typeof o.style === 'object') {
              const style = StyleBO.fromJSON([o.style])[0];
              outfit.setStyle(style);
            }
          }

          // Verbesserte Bausteine-Verarbeitung
          if (o.bausteine && Array.isArray(o.bausteine)) {
            o.bausteine.forEach(baustein => {
              // Wenn baustein direkt eine ID ist
              if (typeof baustein === 'number') {
                const kleidungsstueck = new KleidungsstueckBO();
                kleidungsstueck.setID(baustein);
                outfit.addBaustein(kleidungsstueck);
              }
              // Wenn baustein ein Objekt ist
              else if (typeof baustein === 'object') {
                const kleidungsstueck = KleidungsstueckBO.fromJSON([baustein])[0];
                outfit.addBaustein(kleidungsstueck);
              }
            });
          }

          // Debug-Logging für jedes konvertierte Outfit
          console.log("Konvertiertes Outfit:", {
            id: outfit.getID(),
            style: outfit.getStyle(),
            bausteine: outfit.getBausteine()
          });

          result.push(outfit);
        });
      }

      return result;
    }
}