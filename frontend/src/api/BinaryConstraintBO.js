import ConstraintBO from './ConstraintBO.js';

/**
 * Abstrakte Klasse für binäre Constraints im digitalen Kleiderschranksystem.
 * Ein binäres Constraint bezieht sich auf zwei Bezugsobjekte vom Typ KleidungstypBO.
 */
export default class BinaryConstraintBO extends ConstraintBO {
  /**
   * Initialisiert ein binäres Constraint.
   */
  constructor() {
    super();
    this.bezugsobjekt1 = null;  // Objekt der Klasse KleidungstypBO
    this.bezugsobjekt2 = null;  // Objekt der Klasse KleidungstypBO
  }

  /**
   * Setzen des ersten Bezugsobjekts.
   *
   * @param {*} bezugsobjekt1 - Das zu setzende Bezugsobjekt
   */
  setBezugsobjekt1(bezugsobjekt1) {
    this.bezugsobjekt1 = bezugsobjekt1;
  }

  /**
   * Auslesen des ersten Bezugsobjekts.
   */
  getBezugsobjekt1() {
    return this.bezugsobjekt1;
  }

  /**
   * Setzen des zweiten Bezugsobjekts.
   *
   * @param {*} bezugsobjekt2 - Das zu setzende Bezugsobjekt
   */
  setBezugsobjekt2(bezugsobjekt2) {
    this.bezugsobjekt2 = bezugsobjekt2;
  }

  /**
   * Auslesen des zweiten Bezugsobjekts.
   */
  getBezugsobjekt2() {
    return this.bezugsobjekt2;
  }

  /**
   * Erstellt ein BinaryConstraintBO aus einem JSON-Objekt.
   *
   * @param {Object} json - JSON-Daten aus dem Backend
   */
  static fromJSON(json) {
    // Wird von den Klassen Implikation, Mutex und Kardinalität überschrieben
  }
}