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
   * @param {*} mutexe - JSON-Daten aus dem Backend
   */
  static fromJSON(mutexe) {
    let result = [];

    if (Array.isArray(mutexe)) {
      mutexe.forEach((m) => {
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
    } else if (mutexe) {
      let mutex = new MutexBO();
      mutex.setID(mutexe.id);

      if (mutexe.bezugsobjekt1) {
        mutex.setBezugsobjekt1(KleidungstypBO.fromJSON([mutexe.bezugsobjekt1])[0]);
      }
      if (mutexe.bezugsobjekt2) {
        mutex.setBezugsobjekt2(KleidungstypBO.fromJSON([mutexe.bezugsobjekt2])[0]);
      }

      if (mutexe.style) {
        mutex.setStyle(StyleBO.fromJSON([mutexe.style])[0]);
      }
      result.push(mutex);
    }
    return result;
  }
}