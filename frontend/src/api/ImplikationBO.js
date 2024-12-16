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
   * Überprüft, ob das Implikations-Constraint erfüllt ist.
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

    // Wenn Typ1 vorhanden ist, muss auch Typ2 vorhanden sein
    // Wenn Typ1 nicht vorhanden ist, ist die Bedingung immer erfüllt
    return !typ1Vorhanden || typ2Vorhanden;
  }

  /**
   * Konvertiert eine JSON-Antwort in ein ImplikationBO Objekt bzw. Array von ImplikationBO Objekten.
   *
   * @param {*} json - JSON-Daten aus dem Backend
   */
  static fromJSON(json) {
    let result = [];
    if (Array.isArray(json)) {
      json.forEach((i) => {
        let implikation = new ImplikationBO();
        implikation.setID(i.id);

        // Bezugsobjekte setzen wenn vorhanden
        if (i.bezugsobjekt1) {
          implikation.setBezugsobjekt1(KleidungstypBO.fromJSON([i.bezugsobjekt1])[0]);
        }
        if (i.bezugsobjekt2) {
          implikation.setBezugsobjekt2(KleidungstypBO.fromJSON([i.bezugsobjekt2])[0]);
        }

        // Style setzen wenn vorhanden
        if (i.style) {
          implikation.setStyle(StyleBO.fromJSON([i.style])[0]);
        }
        result.push(implikation);
      });
    } else if (json) {
      let implikation = new ImplikationBO();
      implikation.setID(json.id);

      if (json.bezugsobjekt1) {
        implikation.setBezugsobjekt1(KleidungstypBO.fromJSON([json.bezugsobjekt1])[0]);
      }
      if (json.bezugsobjekt2) {
        implikation.setBezugsobjekt2(KleidungstypBO.fromJSON([json.bezugsobjekt2])[0]);
      }

      if (json.style) {
        implikation.setStyle(StyleBO.fromJSON([json.style])[0]);
      }
      result.push(implikation);
    }
    return result;
  }
}