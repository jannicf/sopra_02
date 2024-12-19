import UnaryConstraintBO from './UnaryConstraintBO.js';

/**
 * Repräsentiert eine Kardinalität im digitalen Kleiderschranksystem.
 * Eine Kardinalität ist ein unäres Constraint, das die minimale und maximale Anzahl
 * von Kleidungsstücken eines bestimmten Typs festlegt.
 */
export default class KardinalitaetBO extends UnaryConstraintBO {
  /**
   * Erstellt ein KardinalitaetBO Objekt.
   */
  constructor() {
    super();
    this.minAnzahl = 0;
    this.maxAnzahl = 0;
  }

  /**
   * Setzt die minimale Anzahl der Kardinalität.
   *
   * @param {Number} aMinAnzahl - Die neue minimale Anzahl
   */
  setMinAnzahl(aMinAnzahl) {
    this.minAnzahl = aMinAnzahl;
  }

  /**
   * Gibt die minimale Anzahl der Kardinalität zurück.
   */
  getMinAnzahl() {
    return this.minAnzahl;
  }

  /**
   * Setzt die maximale Anzahl der Kardinalität.
   *
   * @param {Number} aMaxAnzahl - Die neue maximale Anzahl
   */
  setMaxAnzahl(aMaxAnzahl) {
    this.maxAnzahl = aMaxAnzahl;
  }

  /**
   * Gibt die maximale Anzahl der Kardinalität zurück.
   */
  getMaxAnzahl() {
    return this.maxAnzahl;
  }

  /**
   * Überprüft, ob das Kardinalitäts-Constraint erfüllt ist.
   *
   * @param {Array} kleidungsstuecke - Array von KleidungsstueckBO Objekten
   * @returns {boolean} - True wenn das Constraint erfüllt ist, sonst False
   */
  checkConstraint(kleidungsstuecke) {
    // Wenn kein Bezugsobjekt gesetzt ist, können wir nicht prüfen
    if (!this.getBezugsobjekt()) {
      return true;
    }

    // Zähle die Kleidungsstücke vom Typ des Bezugsobjekts
    let anzahl = kleidungsstuecke.filter(kleidungsstueck =>
      kleidungsstueck.getTyp().getID() === this.getBezugsobjekt().getID()
    ).length;

    // Prüfe ob die Anzahl zwischen Minimum und Maximum liegt
    return this.getMinAnzahl() <= anzahl && anzahl <= this.getMaxAnzahl();
  }

  /**
   * Konvertiert eine JSON-Antwort in ein KardinalitaetBO Objekt bzw. Array von KardinalitaetBO Objekten.
   *
   * @param {*} cardinalityconstraints - JSON-Daten aus dem Backend
   */
  static fromJSON(cardinalityconstraints) {
    let result = [];

    if (Array.isArray(cardinalityconstraints)) {
      cardinalityconstraints.forEach((k) => {
        let kardinalitaet = new KardinalitaetBO();
        kardinalitaet.setID(k.id);
        kardinalitaet.setMinAnzahl(k.min_anzahl);
        kardinalitaet.setMaxAnzahl(k.max_anzahl);

        if (k.bezugsobjekt) {
          kardinalitaet.setBezugsobjekt(k.bezugsobjekt);
        }

        if (k.style) {
          kardinalitaet.setStyle(k.style);
        }

        result.push(kardinalitaet);
      });
    } else if (cardinalityconstraints) {
      let kardinalitaet = new KardinalitaetBO();
      kardinalitaet.setID(cardinalityconstraints.id);
      kardinalitaet.setMinAnzahl(cardinalityconstraints.minAnzahl);
      kardinalitaet.setMaxAnzahl(cardinalityconstraints.maxAnzahl);

      if (cardinalityconstraints.bezugsobjekt) {
        kardinalitaet.setBezugsobjekt(cardinalityconstraints.bezugsobjekt);
      }

      if (cardinalityconstraints.style) {
        kardinalitaet.setStyle(cardinalityconstraints.style);
      }

      result.push(kardinalitaet);
    }

    return result;
  }
}