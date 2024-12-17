import BusinessObject from './BusinessObject.js';
import KleidungstypBO from "./KleidungstypBO.js";
import ConstraintBO from "./ConstraintBO.js"; // Basis-Klasse für Constraints

/**
 * Repräsentiert einen Style im digitalen Kleiderschranksystem.
 */
export default class StyleBO extends BusinessObject {
  /**
   * Erstellt ein StyleBO Objekt.
   */
  constructor() {
    super();
    this.name = "";
    this.constraints = []; // Array der Constraints in diesem
    this.features = [];    // Array der Kleidungstypen
  }

  /**
   * Setzt den Namen des Styles.
   *
   * @param {String} aName - Der neue Name des Styles
   */
  setName(aName) {
    this.name = aName;
  }

  /**
   * Gibt den Namen des Styles zurück.
   */
  getName() {
    return this.name;
  }

  /**
   * Fügt einen Kleidungstyp zum Style hinzu.
   * Fügt auch diesem Kleidungstyp den Style hinzu, wenn er noch nicht enthalten ist.
   *
   * @param {KleidungstypBO} aKleidungstyp - Der hinzuzufügende Kleidungstyp
   */
  addFeature(aKleidungstyp) {
    if (aKleidungstyp instanceof KleidungstypBO) {
      this.features.push(aKleidungstyp);
      // Auch dem Kleidungstyp den Style hinzufügen, wenn er nicht schon im Array ist
      if (!aKleidungstyp.getVerwendungen().some(verwendung => verwendung.getId() === this.getId())) {
        aKleidungstyp.addVerwendung(this);
      }
    }
  }

  /**
   * Entfernt einen Kleidungstyp aus dem Style.
   * Entfernt auch den Style aus diesem Kleidungstyp.
   *
   * @param {KleidungstypBO} aKleidungstyp - Der zu entfernende Kleidungstyp
   */
  removeFeature(aKleidungstyp) {
    const index = this.features.findIndex(f => f.getId() === aKleidungstyp.getId());
    if (index > -1) {
      this.features.splice(index, 1);
      // Auch aus der anderen Richtung löschen
      if (aKleidungstyp.getVerwendungen().some(verwendung => verwendung.getId() === this.getId())) {
        aKleidungstyp.deleteVerwendung(this);
      }
    }
  }

  /**
   * Gibt alle Kleidungstypen des Styles zurück.
   */
  getFeatures() {
    return this.features;
  }

  /**
   * Fügt einen Constraint zum Style hinzu.
   *
   * @param {ConstraintBO} aConstraint - Der hinzuzufügende Constraint
   */
  addConstraint(aConstraint) {
    if (aConstraint instanceof ConstraintBO) {
      this.constraints.push(aConstraint);
    }
  }

  /**
   * Entfernt einen Constraint aus dem Style.
   *
   * @param {ConstraintBO} aConstraint - Der zu entfernende Constraint
   */
  removeConstraint(aConstraint) {
    const index = this.constraints.findIndex(c => c.getId() === aConstraint.getId());
    if (index > -1) {
      this.features.splice(index, 1);
    }
  }

  /**
   * Gibt alle Constraints des Styles zurück.
   */
  getConstraints() {
    return this.constraints;
  }

  /**
   * Konvertiert eine JSON-Antwort in ein StyleBO Objekt bzw. Array von StyleBO Objekten.
   *
   * @param {*} styles - JSON-Daten aus dem Backend
   */
  static fromJSON(styles) {
    let result = [];

    if (Array.isArray(styles)) {
      styles.forEach((s) => {
        let style = new StyleBO();
        style.setId(s.id);
        style.setName(s.name);

        // Features (Kleidungstypen) konvertieren wenn vorhanden
        if (s.features && Array.isArray(s.features)) {
          s.features.forEach(feature => {
            const kleidungstyp = KleidungstypBO.fromJSON([feature])[0];
            style.addFeature(kleidungstyp);
          });
        }

        // Constraints konvertieren wenn vorhanden
        if (s.constraints && Array.isArray(s.constraints)) {
          s.constraints.forEach(constraint => {
            let constraintBO = ConstraintBO.fromJSON([constraint])[0];
            if (constraintBO) {
              style.addConstraint(constraintBO);
            }
          });
        }

        result.push(style);
      });
    } else if (styles) {
      let style = new StyleBO();
      style.setId(styles.id);
      style.setName(styles.name);

      if (styles.features && Array.isArray(styles.features)) {
        styles.features.forEach(feature => {
          const kleidungstyp = KleidungstypBO.fromJSON([feature])[0];
          style.addFeature(kleidungstyp);
        });
      }

      if (styles.constraints && Array.isArray(styles.constraints)) {
        styles.constraints.forEach(constraint => {
          let constraintBO = ConstraintBO.fromJSON([constraint])[0];
          if (constraintBO) {
            style.addConstraint(constraintBO);
          }
        });
      }

      result.push(style);
    }

    return result;
  }
}