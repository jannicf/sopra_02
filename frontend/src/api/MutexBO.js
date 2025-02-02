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
   * Konvertiert eine JSON-Antwort in ein MutexBO Objekt bzw. Array von MutexBO Objekten.
   *
   * @param {*} mutexconstraints - JSON-Daten aus dem Backend
   */
  static fromJSON(mutexconstraints) {
    let result = [];

    if (Array.isArray(mutexconstraints)) {
        mutexconstraints.forEach((m) => {
            let mutex = new MutexBO();
            mutex.setID(m.id);
            if (m.style && m.style.id) {
                let style = StyleBO.fromJSON([m.style])[0];
                mutex.setStyle(style);
            }
            if (m.bezugsobjekt1 && m.bezugsobjekt1.id) {
                let bezugsobjekt1 = KleidungstypBO.fromJSON([m.bezugsobjekt1])[0];
                mutex.setBezugsobjekt1(bezugsobjekt1);
            }
            if (m.bezugsobjekt2 && m.bezugsobjekt2.id) {
                let bezugsobjekt2 = KleidungstypBO.fromJSON([m.bezugsobjekt2])[0];
                mutex.setBezugsobjekt2(bezugsobjekt2);
            }
            result.push(mutex);
        });
    } else if (mutexconstraints) {
        let m = mutexconstraints;
        let mutex = new MutexBO();
        mutex.setID(m.id);
        if (m.style && m.style.id) {
            let style = StyleBO.fromJSON([m.style])[0];
            mutex.setStyle(style);
        }
        if (m.bezugsobjekt1 && m.bezugsobjekt1.id) {
            let bezugsobjekt1 = KleidungstypBO.fromJSON([m.bezugsobjekt1])[0];
            mutex.setBezugsobjekt1(bezugsobjekt1);
        }
        if (m.bezugsobjekt2 && m.bezugsobjekt2.id) {
            let bezugsobjekt2 = KleidungstypBO.fromJSON([m.bezugsobjekt2])[0];
            mutex.setBezugsobjekt2(bezugsobjekt2);
        }
        result.push(mutex);
    }
    return result;
}
}