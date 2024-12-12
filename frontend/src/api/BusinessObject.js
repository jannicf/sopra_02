/**
 * Basisklasse für alle BusinessObjects, die standardmäßig ein ID-Feld besitzen.
 */
export default class BusinessObject {

  /**
   * Der Null-Konstruktor.
   */
  constructor() {
    this.id = 0;
  }

  /**
   * Setzt die ID dieses BusinessObjects.
   *
   * @param {*} aId - die neue ID dieses BusinessObjects
   */
  setID(aId) {
    this.id = aId;
  }

  /**
   * Gibt die ID dieses BusinessObjects zurück.
   */
  getID() {
    return this.id;
  }

  /**
   * Gibt eine String-Repräsentation dieses Objekts zurück. Dies ist nützlich für Debug-Zwecke.
   */
  toString() {
    let result = '';
    for (var prop in this) {
      result += prop + ': ' + this[prop] + ' ';
    }
    return result;
  }
}