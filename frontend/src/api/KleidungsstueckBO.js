import BusinessObject from './BusinessObject.js';
import KleidungstypBO from "./KleidungstypBO.js";

/**
 * Repräsentiert ein Kleidungsstück im digitalen Kleiderschranksystem.
 */
export default class KleidungsstueckBO extends BusinessObject {
  /**
   * Erstellt ein KleidungsstueckBO Objekt.
   */
  constructor() {
    super();
    this.name = "";
    this.typ = null;
    this.kleiderschrankId = null;
  }

  /**
   * Setzt den Namen des Kleidungsstücks.
   *
   * @param {String} aName - Der neue Name des Kleidungsstücks
   */
  setName(aName) {
    this.name = aName;
  }

  /**
   * Gibt den Namen des Kleidungsstücks zurück.
   */
  getName() {
    return this.name;
  }

  /**
   * Setzt den Typ des Kleidungsstücks.
   *
   * @param {KleidungstypBO} aTyp - Der neue Typ des Kleidungsstücks
   */
  setTyp(aTyp) {
    if (aTyp instanceof KleidungstypBO) {
      this.typ = aTyp;
    }
  }

  /**
   * Gibt den Typ des Kleidungsstücks zurück.
   */
  getTyp() {
    return this.typ;
  }

  /**
   * Setzt die ID des zugehörigen Kleiderschranks.
   *
   * @param {Number} aKleiderschrankId - Die neue Kleiderschrank ID
   */
  setKleiderschrankId(aKleiderschrankId) {
    this.kleiderschrankId = aKleiderschrankId;
  }

  /**
   * Gibt die ID des zugehörigen Kleiderschranks zurück.
   */
  getKleiderschrankId() {
    return this.kleiderschrankId;
  }

  /**
   * Gibt ein Array von KleidungsstueckBO Objekten aus einer gegebenen JSON-Struktur zurück.
   *
   * @param {*} json - JSON-Daten, die in KleidungsstueckBO Objekte umgewandelt werden sollen
   */
  static fromJSON(json) {
    let result = [];

    if (Array.isArray(json)) {
      json.forEach((k) => {
        let kleidungsstueck = new KleidungsstueckBO();
        kleidungsstueck.setId(k.id);
        kleidungsstueck.setName(k.name);

        if (k.typ) {
          kleidungsstueck.setTyp(KleidungstypBO.fromJSON([k.typ])[0]);
        }

        kleidungsstueck.setKleiderschrankId(k.kleiderschrank_id);
        result.push(kleidungsstueck);
      })
    } else if (json) {
      let kleidungsstueck = new KleidungsstueckBO();
      kleidungsstueck.setId(json.id);
      kleidungsstueck.setName(json.name);

      if (json.typ) {
        kleidungsstueck.setTyp(KleidungstypBO.fromJSON([json.typ])[0]);
      }

      kleidungsstueck.setKleiderschrankId(json.kleiderschrank_id);
      result.push(kleidungsstueck);
    }

    return result;
  }
}