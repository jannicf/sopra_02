from flask import Flask
from flask_restx import Api, fields, Resource
from flask_cors import CORS

from src.server.KleiderschrankAdministration import KleiderschrankAdministration
from src.server.bo.BinaryConstraint import BinaryConstraint
from src.server.bo.Constraint import Constraint
from src.server.bo.Implikation import Implikation
from src.server.bo.Kardinalitaet import Kardinalitaet
from src.server.bo.Kleiderschrank import Kleiderschrank
from src.server.bo.Kleidungsstueck import Kleidungsstueck
from src.server.bo.Kleidungstyp import Kleidungstyp
from src.server.bo.Mutex import Mutex
from src.server.bo.Outfit import Outfit
from src.server.bo.Person import Person
from src.server.bo.Style import Style
from src.server.bo.UnaryConstraint import UnaryConstraint

app = Flask(__name__)
CORS(app, resources=r'/wardrobe/*')  # Erlaubt CORS für alle Wardrobe-Endpoints

api = Api(app, version='1.0', title='Digitaler Kleiderschrank API',
          description='Eine API zur Verwaltung digitaler Kleiderschränke')

# Namespace für alle Kleiderschrank-bezogenen Operationen
wardrobe = api.namespace('wardrobe', description='Funktionen des digitalen Kleiderschranks')

# Basismodell BusinessObject
bo = api.model('BusinessObject', {
    'id': fields.Integer(attribute='_id', description='Der Unique Identifier eines Business Object'),
})

# Vererbungshierarchie für die Kleiderschrank-Modelle
person = api.inherit('Person', bo, {
    'vorname': fields.String(attribute='_vorname', description='Vorname der Person'),
    'nachname': fields.String(attribute='_nachname', description='Nachname der Person'),
    'nickname': fields.String(attribute='_nickname', description='Nickname der Person'),
    'google_id': fields.String(attribute='_google_id', description='Google ID der Person')
})

kleiderschrank = api.inherit('Kleiderschrank', bo, {
    'name': fields.String(attribute='_name', description='Name des Kleiderschranks'),
    'eigentuemer': fields.Nested(person, description='Eigentümer des Kleiderschranks')
})

kleidungstyp = api.inherit('Kleidungstyp', bo, {
    'bezeichnung': fields.String(attribute='_bezeichnung', description='Bezeichnung des Kleidungstyps')
})

kleidungsstueck = api.inherit('Kleidungsstueck', bo, {
    'name': fields.String(attribute='_name', description='Name des Kleidungsstücks'),
    'typ': fields.Nested(kleidungstyp, description='Typ des Kleidungsstücks'),
    'kleiderschrank_id': fields.Integer(attribute='_kleiderschrank_id', description='ID des zugehörigen Kleiderschranks')
})

style = api.inherit('Style', bo, {
    'name': fields.String(attribute='_name', description='Name des Styles')
})

outfit = api.inherit('Outfit', bo, {
    'style': fields.Nested(style, description='Style des Outfits'),
    'bausteine': fields.List(fields.Nested(kleidungsstueck), description='Kleidungsstücke im Outfit')
})

constraint = api.inherit('Constraint', bo, {
    'style': fields.String(attribute='_style', description='Style des Constraints')
})

unary_constraint = api.inherit('UnaryConstraint', constraint, {
    'bezugsobjekt': fields.Integer(attribute='_bezugsobjekt', description='Das Bezugsobjekt für den Unary Constraint')
})

binary_constraint = api.inherit('BinaryConstraint', constraint, {
    'bezugsobjekt1': fields.Integer(attribute='bezugsobjekt1', description='Das erste Bezugsobjekt'),
    'bezugsobjekt2': fields.Integer(attribute='bezugsobjekt2', description='Das zweite Bezugsobjekt')
})

mutex = api.inherit('MutexConstraint', binary_constraint, {})

implikation = api.inherit('ImplicationConstraint', binary_constraint, {})

kardinalitaet = api.inherit('CardinalityConstraint', unary_constraint, {
    'min_anzahl': fields.Integer(attribute='min_anzahl', description='Minimaler Wert der Kardinalität'),
    'max_anzahl': fields.Integer(attribute='max_anzahl', description='Maximaler Wert der Kardinalität')
})


@wardrobe.route('/person')
@wardrobe.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class PersonListOperations(Resource):
    @wardrobe.marshal_list_with(person)
    # @secured
    def get(self):
        """Auslesen aller Customer-Objekte.

        Sollten keine Customer-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = KleiderschrankAdministration()
        personen = adm.get_all_personen()
        return personen

@wardrobe.marshal_with(person, code=200)
@wardrobe.expect(person)
# @secured
def post(self):
    """Anlegen eines neuen Personen-Objekts."""


    adm = KleiderschrankAdministration()

    proposal = Person.from_dict(api.payload)

    if proposal is not None:
        """ Wir verwenden Vor- und Nachnamen des Proposals für die Erzeugung
        eines Personen-Objekts. Das serverseitig erzeugte Objekt ist das maßgebliche und 
        wird auch dem Client zurückgegeben. 
        """
        p = adm.create_person(
            proposal.get_first_name(),
            proposal.get_last_name(),
            proposal.get_nickname(),
            proposal.get_google_id(),
        )
        return p, 200
    else:
        # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
        return '', 500


@wardrobe.route('/persons/<int:id>')
@wardrobe.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@wardrobe.param('id', 'Die ID des Personen-Objekts')
class PersonOperations(Resource):
    @wardrobe.marshal_with(person)
    # @secured
    def get(self, id):
        """Auslesen eines bestimmten Personen-Objekts.

        Das auszulesende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = KleiderschrankAdministration()
        pers = adm.get_person_by_id(id)
        return pers

    # @secured
    def delete(self, id):
        """Löschen eines bestimmten Personen-Objekts.

        Das zu löschende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = KleiderschrankAdministration()
        pers = adm.get_person_by_id(id)
        adm.delete_person(pers)
        return '', 200

    @wardrobe.marshal_with(person)
    @wardrobe.expect(person, validate=True)
    # @secured
    def put(self, id):
        """Update eines bestimmten Personen-Objekts.

        **ACHTUNG:** Relevante id ist die id, die mittels URI bereitgestellt und somit als Methodenparameter
        verwendet wird. Dieser Parameter überschreibt das ID-Attribut des im Payload der Anfrage übermittelten
        Personen-Objekts.
        """
        adm = KleiderschrankAdministration()
        p = Person.from_dict(api.payload)

        if p is not None:
            """Hierdurch wird die id des zu überschreibenden Personen-Objekts gesetzt.
            """
            p.set_id(id)
            adm.save_person(p)
            return '', 200
        else:
            return '', 500

@wardrobe.route('/persons-by-nachname/<string:nachname>')
@wardrobe.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@wardrobe.param('nachname', 'Der Nachname der Person')
class PersonsByNameOperations(Resource):
    @wardrobe.marshal_with(person)
    # @secured
    def get(self, nachname):
        """ Auslesen von Personen-Objekten, die durch den Nachnamen bestimmt werden.

        Die auszulesenden Objekte werden durch ```lastname``` in dem URI bestimmt.
        """
        adm = KleiderschrankAdministration()
        persons = adm.get_person_by_nachname(nachname)
        return persons

@wardrobe.route('/wardrobes')
@wardrobe.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class WardrobeListOperations(Resource):
    @wardrobe.marshal_list_with(wardrobe)
    # @secured
    def get(self):
        """Auslesen aller Kleiderschrank-Objekte.

        Sollten keine Kleiderschrank-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = KleiderschrankAdministration()
        wardrobe_list = adm.get_all_kleiderschraenke()
        return wardrobe_list


@wardrobe.route('/wardrobes/<int:id>')
@wardrobe.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@wardrobe.param('id', 'Die ID des Kleiderschrank-Objekts')
class WardrobeOperations(Resource):
    @wardrobe.marshal_with(wardrobe)
    # @secured
    def get(self, id):
        """Auslesen eines bestimmten Kleiderschrank-Objekts.

        Das auszulesende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = KleiderschrankAdministration()
        wardrobe_obj = adm.get_kleiderschrank_by_id(id)
        return wardrobe_obj

    # @secured
    def delete(self, id):
        """Löschen eines bestimmten Kleiderschrank-Objekts.

        Das zu löschende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = KleiderschrankAdministration()
        wardrobe_obj = adm.get_kleiderschrank_by_id(id)
        adm.delete_kleiderschrank(wardrobe_obj)
        return '', 200

    @wardrobe.marshal_with(wardrobe)
    # @secured
    def put(self, id):
        """Update eines bestimmten Kleiderschrank-Objekts.

        **ACHTUNG:** Relevante id ist die id, die mittels URI bereitgestellt und somit als Methodenparameter
        verwendet wird. Dieser Parameter überschreibt das ID-Attribut des im Payload der Anfrage übermittelten
        Kleiderschrank-Objekts.
        """
        adm = KleiderschrankAdministration()
        w = Kleiderschrank.from_dict(api.payload)

        if w is not None:
            """Hierdurch wird die id des zu überschreibenden Kleiderschrank-Objekts gesetzt."""
            w.set_id(id)
            adm.save_kleiderschrank(w)
            return '', 200
        else:
            return '', 500

@wardrobe.route('/clothes')
@wardrobe.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class ClothesListOperations(Resource):
    @wardrobe.marshal_list_with(kleidungsstueck)
    # @secured
    def get(self):
        """Auslesen aller Kleidungsstück-Objekte.

        Sollten keine Kleidungsstücke verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = KleiderschrankAdministration()
        clothes_list = adm.get_all_kleidungsstuecke()
        return clothes_list

    @wardrobe.marshal_with(kleidungsstueck, code=201)
    @wardrobe.expect(kleidungsstueck)
    # @secured
    def post(self):
        """Anlegen eines neuen Kleidungsstück-Objekts.

        **ACHTUNG:** Wir fassen die vom Client gesendeten Daten als Vorschlag auf.
        Die Vergabe der ID erfolgt serverseitig.
        *Das korrigierte Objekt wird zurückgegeben.*
        """
        adm = KleiderschrankAdministration()

        # Erstelle Kleidungsstück-Objekt aus den übertragenen Daten
        proposal = Kleidungsstueck.from_dict(api.payload)

        if proposal is not None:
            """ Wir erstellen ein Kleidungsstück-Objekt basierend auf den Vorschlagsdaten.
            Das serverseitig erzeugte Objekt ist das maßgebliche und 
            wird dem Client zurückgegeben. 
            """
            clothing = adm.create_kleidungsstueck(
                proposal.get_name(),
                proposal.get_typ(),
                proposal.get_kleiderschrank_id()
                )
            return clothing, 201
        else:
            # Wenn etwas schiefgeht, werfen wir einen Server-Fehler.
            return '', 500


@wardrobe.route('/clothes/<int:id>')
@wardrobe.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@wardrobe.param('id', 'Die ID des Kleidungsstück-Objekts')
class ClothingItemOperations(Resource):
    @wardrobe.marshal_with(kleidungsstueck)
    # @secured
    def get(self, id):
        """Auslesen eines bestimmten Kleidungsstück-Objekts.

        Das auszulesende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = KleiderschrankAdministration()
        clothing_item = adm.get_kleidungsstueck_by_id(id)
        return clothing_item

    # @secured
    def delete(self, id):
        """Löschen eines bestimmten Kleidungsstück-Objekts.

        Das zu löschende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = KleiderschrankAdministration()
        clothing_item = adm.get_kleidungsstueck_by_id(id)
        adm.delete_kleidungsstueck(clothing_item)
        return '', 200

    @wardrobe.marshal_with(kleidungsstueck)
    @wardrobe.expect(kleidungsstueck, validate=True)
    # @secured
    def put(self, id):
        """Update eines bestimmten Kleidungsstück-Objekts.

        Die Objekt-ID wird durch den URI-Parameter überschrieben.
        """
        adm = KleiderschrankAdministration()
        c = Kleidungsstueck.from_dict(api.payload)

        if c is not None:
            """Setze die ID des zu überschreibenden Kleidungsstück-Objekts."""
            c.set_id(id)
            adm.save_kleidungsstueck(c)
            return '', 200
        else:
            return '', 500


@wardrobe.route('/styles')
@wardrobe.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class StyleListOperations(Resource):
    @wardrobe.marshal_list_with(style)
    # @secured
    def get(self):
        """Auslesen aller Style-Objekte.

        Sollten keine Styles verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = KleiderschrankAdministration()
        styles_list = adm.get_all_styles()
        return styles_list

    @wardrobe.marshal_with(style, code=201)
    @wardrobe.expect(style)
    # @secured
    def post(self):
        """Anlegen eines neuen Style-Objekts.

        **ACHTUNG:** Wir fassen die vom Client gesendeten Daten als Vorschlag auf.
        Die Vergabe der ID erfolgt serverseitig.
        *Das korrigierte Objekt wird zurückgegeben.*
        """
        adm = KleiderschrankAdministration()

        # Erstelle Style-Objekt aus den übertragenen Daten
        proposal = Style.from_dict(api.payload)

        if proposal is not None:
            """ Wir erstellen ein Style-Objekt basierend auf den Vorschlagsdaten.
            Das serverseitig erzeugte Objekt ist das maßgebliche und 
            wird dem Client zurückgegeben. 
            """
            sty = adm.create_style(
                proposal.get_name()
            )
            return sty, 201
        else:
            # Wenn etwas schiefgeht, werfen wir einen Server-Fehler.
            return '', 500


@wardrobe.route('/styles/<int:id>')
@wardrobe.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@wardrobe.param('id', 'Die ID des Style-Objekts')
class StyleOperations(Resource):
    @wardrobe.marshal_with(style)
    # @secured
    def get(self, id):
        """Auslesen eines bestimmten Style-Objekts.

        Das auszulesende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = KleiderschrankAdministration()
        sty = adm.get_style_by_id(id)
        return sty

    # @secured
    def delete(self, id):
        """Löschen eines bestimmten Style-Objekts.

        Das zu löschende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = KleiderschrankAdministration()
        sty = adm.get_style_by_id(id)
        adm.delete_style(sty)
        return '', 200

    @wardrobe.marshal_with(style)
    @wardrobe.expect(style, validate=True)
    # @secured
    def put(self, id):
        """Update eines bestimmten Style-Objekts.

        Die Objekt-ID wird durch den URI-Parameter überschrieben.
        """
        adm = KleiderschrankAdministration()
        s = Style.from_dict(api.payload)

        if s is not None:
            """Setze die ID des zu überschreibenden Style-Objekts."""
            s.set_id(id)
            adm.save_style(s)
            return '', 200
        else:
            return '', 500


@wardrobe.route('/clothing-types')
@wardrobe.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class ClothingTypeListOperations(Resource):
    @wardrobe.marshal_list_with(kleidungstyp)
    # @secured
    def get(self):
        """Auslesen aller Kleidungstyp-Objekte.

        Sollten keine Kleidungstypen verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = KleiderschrankAdministration()
        clothing_types_list = adm.get_all_kleidungstypen()
        return clothing_types_list

    @wardrobe.marshal_with(kleidungstyp, code=201)
    @wardrobe.expect(kleidungstyp)
    # @secured
    def post(self):
        """Anlegen eines neuen Kleidungstyp-Objekts.

        **ACHTUNG:** Wir fassen die vom Client gesendeten Daten als Vorschlag auf.
        Die Vergabe der ID erfolgt serverseitig.
        *Das korrigierte Objekt wird zurückgegeben.*
        """
        adm = KleiderschrankAdministration()

        # Erstelle Kleidungstyp-Objekt aus den übertragenen Daten
        proposal = Kleidungstyp.from_dict(api.payload)

        if proposal is not None:
            """ Wir erstellen ein Kleidungstyp-Objekt basierend auf den Vorschlagsdaten.
            Das serverseitig erzeugte Objekt ist das maßgebliche und 
            wird dem Client zurückgegeben. 
            """
            clothing_type = adm.create_kleidungstyp(
                proposal.get_bezeichnung()
            )
            return clothing_type, 201
        else:
            # Wenn etwas schiefgeht, werfen wir einen Server-Fehler.
            return '', 500


@wardrobe.route('/clothing-types/<int:id>')
@wardrobe.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@wardrobe.param('id', 'Die ID des Kleidungstyp-Objekts')
class ClothingTypeOperations(Resource):
    @wardrobe.marshal_with(kleidungstyp)
    # @secured
    def get(self, id):
        """Auslesen eines bestimmten Kleidungstyp-Objekts.

        Das auszulesende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = KleiderschrankAdministration()
        clothing_type = adm.get_kleidungstyp_by_id(id)
        return clothing_type

    # @secured
    def delete(self, id):
        """Löschen eines bestimmten Kleidungstyp-Objekts.

        Das zu löschende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = KleiderschrankAdministration()
        clothing_type = adm.get_kleidungstyp_by_id(id)
        adm.delete_kleidungstyp(clothing_type)
        return '', 200

    @wardrobe.marshal_with(kleidungstyp)
    @wardrobe.expect(kleidungstyp, validate=True)
    # @secured
    def put(self, id):
        """Update eines bestimmten Kleidungstyp-Objekts.

        Die Objekt-ID wird durch den URI-Parameter überschrieben.
        """
        adm = KleiderschrankAdministration()
        ct = Kleidungstyp.from_dict(api.payload)

        if ct is not None:
            """Setze die ID des zu überschreibenden Kleidungstyp-Objekts."""
            ct.set_id(id)
            adm.save_kleidungstyp(ct)
            return '', 200
        else:
            return '', 500


@wardrobe.route('/outfits')
@wardrobe.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class OutfitListOperations(Resource):
    @wardrobe.marshal_list_with(outfit)
    def get(self):
        """Auslesen aller Outfit-Objekte.

        Sollten keine Outfits verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = KleiderschrankAdministration()
        outfits = adm.get_all_outfits()
        return outfits

    @wardrobe.marshal_with(outfit, code=201)
    @wardrobe.expect(outfit)
    def post(self):
        """Erstellt ein neues Outfit basierend auf ausgewählten Kleidungsstücken."""
        adm = KleiderschrankAdministration()
        data = api.payload

        # Kleidungsstücke laden
        kleidungsstuecke = [adm.get_kleidungsstueck_by_id(k_id)
                            for k_id in data['kleidungsstueck_ids']]

        # Outfit erstellen
        outfit = adm.create_outfit_from_selection(kleidungsstuecke, data['style_id'])

        if outfit:
            return outfit, 201
        return {'message': 'Outfit konnte nicht erstellt werden'}, 400


@wardrobe.route('/cardinalityconstraints')
@wardrobe.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class CardinalityConstraintListOperations(Resource):
    @wardrobe.marshal_list_with(kardinalitaet)
    # @secured
    def get(self):
        """Auslesen aller Kardinalitäts-Constraints"""
        adm = KleiderschrankAdministration()
        constraints_list = adm.get_all_kardinalitaeten()
        return constraints_list

    @wardrobe.marshal_with(kardinalitaet, code=201)
    @wardrobe.expect(kardinalitaet)
    # @secured
    def post(self):
        """Erstellen eines neuen Kardinalitäts-Constraints"""
        adm = KleiderschrankAdministration()
        proposal = Kardinalitaet.from_dict(api.payload)
        if proposal is not None:
            constraint = adm.create_kardinalitaet(
                proposal.get_min_anzahl(),
                proposal.get_max_anzahl(),
                proposal.get_bezugsobjekt(),
                proposal.get_style()
            )
            return constraint, 201
        else:
            return '', 500


@wardrobe.route('/cardinalityconstraints/<int:id>')
@wardrobe.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@wardrobe.param('id', 'Die ID des Kardinalitäts-Constraints')
class CardinalityConstraintOperations(Resource):
    @wardrobe.marshal_with(kardinalitaet)
    # @secured
    def get(self, id):
        """Auslesen eines spezifischen Kardinalitäts-Constraints"""
        adm = KleiderschrankAdministration()
        constraint = adm.get_kardinalitaet_by_id(id)
        return constraint

    # @secured
    def delete(self, id):
        """Löschen eines Kardinalitäts-Constraints"""
        adm = KleiderschrankAdministration()
        constraint = adm.get_kardinalitaet_by_id(id)
        adm.delete_kardinalitaet(constraint)
        return '', 200

    @wardrobe.marshal_with(kardinalitaet)
    @wardrobe.expect(kardinalitaet, validate=True)
    # @secured
    def put(self, id):
        """Updaten eines Kardinalitäts-Constraints"""
        adm = KleiderschrankAdministration()
        cc = Kardinalitaet.from_dict(api.payload)
        if cc is not None:
            cc.set_id(id)
            adm.save_kardinalitaet(cc)
            return '', 200
        else:
            return '', 500


@wardrobe.route('/implicationconstraints')
@wardrobe.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class ImplicationConstraintListOperations(Resource):
    @wardrobe.marshal_list_with(implikation)
    # @secured
    def get(self):
        """Auslesen aller Implikations-Constraints"""
        adm = KleiderschrankAdministration()
        constraints_list = adm.get_all_implikationen()
        return constraints_list

    @wardrobe.marshal_with(implikation, code=201)
    @wardrobe.expect(implikation)
    # @secured
    def post(self):
        """Erstellen eines neuen Implikations-Constraints"""
        adm = KleiderschrankAdministration()
        proposal = Implikation.from_dict(api.payload)
        if proposal is not None:
            constraint = adm.create_implikation(
                proposal.get_bezugsobjekt1(),
                proposal.get_bezugsobjekt2(),
                proposal.get_style()
            )
            return constraint, 201
        else:
            return '', 500


@wardrobe.route('/implicationconstraints/<int:id>')
@wardrobe.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@wardrobe.param('id', 'Die ID des Implikations-Constraints')
class ImplicationConstraintOperations(Resource):
    @wardrobe.marshal_with(implikation)
    # @secured
    def get(self, id):
        """Auslesen eines spezifischen Implikations-Constraints"""
        adm = KleiderschrankAdministration()
        constraint = adm.get_implikation_by_id(id)
        return constraint

    # @secured
    def delete(self, id):
        """Löschen eines Implikations-Constraints"""
        adm = KleiderschrankAdministration()
        constraint = adm.get_implikation_by_id(id)
        adm.delete_implikation(constraint)
        return '', 200

    @wardrobe.marshal_with(implikation)
    @wardrobe.expect(implikation, validate=True)
    # @secured
    def put(self, id):
        """Updaten eines Implikations-Constraints"""
        adm = KleiderschrankAdministration()
        ic = Implikation.from_dict(api.payload)
        if ic is not None:
            ic.set_id(id)
            adm.save_implikation(ic)
            return '', 200
        else:
            return '', 500


@wardrobe.route('/mutexconstraints')
@wardrobe.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class MutexConstraintListOperations(Resource):
    @wardrobe.marshal_list_with(mutex)
    # @secured
    def get(self):
        """Auslesen aller Mutex-Constraints"""
        adm = KleiderschrankAdministration()
        constraints_list = adm.get_all_mutex()
        return constraints_list

    @wardrobe.marshal_with(mutex, code=201)
    @wardrobe.expect(mutex)
    # @secured
    def post(self):
        """Erstellen eines neuen Mutex-Constraints"""
        adm = KleiderschrankAdministration()
        proposal = Mutex.from_dict(api.payload)
        if proposal is not None:
            constraint = adm.create_mutex(
                proposal.get_bezugsobjekt1(),
                proposal.get_bezugsobjekt2(),
                proposal.get_style()
            )
            return constraint, 201
        else:
            return '', 500

@wardrobe.route('/mutexconstraints/<int:id>')
@wardrobe.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@wardrobe.param('id', 'Die ID des Mutex-Constraints')
class MutexConstraintOperations(Resource):
    @wardrobe.marshal_with(mutex)
    # @secured
    def get(self, id):
        """Auslesen eines spezifischen Mutex-Constraints"""
        adm = KleiderschrankAdministration()
        constraint = adm.get_mutex_by_id(id)
        return constraint

    # @secured
    def delete(self, id):
        """Löschen eines Mutex-Constraints"""
        adm = KleiderschrankAdministration()
        constraint = adm.get_mutex_by_id(id)
        adm.delete_mutex(constraint)
        return '', 200

    @wardrobe.marshal_with(mutex)
    @wardrobe.expect(mutex, validate=True)
    # @secured
    def put(self, id):
        """Updaten eines Mutex-Constraints"""
        adm = KleiderschrankAdministration()
        mc = Mutex.from_dict(api.payload)
        if mc is not None:
            mc.set_id(id)
            adm.save_mutex(mc)
            return '', 200
        else:
            return '', 500


if __name__ == '__main__':
    app.run(debug=True)
