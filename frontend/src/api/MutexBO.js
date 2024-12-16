import BinaryConstraintBO from './BinaryConstraintBO.js';
import KleidungstypBO from './KleidungstypBO.js';
import StyleBO from './StyleBO.js';

/**
 * Repräsentiert eine Mutex im digitalen Kleiderschranksystem.
 * Eine Mutex ist ein binäres Constraint, das aussagt:
 * Bezugsobjekt1 und Bezugsobjekt2 dürfen nicht gleichzeitig vorhanden sein.
 */
export default class MutexBO extends BinaryConstraintBO {
  /**
   * Erstellt ein MutexBO Objekt.
   */
  constructor() {
    super();
  }

  /**
   * Überprüft, ob das Mutex-Constraint erfüllt ist.
   *
   * @param {Array} kleidungsstuecke - Array von KleidungsstueckBO Objekten
   * @returns {boolean} - True wenn das Constraint erfüllt ist, sonst False
   */
  checkConstraint(kleidungsstuecke) {
    // Wenn keine Bezugsobjekte gesetzt sind, können wir nicht prüfen
    if (!this.getBezugsobjekt1() || !this.getBezugsobjekt2()) {
      return true;
    }

    let typ1Vorhanden = false;
    let typ2Vorhanden = false;

    // Prüfe für jedes Kleidungsstück, ob es von einem der relevanten Typen ist
    kleidungsstuecke.forEach(kleidungsstueck => {
      if (kleidungsstueck.getTyp().getID() === this.getBezugsobjekt1().getID()) {
        typ1Vorhanden = true;
      }
      if (kleidungsstueck.getTyp().getID() === this.getBezugsobjekt2().getID()) {
        typ2Vorhanden = true;
      }
    });

    // Constraint ist verletzt, wenn BEIDE Typen vorkommen
    return !(typ1Vorhanden && typ2Vorhanden);
  }

  /**
   * Konvertiert eine JSON-Antwort in ein MutexBO Objekt bzw. Array von MutexBO Objekten.
   *
   * @param {*} json - JSON-Daten aus dem Backend
   */
  static fromJSON(json) {
    let result = [];

    if (Array.isArray(json)) {
      json.forEach((m) => {
        let mutex = new MutexBO();
        mutex.setID(m.id);

        // Bezugsobjekte setzen wenn vorhanden
        if (m.bezugsobjekt1) {
          mutex.setBezugsobjekt1(KleidungstypBO.fromJSON([m.bezugsobjekt1])[0]);
        }
        if (m.bezugsobjekt2) {
          mutex.setBezugsobjekt2(KleidungstypBO.fromJSON([m.bezugsobjekt2])[0]);
        }

        // Style setzen wenn vorhanden
        if (m.style) {
          mutex.setStyle(StyleBO.fromJSON([m.style])[0]);
        }
        result.push(mutex);
      });
    } else if (json) {
      let mutex = new MutexBO();
      mutex.setID(json.id);

      if (json.bezugsobjekt1) {
        mutex.setBezugsobjekt1(KleidungstypBO.fromJSON([json.bezugsobjekt1])[0]);
      }
      if (json.bezugsobjekt2) {
        mutex.setBezugsobjekt2(KleidungstypBO.fromJSON([json.bezugsobjekt2])[0]);
      }

      if (json.style) {
        mutex.setStyle(StyleBO.fromJSON([json.style])[0]);
      }
      result.push(mutex);
    }
    return result;
  }
}