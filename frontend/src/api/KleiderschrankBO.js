import BusinessObject from './BusinessObject.js';
import PersonBO from "./PersonBO.js";
import KleidungsstueckBO from "./KleidungsstueckBO.js";

/**
 * Repräsentiert einen Kleiderschrank im digitalen Kleiderschranksystem.
 */
export default class KleiderschrankBO extends BusinessObject {
  /**
   * Erstellt ein KleiderschrankBO Objekt mit den gegebenen Attributen.
   */
  constructor() {
    super();
    this.eigentuemer = null;
    this.inhalt = []; // Array für Kleidungsstücke
    this.name = "";
  }

  /**
   * Setzt den Namen des Kleiderschranks.
   *
   * @param {String} aName - Der neue Name des Kleiderschranks
   */
  setName(aName) {
    this.name = aName;
  }

  /**
   * Gibt den Namen des Kleiderschranks zurück.
   */
  getName() {
    return this.name;
  }

  /**
   * Setzt den Eigentümer des Kleiderschranks.
   *
   * @param {PersonBO} aEigentuemer - Der neue Eigentümer des Kleiderschranks
   */
  setEigentuemer(aEigentuemer) {
    if (aEigentuemer instanceof PersonBO) {
      this.eigentuemer = aEigentuemer;
    }
  }

  /**
   * Gibt den Eigentümer des Kleiderschranks zurück.
   */
  getEigentuemer() {
    return this.eigentuemer;
  }

  /**
   * Gibt den Inhalt (alle Kleidungsstücke) des Kleiderschranks zurück.
   */
  getInhalt() {
    return this.inhalt;
  }

  /**
   * Fügt ein Kleidungsstück zum Kleiderschrank hinzu.
   *
   * @param {KleidungsstueckBO} aKleidungsstueck - Das hinzuzufügende Kleidungsstück
   */
  addKleidungsstueck(aKleidungsstueck) {
    if (aKleidungsstueck instanceof KleidungsstueckBO) {
      this.inhalt.push(aKleidungsstueck);
    }
  }

  /**
   * Entfernt ein Kleidungsstück aus dem Kleiderschrank.
   *
   * @param {KleidungsstueckBO} aKleidungsstueck - Das zu entfernende Kleidungsstück
   */
  deleteKleidungsstueck(aKleidungsstueck) {
    const index = this.inhalt.findIndex(k => k.getId() === aKleidungsstueck.getId());
    if (index > -1) {
      this.inhalt.splice(index, 1);
    }
  }

  /**
   * Gibt ein Array von KleiderschrankBO Objekten aus einer gegebenen JSON-Struktur zurück.
   *
   * @param {*} wardrobes - JSON-Daten, die in KleiderschrankBO Objekte umgewandelt werden sollen
   */
  // KleiderschrankBO.js
static fromJSON(wardrobes) {
    let result = [];

    if (Array.isArray(wardrobes)) {
        wardrobes.forEach((k) => {
            let kleiderschrank = new KleiderschrankBO();
            kleiderschrank.setID(k.id);
            kleiderschrank.setName(k.name);

            // Wenn ein Eigentümer vorhanden ist, diesen setzen
            if (k.eigentuemer) {
                const PersonBO = require('./PersonBO').default;
                const eigentuemer = PersonBO.fromJSON([k.eigentuemer])[0];
                kleiderschrank.setEigentuemer(eigentuemer);
            }

            if (k.inhalt && Array.isArray(k.inhalt)) {
                k.inhalt.forEach(item => {
                    const kleidungsstueck = KleidungsstueckBO.fromJSON([item])[0];
                    kleiderschrank.addKleidungsstueck(kleidungsstueck);
                });
            }

            result.push(kleiderschrank);
        });
    } else if (wardrobes) {
        let kleiderschrank = new KleiderschrankBO();
        kleiderschrank.setID(wardrobes.id);
        kleiderschrank.setName(wardrobes.name);

        // Wenn ein Eigentümer vorhanden ist, diesen setzen
        if (wardrobes.eigentuemer) {
            const PersonBO = require('./PersonBO').default;
            const eigentuemer = PersonBO.fromJSON([wardrobes.eigentuemer])[0];
            kleiderschrank.setEigentuemer(eigentuemer);
        }

        if (wardrobes.inhalt && Array.isArray(wardrobes.inhalt)) {
            wardrobes.inhalt.forEach(item => {
                const kleidungsstueck = KleidungsstueckBO.fromJSON([item])[0];
                kleiderschrank.addKleidungsstueck(kleidungsstueck);
            });
        }

        result.push(kleiderschrank);
    }

    return result;
  }
}

