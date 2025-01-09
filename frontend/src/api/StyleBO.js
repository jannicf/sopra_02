// Alle benötigten Imports im Zusammenhang mit Style importieren
import BusinessObject from './BusinessObject.js';
import KleidungstypBO from "./KleidungstypBO.js";
import ConstraintBO from "./ConstraintBO.js";
import MutexBO from "./MutexBO.js";
import KardinalitaetBO from "./KardinalitaetBO.js";
import ImplikationBO from "./ImplikationBO.js";

/**
 * Repräsentiert einen Style im digitalen Kleiderschranksystem.
 */
export default class StyleBO extends BusinessObject {
  /**
   * Erstellt ein StyleBO Objekt.
   */
  constructor() {
    super();
    this._name = "";
    this._constraints = []; // Array der Constraints in diesem
    this._features = [];    // Array der Kleidungstypen
    this.kleiderschrankId = null;
  }

  /**
   * Setzt den Namen des Styles.
   *
   * @param {String} aName - Der neue Name des Styles
   */
  setName(aName) {
    this._name = aName;
  }

  /**
   * Gibt den Namen des Styles zurück.
   */
  getName() {
    return this._name;
  }
  /**
   * Fügt einen Kleidungstyp zum Style hinzu.
   * Fügt auch diesem Kleidungstyp den Style hinzu, wenn er noch nicht enthalten ist.
   *
   * @param {KleidungstypBO} aKleidungstyp - Der hinzuzufügende Kleidungstyp
   */
  addFeature(aKleidungstyp) {
    this._features.push(aKleidungstyp);
  }

  /**
   * Entfernt einen Kleidungstyp aus dem Style.
   * Entfernt auch den Style aus diesem Kleidungstyp.
   *
   * @param {KleidungstypBO} aKleidungstyp - Der zu entfernende Kleidungstyp
   */
  removeFeature(aKleidungstyp) {
    const index = this.features.findIndex(f => f.getID() === aKleidungstyp.getID());
    if (index > -1) {
      this.features.splice(index, 1);
      // Auch aus der anderen Richtung löschen
      if (aKleidungstyp.getVerwendungen().some(verwendung => verwendung.getId() === this.getID())) {
        aKleidungstyp.deleteVerwendung(this);
      }
    }
  }

  /**
   * Gibt alle Kleidungstypen des Styles zurück.
   */
  getFeatures() {
    return this._features;
  }
  /**
   * Fügt einen Constraint zum Style hinzu.
   *
   * @param {ConstraintBO} aConstraint - Der hinzuzufügende Constraint
   */
  addConstraint(aConstraint) {
    if (aConstraint instanceof ConstraintBO) {
      this._constraints.push(aConstraint);
    }
  }

  /**
   * Entfernt einen Constraint aus dem Style.
   *
   * @param {ConstraintBO} aConstraint - Der zu entfernende Constraint
   */
  removeConstraint(aConstraint) {
    const index = this._constraints.findIndex(c => c.getID() === aConstraint.getID());
    if (index > -1) {
      this._constraints.splice(index, 1);
    }
  }

  /**
   * Gibt alle Constraints des Styles zurück.
   */
  getConstraints() {
    return this._constraints;
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
   * Konvertiert eine JSON-Antwort in ein StyleBO Objekt bzw. Array von StyleBO Objekten.
   *
   * @param {*} styles - JSON-Daten aus dem Backend
   */
  static fromJSON(styles) {
  let result = [];

  // Falls styles bereits ein Array ist …
  if (Array.isArray(styles)) {
    styles.forEach(s => {
      let style = new StyleBO();
      style.setID(s.id);
      style.setName(s.name);
      style.setKleiderschrankId(s.kleiderschrank_id);

      // Features hinzufügen
      s.features?.forEach(f => {
        style.addFeature(KleidungstypBO.fromJSON([f])[0]);
      });

      // Constraints hinzufügen
      s.constraints?.forEach(c => {
        if (c.min_anzahl) {
          // Kardinalität
          style.addConstraint(KardinalitaetBO.fromJSON([c])[0]);
        } else if (c.bezugsobjekt1) {
          // => Mutex oder Implikation
          if (c.type === 'mutex') {
            style.addConstraint(MutexBO.fromJSON([c])[0]);
          } else {
            style.addConstraint(ImplikationBO.fromJSON([c])[0]);
          }
        }

      });

      result.push(style);
    });

  } else {
    // Falls styles nur ein einzelnes Objekt ist …
    let s = styles;
    let style = new StyleBO();
    style.setID(s.id);
    style.setName(s.name);
    style.setKleiderschrankId(styles.kleiderschrank_id);

    s.features?.forEach(f => {
      style.addFeature(KleidungstypBO.fromJSON([f])[0]);
    });

    s.constraints?.forEach(c => {
      if (c.min_anzahl) {
        style.addConstraint(KardinalitaetBO.fromJSON([c])[0]);
      } else if (c.bezugsobjekt1_id) {
        if (c.type === 'mutex') {
          style.addConstraint(MutexBO.fromJSON([c])[0]);
        } else {
          style.addConstraint(ImplikationBO.fromJSON([c])[0]);
        }
      }
    });

    result.push(style);
  }

  // Wir geben immer ein Array zurück
  return result;
}
}
