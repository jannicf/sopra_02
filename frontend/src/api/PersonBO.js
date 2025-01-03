import BusinessObject from './BusinessObject.js';
import KleiderschrankBO from "./KleiderschrankBO";

/**
 * Repräsentiert eine Person im digitalen Kleiderschranksystem.
 */
export default class PersonBO extends BusinessObject {

  /**
   * Erstellt ein PersonBO Objekt.
   */
  constructor() {
    super();
    this.vorname = "";
    this.nachname = "";
    this.nickname = "";
    this.google_id = "";
    this.kleiderschrank = null;
  }

  /**
   * Setzt den Vornamen der Person.
   *
   * @param {String} aFirstName - Der neue Vorname dieser Person
   */
  setVorname(aFirstName) {
    this.vorname = aFirstName;
  }

  /**
   * Gibt den Vornamen der Person zurück.
   */
  getVorname() {
    return this.vorname;
  }

  /**
   * Setzt den Nachnamen der Person.
   *
   * @param {String} aLastName - Der neue Nachname dieser Person
   */
  setNachname(aLastName) {
    this.nachname = aLastName;
  }

  /**
   * Gibt den Nachnamen der Person zurück.
   */
  getNachname() {
    return this.nachname;
  }

  /**
   * Setzt den Nickname der Person.
   *
   * @param {String} aNickname - Der neue Nickname dieser Person
   */
  setNickname(aNickname) {
    this.nickname = aNickname;
  }

  /**
   * Gibt den Nickname der Person zurück.
   */
  getNickname() {
    return this.nickname;
  }

  /**
   * Setzt die Google ID der Person.
   *
   * @param {String} aGoogleId - Die neue Google ID dieser Person
   */
  setGoogleId(aGoogleId) {
    this.google_id = aGoogleId;
  }

  /**
   * Gibt die Google ID der Person zurück.
   */
  getGoogleId() {
    return this.google_id;
  }

  /**
   * Setzt den Kleiderschrank der Person.
   *
   * @param {KleiderschrankBO} aKleiderschrank - Der Kleiderschrank dieser Person
   */
  setKleiderschrank(aKleiderschrank) {
    this.kleiderschrank = aKleiderschrank;
  }

  /**
   * Gibt den Kleiderschrank der Person zurück.
   */
  getKleiderschrank() {
    return this.kleiderschrank;
  }

  /**
   * Gibt ein Array von PersonBO Objekten aus einer gegebenen JSON-Struktur zurück.
   *
   * @param {*} persons - JSON-Daten, die in PersonBO Objekte umgewandelt werden sollen
   */
  static fromJSON(persons) {
        let result = new PersonBO();

        Object.assign(result, persons);

        // Konvertiere die Attribute vom Backend in Frontend-Repräsentation
        result.id = persons.id;
        result.vorname = persons.vorname;
        result.nachname = persons.nachname;
        result.nickname = persons.nickname;
        result.google_id = persons.google_id;

        // Wichtig: Konvertiere den Kleiderschrank in ein KleiderschrankBO
        if (persons.kleiderschrank) {
            result.kleiderschrank = KleiderschrankBO.fromJSON(persons.kleiderschrank);
        }

        return result;
    }
}