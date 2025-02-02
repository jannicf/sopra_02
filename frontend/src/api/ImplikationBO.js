import BinaryConstraintBO from './BinaryConstraintBO.js';
import KleidungstypBO from './KleidungstypBO.js';
import StyleBO from './StyleBO.js';

/**
 * Repräsentiert eine Implikation im digitalen Kleiderschranksystem.
 * Eine Implikation ist ein binäres Constraint, das aussagt:
 * Wenn Bezugsobjekt1 vorhanden ist, muss auch Bezugsobjekt2 vorhanden sein.
 */
export default class ImplikationBO extends BinaryConstraintBO {
  /**
   * Erstellt ein ImplikationBO Objekt.
   */
  constructor() {
    super();
  }

  /**
   * Konvertiert eine JSON-Antwort in ein ImplikationBO Objekt bzw. Array von ImplikationBO Objekten.
   *
   * @param {*} implicationconstraints - JSON-Daten aus dem Backend
   */
  static fromJSON(implicationconstraints) {
    let result = [];

    if (Array.isArray(implicationconstraints)) {
        implicationconstraints.forEach((i) => {
            let implikation = new ImplikationBO();
            implikation.setID(i.id);
            if (i.style && i.style.id) {
                let style = StyleBO.fromJSON([i.style])[0];
                implikation.setStyle(style);
            }
            if (i.bezugsobjekt1 && i.bezugsobjekt1.id) {
                let bezugsobjekt1 = KleidungstypBO.fromJSON([i.bezugsobjekt1])[0];
                implikation.setBezugsobjekt1(bezugsobjekt1);
            }
            if (i.bezugsobjekt2 && i.bezugsobjekt2.id) {
                let bezugsobjekt2 = KleidungstypBO.fromJSON([i.bezugsobjekt2])[0];
                implikation.setBezugsobjekt2(bezugsobjekt2);
            }
            result.push(implikation);
        });
    } else if (implicationconstraints) {
        let i = implicationconstraints;
        let implikation = new ImplikationBO();
        implikation.setID(i.id);
        if (i.style && i.style.id) {
            let style = StyleBO.fromJSON([i.style])[0];
            implikation.setStyle(style);
        }
        if (i.bezugsobjekt1 && i.bezugsobjekt1.id) {
            let bezugsobjekt1 = KleidungstypBO.fromJSON([i.bezugsobjekt1])[0];
            implikation.setBezugsobjekt1(bezugsobjekt1);
        }
        if (i.bezugsobjekt2 && i.bezugsobjekt2.id) {
            let bezugsobjekt2 = KleidungstypBO.fromJSON([i.bezugsobjekt2])[0];
            implikation.setBezugsobjekt2(bezugsobjekt2);
        }
            result.push(implikation);
        }
        return result;
    }
}