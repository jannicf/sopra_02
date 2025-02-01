import BusinessObject from './BusinessObject.js';
import KleidungstypBO from "./KleidungstypBO.js";

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
   * @param {ConstraintBO} constraint - Der hinzuzufügende Constraint
   */
  addConstraint(constraint) {
    if (Array.isArray(this._constraints)) {
        this._constraints.push(constraint);
    } else {
        this._constraints = [constraint];
    }
  }

  /**
   * Entfernt einen Constraint aus dem Style.
   *
   * @param {ConstraintBO} constraint - Der zu entfernende Constraint
   */
  removeConstraint(constraint) {
    if (Array.isArray(this._constraints)) {
        const index = this._constraints.findIndex(c =>
            c.getID() === constraint.getID());
        if (index > -1) {
            this._constraints.splice(index, 1);
        }
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
   * @param {any[]} styles - JSON-Daten aus dem Backend.
   * @returns {any[]} Ein Array von StyleBO-Objekten.
   */
  static fromJSON(styles) {
    let result = [];

    if (Array.isArray(styles)) {
        styles.forEach((s) => {
            let style = new StyleBO();

            // ID und Name setzen
            style.setID(s.id || null); // Verwendet Standardwerte, falls `id` fehlt
            style.setName(s.name || "Unnamed Style");
            style.setKleiderschrankId(s.kleiderschrank_id || null);

            // Features verarbeiten
            if (Array.isArray(s.features)) {
                s.features.forEach((f) => {
                    const feature = KleidungstypBO.fromJSON([f])[0]; // Konvertiert Feature-Objekt
                    style.addFeature(feature); // Fügt Feature hinzu
                });
            }

            // Constraints verarbeiten
            if (s.constraints) {
                // Kardinalitäten
                if (Array.isArray(s.constraints.kardinalitaeten)) {
                    style._constraints.kardinalitaeten = s.constraints.kardinalitaeten.map((k) => ({
                        minAnzahl: k.minAnzahl,
                        maxAnzahl: k.maxAnzahl,
                        bezugsobjekt: { id: k.bezugsobjekt_id },
                    }));
                }

                // Mutexe
                if (Array.isArray(s.constraints.mutexe)) {
                    style._constraints.mutexe = s.constraints.mutexe.map((m) => ({
                        bezugsobjekt1: { id: m.bezugsobjekt1_id },
                        bezugsobjekt2: { id: m.bezugsobjekt2_id },
                    }));
                }

                // Implikationen
                if (Array.isArray(s.constraints.implikationen)) {
                    style._constraints.implikationen = s.constraints.implikationen.map((i) => ({
                        bezugsobjekt1: { id: i.bezugsobjekt1_id },
                        bezugsobjekt2: { id: i.bezugsobjekt2_id },
                    }));
                }
            }
            result.push(style);
        });
    }
    return result;
    }
}
