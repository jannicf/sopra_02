import ConstraintBO from './ConstraintBO.js';

/**
 * Abstrakte Klasse für unäre Constraints im digitalen Kleiderschranksystem.
 * Ein unäres Constraint bezieht sich auf ein einzelnes Bezugsobjekt vom Typ KleidungstypBO.
 */
export default class UnaryConstraintBO extends ConstraintBO {
  /**
   * Initialisiert ein unäres Constraint.
   */
  constructor() {
    super();
    this.bezugsobjekt = null;  // Objekt der Klasse KleidungstypBO
  }

  /**
   * Setzen des Bezugsobjekts.
   *
   * @param {*} bezugsobjekt - Das zu setzende Bezugsobjekt
   */
  setBezugsobjekt(bezugsobjekt) {
    this.bezugsobjekt = bezugsobjekt;
  }

  /**
   * Auslesen des Bezugsobjekts.
   */
  getBezugsobjekt() {
    return this.bezugsobjekt;
  }

  /**
   * Überprüft, ob das Constraint erfüllt ist.
   */
  checkConstraint() {
    // Wird von den Klassen Implikation, Mutex und Kardinalität überschrieben
  }

  /**
   * Erstellt ein UnaryConstraintBO aus einem JSON-Objekt.
   *
   * @param {Object} json - JSON-Daten aus dem Backend
   */
  static fromJSON(json) {
    // Wird von den Klassen Implikation, Mutex und Kardinalität überschrieben
  }
}