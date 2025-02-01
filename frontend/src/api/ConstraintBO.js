import BusinessObject from './BusinessObject.js';

/**
 * Abstrakte Basisklasse für alle Constraints im digitalen Kleiderschranksystem.
 */
export default class ConstraintBO extends BusinessObject {
  /**
   * Initialisiert ein Constraint.
   */
  constructor() {
    super();
    this.style = null;
  }

  /**
   * Setzen des Styles für den Constraint.
   *
   * @param {*} style - Der zu setzende Style
   */
  setStyle(style) {
    this.style = style;
  }

  /**
   * Auslesen des Styles.
   */
  getStyle() {
    return this.style;
  }

  /**
   * Erstellt ein ConstraintBO aus einem JSON-Objekt.
   *
   * @param {Object} json - JSON-Daten aus dem Backend
   */
  static fromJSON(json) {
    // Wird von den Klassen Implikation, Mutex und Kardinalität überschrieben
  }
}