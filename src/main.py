from flask import Flask
from flask_restx import Api, fields, Resource
from flask_cors import CORS

from server.KleiderschrankAdministration import KleiderschrankAdministration
from server.bo.BinaryConstraint import BinaryConstraint
from server.bo.Constraint import Constraint
from server.bo.Implikation import Implikation
from server.bo.Kardinalitaet import Kardinalitaet
from server.bo.Kleiderschrank import Kleiderschrank
from server.bo.Kleidungsstueck import Kleidungsstueck
from server.bo.Kleidungstyp import Kleidungstyp
from server.bo.Mutex import Mutex
from server.bo.Outfit import Outfit
from server.bo.Person import Person
from server.bo.Style import Style
from server.bo.UnaryConstraint import UnaryConstraint

from SecurityDecorator import secured

app = Flask(__name__, static_folder='build', static_url_path='')

@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

CORS(app, resources=r'/wardrobe/*')  # Erlaubt CORS für alle Wardrobe-Endpoints

api = Api(app, version='1.0', title='Digitaler Kleiderschrank API',
          description='Eine API zur Verwaltung digitaler Kleiderschränke')


# Namespace für alle Kleiderschrank-bezogenen Operationen
wardrobe_ns = api.namespace('wardrobe', description='Funktionen des digitalen Kleiderschranks')

# Basismodell BusinessObject
bo = api.model('BusinessObject', {
    'id': fields.Integer(attribute='_id', description='Der Unique Identifier eines Business Object'),
})

# Vererbungshierarchie für die Kleiderschrank-Modelle
kleiderschrank_model = api.inherit('Kleiderschrank', bo, {
    'name': fields.String(attribute='_Kleiderschrank__name', description='Name des Kleiderschranks'),
    'eigentuemer_id': fields.Integer(description='ID des Eigentümers')
})

person = api.inherit('Person', bo, {
    'vorname': fields.String(attribute='_Person__vorname', description='Vorname der Person'),
    'nachname': fields.String(attribute='_Person__nachname', description='Nachname der Person'),
    'nickname': fields.String(attribute='_Person__nickname', description='Nickname der Person'),
    'google_id': fields.String(attribute='_Person__google_id', description='Google ID der Person'),
    'kleiderschrank': fields.Nested(kleiderschrank_model, attribute='_Person__kleiderschrank', description='Kleiderschrank der Person', allow_null=True)
})

style = api.inherit('Style', bo, {
    'name': fields.String(attribute='_Style__name', description='Name des Styles')
})

kleidungstyp = api.inherit('Kleidungstyp', bo, {
    'bezeichnung': fields.String(attribute='_Kleidungstyp__bezeichnung', description='Bezeichnung des Kleidungstyps'),
    'verwendungen': fields.List(fields.Nested(style), attribute='_Kleidungstyp__verwendungen', description='Styles des Kleidungstyps')
})

kleidungsstueck = api.inherit('Kleidungsstueck', bo, {
    'name': fields.String(attribute='_Kleidungsstueck__name', description='Name des Kleidungsstücks'),
    'typ': fields.Nested(kleidungstyp, attribute='_Kleidungsstueck__typ', description='Typ des Kleidungsstücks'),
    'kleiderschrank_id': fields.Integer(attribute='_Kleidungsstueck__kleiderschrank_id', description='ID des zugehörigen Kleiderschranks')
})

outfit = api.inherit('Outfit', bo, {
    'style': fields.Integer(attribute=lambda x: x.get_style().get_id() if x.get_style() else None),
    'bausteine': fields.List(fields.Integer, attribute=lambda x: x.get_baustein_ids())
})

constraint = api.inherit('Constraint', bo, {
    'style': fields.Integer(attribute=lambda x: x.get_style().get_id()),
})

unary_constraint = api.inherit('UnaryConstraint', constraint, {
    'bezugsobjekt': fields.Integer(attribute=lambda x: x.get_bezugsobjekt().get_id()),
})

binary_constraint = api.inherit('BinaryConstraint', constraint, {
    'bezugsobjekt1': fields.Integer(attribute=lambda x: x.get_bezugsobjekt1().get_id()),
    'bezugsobjekt2': fields.Integer(attribute=lambda x: x.get_bezugsobjekt2().get_id()),
})

mutex = api.inherit('MutexConstraint', binary_constraint, {
    'type': fields.String(default='mutex')
})

implikation = api.inherit('ImplicationConstraint', binary_constraint, {
    'type': fields.String(default='implikation')
})

kardinalitaet = api.inherit('CardinalityConstraint', unary_constraint, {
    'type': fields.String(default='kardinalitaet'),
    'min_anzahl': fields.Integer(attribute=lambda x: x.get_min_anzahl()),
    'max_anzahl': fields.Integer(attribute=lambda x: x.get_max_anzahl()),
})

style = api.inherit('Style', bo, {
    'name': fields.String(attribute='_Style__name', description='Name des Styles'),
    'features': fields.List(fields.Nested(kleidungstyp), attribute='_Style__features'),
    'constraints': fields.Raw(attribute=lambda x: x.get_constraints())
})


@wardrobe_ns.route('/persons')
@wardrobe_ns.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class PersonListOperations(Resource):
    @wardrobe_ns.marshal_list_with(person)
    # @secured
    def get(self):
        """Auslesen aller Customer-Objekte.

        Sollten keine Customer-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = KleiderschrankAdministration()
        personen = adm.get_all_personen()
        return personen

    @wardrobe_ns.marshal_with(person, code=200)
    @wardrobe_ns.expect(person)
    # @secured
    def post(self):
        """Anlegen eines neuen Personen-Objekts."""


        adm = KleiderschrankAdministration()

        proposal = Person.from_dict(api.payload)

        if proposal is not None:
            adm = KleiderschrankAdministration()

            # Erst Person erstellen
            p = adm.create_person(
                proposal.get_vorname(),
                proposal.get_nachname(),
                proposal.get_nickname(),
                proposal.get_google_id()
            )

            # Wenn ein Kleiderschrank im Proposal ist, diesen auch erstellen
            if proposal.get_kleiderschrank():
                kleiderschrank = adm.create_kleiderschrank(
                    proposal.get_kleiderschrank().get_name(),
                    p  # Die gerade erstellte Person als Eigentümer
                )
                # Den erstellten Kleiderschrank der Person zuweisen
                p.set_kleiderschrank(kleiderschrank)
                # Person mit dem neuen Kleiderschrank speichern
                adm.save_person(p)

            return p, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500


@wardrobe_ns.route('/persons/<int:id>')
@wardrobe_ns.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@wardrobe_ns.param('id', 'Die ID des Personen-Objekts')
class PersonOperations(Resource):
    @wardrobe_ns.marshal_with(person)
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
        try:
            adm = KleiderschrankAdministration()
            pers = adm.get_person_by_id(id)
            if pers:
                adm.delete_person(pers)
                return '', 204  # Standardmäßiger Status-Code für erfolgreiche DELETE-Operation
            return {'message': 'Person nicht gefunden'}, 404
        except Exception as e:
            return {'message': str(e)}, 500

    @wardrobe_ns.marshal_with(person)
    @wardrobe_ns.expect(person, validate=True)
    #@secured
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

@wardrobe_ns.route('/persons-by-name/<string:nachname>')
@wardrobe_ns.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@wardrobe_ns.param('nachname', 'Der Nachname der Person')
class PersonsByNameOperations(Resource):
    @wardrobe_ns.marshal_with(person)
    #@secured
    def get(self, nachname):
        """ Auslesen von Personen-Objekten, die durch den Nachnamen bestimmt werden.

        Die auszulesenden Objekte werden durch ```lastname``` in dem URI bestimmt.
        """
        adm = KleiderschrankAdministration()
        persons = adm.get_person_by_nachname(nachname)
        return persons

@wardrobe_ns.route('/persons-by-google-id/<string:google_id>')
@wardrobe_ns.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@wardrobe_ns.param('google_id', 'Die Google ID der Person')
class PersonByGoogleIdOperations(Resource):
    @wardrobe_ns.marshal_with(person)
    #@secured
    def get(self, google_id):
        """Auslesen einer bestimmten Person anhand ihrer Google ID."""
        adm = KleiderschrankAdministration()
        person = adm.get_person_by_google_id(google_id)
        return person

@wardrobe_ns.route('/wardrobes')
@wardrobe_ns.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class WardrobeListOperations(Resource):
    @wardrobe_ns.marshal_list_with(kleiderschrank_model)
    #@secured
    def get(self):
        """Auslesen aller Kleiderschrank-Objekte.

        Sollten keine Kleiderschrank-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = KleiderschrankAdministration()
        wardrobe_list = adm.get_all_kleiderschraenke()
        return wardrobe_list

    @wardrobe_ns.marshal_with(kleiderschrank_model, code=201)
    @wardrobe_ns.expect(kleiderschrank_model)
    # @secured
    @wardrobe_ns.route('/wardrobes')
    class WardrobeListOperations(Resource):
        @wardrobe_ns.marshal_with(kleiderschrank_model, code=201)
        @wardrobe_ns.expect(kleiderschrank_model)
        # @secured
        def post(self):
            try:
                print("Empfangene Payload:", api.payload)

                adm = KleiderschrankAdministration()

                # Erst die Person laden
                eigentuemer = adm.get_person_by_id(api.payload['eigentuemer_id'])
                if not eigentuemer:
                    return {'message': 'Eigentümer nicht gefunden'}, 404

                print("Gefundener Eigentümer:", eigentuemer)
                print("Eigentümer ID:", eigentuemer.get_id())

                # Kleiderschrank erstellen
                result = adm.create_kleiderschrank(
                    api.payload['name'],
                    eigentuemer
                )
                print("Kleiderschrank erstellt:", result)
                print("Kleiderschrank ID:", result.get_id())

                return result, 201

            except Exception as e:
                print(f"Fehler beim Erstellen des Kleiderschranks: {str(e)}")
                return {'message': str(e)}, 500


@wardrobe_ns.route('/wardrobes/<int:id>')
@wardrobe_ns.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@wardrobe_ns.param('id', 'Die ID des Kleiderschrank-Objekts')
class WardrobeOperations(Resource):
    @wardrobe_ns.marshal_with(kleiderschrank_model)
    #@secured
    def get(self, id):
        """Auslesen eines bestimmten Kleiderschrank-Objekts.

        Das auszulesende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = KleiderschrankAdministration()
        wardrobe_obj = adm.get_kleiderschrank_by_id(id)
        return wardrobe_obj

    #@secured
    def delete(self, id):
        """Löschen eines bestimmten Kleiderschrank-Objekts.

        Das zu löschende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = KleiderschrankAdministration()
        wardrobe_obj = adm.get_kleiderschrank_by_id(id)
        adm.delete_kleiderschrank(wardrobe_obj)
        return '', 200

    @wardrobe_ns.marshal_with(kleiderschrank_model)
    @wardrobe_ns.expect(kleiderschrank_model, validate=True)
    #@secured
    def put(self, id):
        """Update eines bestimmten Kleiderschrank-Objekts.

        **ACHTUNG:** Relevante id ist die id, die mittels URI bereitgestellt und somit als Methodenparameter
        verwendet wird. Dieser Parameter überschreibt das ID-Attribut des im Payload der Anfrage übermittelten
        Kleiderschrank-Objekts.
        """
        try:
            adm = KleiderschrankAdministration()
            kleiderschrank = adm.get_kleiderschrank_by_id(id)

            if not kleiderschrank:
                return {'message': f'Kleiderschrank mit ID {id} nicht gefunden'}, 404

            # Name aktualisieren
            kleiderschrank.set_name(api.payload['name'])

            # Speichern
            adm.save_kleiderschrank(kleiderschrank)
            return kleiderschrank, 200

        except Exception as e:
            print(f"Route: Fehler beim Update: {str(e)}")
            return {'message': str(e)}, 500


@wardrobe_ns.route('/persons-by-google-id/<string:google_id>')
@wardrobe_ns.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@wardrobe_ns.param('google_id', 'Die Google ID der Person')
class PersonsByGoogleIdOperations(Resource):
    @wardrobe_ns.marshal_with(person)
    def get(self, google_id):
        """Auslesen einer Person anhand der Google ID"""
        adm = KleiderschrankAdministration()
        person = adm.get_person_by_google_id(google_id)

        # Neue Debug-Ausgaben
        if person:
            print(f"Backend: Person hat Kleiderschrank: {person.getKleiderschrank()}")
            if person.getKleiderschrank():
                print(f"Backend: Kleiderschrank Name: {person.getKleiderschrank().getName()}")
                print(f"Backend: Kleiderschrank ID: {person.getKleiderschrank().getId()}")

        if person is None:
            return '', 204
        return person

@wardrobe_ns.route('/clothes')
@wardrobe_ns.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class ClothesListOperations(Resource):
    @wardrobe_ns.marshal_list_with(kleidungsstueck)
    #@secured
    def get(self):
        """Auslesen aller Kleidungsstück-Objekte.

        Sollten keine Kleidungsstücke verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = KleiderschrankAdministration()
        clothes_list = adm.get_all_kleidungsstuecke()
        return clothes_list

    @wardrobe_ns.marshal_with(kleidungsstueck, code=201)
    @wardrobe_ns.expect(kleidungsstueck)
    #@secured
    def post(self):
        """Anlegen eines neuen Kleidungsstück-Objekts.

        **ACHTUNG:** Wir fassen die vom Client gesendeten Daten als Vorschlag auf.
        Die Vergabe der ID erfolgt serverseitig.
        *Das korrigierte Objekt wird zurückgegeben.*
        """
        adm = KleiderschrankAdministration()

        # Holt zuerst den Typ als vollständiges Objekt
        typ = adm.get_kleidungstyp_by_id(api.payload['typ_id'])

        # Modifiziert das payload so dass es ein Typ-Objekt enthält
        modified_payload = api.payload.copy()
        modified_payload['typ'] = typ

        proposal = Kleidungsstueck.from_dict(modified_payload)

        if proposal is not None:
            clothing = adm.create_kleidungsstueck(
                proposal.get_name(),
                proposal.get_typ(),
                proposal.get_kleiderschrank_id()
            )
            return clothing, 201
        else:
            return '', 500


@wardrobe_ns.route('/clothes/<int:id>')
@wardrobe_ns.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@wardrobe_ns.param('id', 'Die ID des Kleidungsstück-Objekts')
class ClothingItemOperations(Resource):
    @wardrobe_ns.marshal_with(kleidungsstueck)
    #@secured
    def get(self, id):
        """Auslesen eines bestimmten Kleidungsstück-Objekts.

        Das auszulesende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = KleiderschrankAdministration()
        clothing_item = adm.get_kleidungsstueck_by_id(id)
        return clothing_item

    #@secured
    def delete(self, id):
        """Löschen eines bestimmten Kleidungsstück-Objekts.

        Das zu löschende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = KleiderschrankAdministration()
        clothing_item = adm.get_kleidungsstueck_by_id(id)
        adm.delete_kleidungsstueck(clothing_item)
        return '', 200

    @wardrobe_ns.expect(kleidungsstueck, validate=True)
    #@secured
    def put(self, id):
        """Update eines bestimmten Kleidungsstück-Objekts.

        Die Objekt-ID wird durch den URI-Parameter überschrieben.
        """
        adm = KleiderschrankAdministration()

        # Holt zuerst den Typ als vollständiges Objekt
        typ = adm.get_kleidungstyp_by_id(api.payload['typ_id'])

        # Modifiziert das payload so dass es ein Typ-Objekt enthält
        modified_payload = api.payload.copy()
        modified_payload['typ'] = typ

        c = Kleidungsstueck.from_dict(modified_payload)

        if c is not None:
            """Setze die ID des zu überschreibenden Kleidungsstück-Objekts."""
            c.set_id(id)
            adm.save_kleidungsstueck(c)
            return '', 204  # 204 bedeutet "No Content" - erfolgreich aber keine Rückgabe
        else:
            return '', 500


@wardrobe_ns.route('/styles')
@wardrobe_ns.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class StyleListOperations(Resource):
    @wardrobe_ns.marshal_list_with(style)
    #@secured
    def get(self):
        """Auslesen aller Style-Objekte.

        Sollten keine Styles verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = KleiderschrankAdministration()
        styles_list = adm.get_all_styles()
        return styles_list

    @wardrobe_ns.marshal_with(style, code=201)
    @wardrobe_ns.expect(style)
    #@secured
    def post(self):
        """Anlegen eines neuen Style-Objekts.

        **ACHTUNG:** Wir fassen die vom Client gesendeten Daten als Vorschlag auf.
        Die Vergabe der ID erfolgt serverseitig.
        *Das korrigierte Objekt wird zurückgegeben.*
        """
        adm = KleiderschrankAdministration()

        # Style-Objekt aus den Daten erstellen
        proposal = Style.from_dict(api.payload)

        if proposal is not None:
            # Style erstellen
            sty = adm.create_style(proposal.get_name())

            # Features übernehmen
            if proposal.get_features():
                for feature_id in proposal.get_features():
                    feature = adm.get_kleidungstyp_by_id(feature_id)
                    if feature:
                        sty.add_feature(feature)

            # Constraints übernehmen
            constraints = proposal.get_constraints()
            for k in constraints.get('kardinalitaeten', []):
                sty.add_constraint(k)
            for m in constraints.get('mutexe', []):
                sty.add_constraint(m)
            for i in constraints.get('implikationen', []):
                sty.add_constraint(i)

            # Style mit Features und Constraints speichern
            adm.save_style(sty)

            # Aktuellen Stand zurückgeben
            return adm.get_style_by_id(sty.get_id()), 201
        else:
            return '', 500


@wardrobe_ns.route('/styles/<int:id>')
@wardrobe_ns.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@wardrobe_ns.param('id', 'Die ID des Style-Objekts')
class StyleOperations(Resource):
    @wardrobe_ns.marshal_with(style)
    #@secured
    def get(self, id):
        """Auslesen eines bestimmten Style-Objekts.

        Das auszulesende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = KleiderschrankAdministration()
        sty = adm.get_style_by_id(id)
        return sty

    #@secured
    def delete(self, id):
        """Löschen eines bestimmten Style-Objekts.

        Das zu löschende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = KleiderschrankAdministration()
        sty = adm.get_style_by_id(id)
        adm.delete_style(sty)
        return '', 200

    @wardrobe_ns.marshal_with(style)
    @wardrobe_ns.expect(style, validate=True)
    #@secured
    @wardrobe_ns.route('/styles/<int:id>')
    class StyleOperations(Resource):
        @wardrobe_ns.marshal_with(style)
        def put(self, id):
            try:
                adm = KleiderschrankAdministration()
                existing_style = adm.get_style_by_id(id)

                # Name und Features aktualisieren
                existing_style.set_name(api.payload['name'])
                existing_style._Style__features = []

                # Features hinzufügen
                for feature_id in api.payload['features']:
                    existing_style.add_feature(adm.get_kleidungstyp_by_id(feature_id))

                # Constraints zurücksetzen
                existing_style._Style__constraints = {
                    'kardinalitaeten': [],
                    'mutexe': [],
                    'implikationen': []
                }

                # Kardinalitäten
                for k in api.payload['constraints'].get('kardinalitaeten', []):
                    existing_style.add_constraint({
                        'type': 'kardinalitaet',
                        'minAnzahl': k.get('min_anzahl'),
                        'maxAnzahl': k.get('max_anzahl'),
                        'bezugsobjekt_id': k.get('bezugsobjekt_id')
                    })

                # Mutexe
                for m in api.payload['constraints'].get('mutexe', []):
                    existing_style.add_constraint({
                        'type': 'mutex',
                        'bezugsobjekt1_id': m.get('bezugsobjekt1_id'),
                        'bezugsobjekt2_id': m.get('bezugsobjekt2_id')
                    })

                # Implikationen
                for i in api.payload['constraints'].get('implikationen', []):
                    existing_style.add_constraint({
                        'type': 'implikation',
                        'bezugsobjekt1_id': i.get('bezugsobjekt1_id'),
                        'bezugsobjekt2_id': i.get('bezugsobjekt2_id')
                    })

                # Style speichern
                adm.save_style(existing_style)

                # Das aktualisierte Style-Objekt zurückgeben
                updated_style = adm.get_style_by_id(id)
                return updated_style

            except Exception as e:
                return {'message': str(e)}, 500

@wardrobe_ns.route('/clothing-types')
@wardrobe_ns.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class ClothingTypeListOperations(Resource):
    @wardrobe_ns.marshal_list_with(kleidungstyp)
    #@secured
    def get(self):
        """Auslesen aller Kleidungstyp-Objekte.

        Sollten keine Kleidungstypen verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = KleiderschrankAdministration()
        clothing_types_list = adm.get_all_kleidungstypen()
        return clothing_types_list

    @wardrobe_ns.marshal_with(kleidungstyp, code=201)
    @wardrobe_ns.expect(kleidungstyp)
    #@secured
    def post(self):
        """Anlegen eines neuen Kleidungstyp-Objekts.

        **ACHTUNG:** Wir fassen die vom Client gesendeten Daten als Vorschlag auf.
        Die Vergabe der ID erfolgt serverseitig.
        *Das korrigierte Objekt wird zurückgegeben.*
        """
        adm = KleiderschrankAdministration()

        # Erstellt Kleidungstyp-Objekt aus den übertragenen Daten
        proposal = Kleidungstyp.from_dict(api.payload)
        # Erstellt eine leere Liste für die Style-IDs
        verwendungen = []

        # Geht durch alle Verwendungen des Kleidungstyps
        for verwendung in proposal.get_verwendungen():
            # Holt die ID jeder Verwendung und fügt sie der Liste hinzu
            style_id = verwendung.get_id()
            verwendungen.append(style_id)

        if proposal is not None:
            """ Wir erstellen ein Kleidungstyp-Objekt basierend auf den Vorschlagsdaten.
            Das serverseitig erzeugte Objekt ist das maßgebliche und 
            wird dem Client zurückgegeben. 
            """
            clothing_type = adm.create_kleidungstyp(
                proposal.get_bezeichnung(),
                verwendungen
            )
            return clothing_type, 201
        else:
            # Wenn etwas schiefgeht, werfen wir einen Server-Fehler.
            return '', 500


@wardrobe_ns.route('/clothing-types/<int:id>')
@wardrobe_ns.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@wardrobe_ns.param('id', 'Die ID des Kleidungstyp-Objekts')
class ClothingTypeOperations(Resource):
    @wardrobe_ns.marshal_with(kleidungstyp)
    #@secured
    def get(self, id):
        """Auslesen eines bestimmten Kleidungstyp-Objekts.

        Das auszulesende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = KleiderschrankAdministration()
        clothing_type = adm.get_kleidungstyp_by_id(id)
        return clothing_type

    #@secured
    def delete(self, id):
        """Löschen eines bestimmten Kleidungstyp-Objekts.

        Das zu löschende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = KleiderschrankAdministration()
        clothing_type = adm.get_kleidungstyp_by_id(id)
        adm.delete_kleidungstyp(clothing_type)
        return '', 200

    @wardrobe_ns.marshal_with(kleidungstyp)
    @wardrobe_ns.expect(kleidungstyp, validate=True)
    #@secured
    def put(self, id):
        """Update eines bestimmten Kleidungstyp-Objekts.

        Die Objekt-ID wird durch den URI-Parameter überschrieben.
        """
        adm = KleiderschrankAdministration()
        ct = Kleidungstyp.from_dict(api.payload)

        if ct is not None:
            """Setzt die ID des zu überschreibenden Kleidungstyp-Objekts."""
            ct.set_id(id)
            adm.save_kleidungstyp(ct)
            return '', 200
        else:
            return '', 500


@wardrobe_ns.route('/outfits')
@wardrobe_ns.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class OutfitListOperations(Resource):
    @wardrobe_ns.marshal_list_with(outfit)
    #@secured
    def get(self):
        """Auslesen aller Outfit-Objekte.

        Sollten keine Outfits verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = KleiderschrankAdministration()
        outfits = adm.get_all_outfits()
        return outfits

    @wardrobe_ns.marshal_with(outfit, code=201)
    @wardrobe_ns.expect(outfit)
    #@secured
    def post(self):
        """Erstellt ein neues Outfit basierend auf ausgewählten Kleidungsstücken."""
        adm = KleiderschrankAdministration()
        data = api.payload

        # Kleidungsstücke laden
        kleidungsstuecke = [adm.get_kleidungsstueck_by_id(k_id)
                            for k_id in data['bausteine']]

        # Outfit erstellen
        outfit = adm.create_outfit_from_selection(kleidungsstuecke, data['style'])

        if outfit:
            return outfit, 201
        return {'message': 'Outfit konnte nicht erstellt werden'}, 400


@wardrobe_ns.route('/outfits/<int:id>')
@wardrobe_ns.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@wardrobe_ns.param('id', 'Die ID des Outfit-Objekts')
class OutfitOperations(Resource):
    @wardrobe_ns.marshal_with(outfit)
    #@secured
    def get(self, id):
        """Auslesen eines bestimmten Outfit-Objekts."""
        adm = KleiderschrankAdministration()
        outfit = adm.get_outfit_by_id(id)
        return outfit

    #@secured
    def delete(self, id):
        """Löschen eines bestimmten Outfit-Objekts."""
        adm = KleiderschrankAdministration()
        outfit = adm.get_outfit_by_id(id)
        if outfit:
            adm.delete_outfit(outfit)
            return '', 200
        return {'message': 'Outfit nicht gefunden'}, 404


@wardrobe_ns.route('/styles/<int:style_id>/outfits/complete')
class OutfitCompletion(Resource):
    @wardrobe_ns.expect(kleidungsstueck)
    #@secured
    def post(self, style_id):
        """Outfit vervollständigen basierend auf einem Basis-Kleidungsstück"""
        adm = KleiderschrankAdministration()
        basis_kleidungsstueck = Kleidungsstueck.from_dict(api.payload)
        return adm.get_possible_outfit_completions(basis_kleidungsstueck.get_id(), style_id)


@wardrobe_ns.route('/styles/<int:style_id>/outfits/complete/<int:kleidungsstueck_id>')
@wardrobe_ns.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class OutfitCompletionOperations(Resource):
    def get(self, style_id, kleidungsstueck_id):
        adm = KleiderschrankAdministration()
        style = adm.get_style_by_id(style_id)  # Style explizit laden
        passende_kleidungsstuecke = adm.get_possible_outfit_completions(kleidungsstueck_id, style_id)

        # Vollständige Objekte als JSON zurückgeben
        result = []
        for k in passende_kleidungsstuecke:
            result.append({
                'id': k.get_id(),
                'name': k.get_name(),
                'typ': {
                    'id': k.get_typ().get_id(),
                    'bezeichnung': k.get_typ().get_bezeichnung(),
                    'verwendungen': [{
                        'id': style.get_id(),
                        'name': style.get_name()
                    } for style in k.get_typ().get_verwendungen()]
                },
                'kleiderschrank_id': k.get_kleiderschrank_id()
            })
        return result


@wardrobe_ns.route('/outfits/validate/<int:id>')
class OutfitValidation(Resource):
    #@secured
    def get(self, id):
        """Überprüft, ob ein Outfit alle Style-Constraints erfüllt."""
        adm = KleiderschrankAdministration()
        outfit = adm.get_outfit_by_id(id)

        if not outfit:
            return {'message': 'Outfit nicht gefunden'}, 404

        is_valid = adm.check_outfit_constraints(outfit)
        return {'valid': is_valid}

def kleidungsstueck_to_dict(kleidungsstueck):
    """Wandelt ein Kleidungsstueck-Objekt in ein Dictionary um"""
    return {
        'id': kleidungsstueck.get_id(),
        'name': kleidungsstueck.get_name(),
        'typ': {
            'id': kleidungsstueck.get_typ().get_id(),
            'bezeichnung': kleidungsstueck.get_typ().get_bezeichnung()
        } if kleidungsstueck.get_typ() else None,
        'kleiderschrank_id': kleidungsstueck.get_kleiderschrank_id()
    }


@wardrobe_ns.route('/cardinalityconstraints')
@wardrobe_ns.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class CardinalityConstraintListOperations(Resource):
    @wardrobe_ns.marshal_list_with(kardinalitaet)
    #@secured
    def get(self):
        """Auslesen aller Kardinalitäts-Constraints"""
        adm = KleiderschrankAdministration()
        constraints_list = adm.get_all_kardinalitaeten()
        return constraints_list

    @wardrobe_ns.marshal_with(kardinalitaet, code=201)
    @wardrobe_ns.expect(kardinalitaet)
    #@secured
    def post(self):
        """Erstellen eines neuen Kardinalitäts-Constraints"""
        adm = KleiderschrankAdministration()
        payload = api.payload

        # Logik zur Verarbeitung und Rückgabe eines Kardinalitaet-Objekts
        proposal = Kardinalitaet.from_dict(payload)
        created_constraint = adm.create_kardinalitaet(
            proposal.get_min_anzahl(),
            proposal.get_max_anzahl(),
            proposal.get_bezugsobjekt(),
            proposal.get_style()
        )
        return created_constraint, 201


@wardrobe_ns.route('/cardinalityconstraints/<int:id>')
@wardrobe_ns.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@wardrobe_ns.param('id', 'Die ID des Kardinalitäts-Constraints')
class CardinalityConstraintOperations(Resource):
    @wardrobe_ns.marshal_with(kardinalitaet)
    #@secured
    def get(self, id):
        """Auslesen eines spezifischen Kardinalitäts-Constraints"""
        adm = KleiderschrankAdministration()
        constraint = adm.get_kardinalitaet_by_id(id)
        return constraint

    #@secured
    def delete(self, id):
        """Löschen eines Kardinalitäts-Constraints"""
        adm = KleiderschrankAdministration()
        constraint = adm.get_kardinalitaet_by_id(id)
        adm.delete_kardinalitaet(constraint)
        return '', 200

    @wardrobe_ns.marshal_with(kardinalitaet)
    @wardrobe_ns.expect(kardinalitaet, validate=True)
    # @secured
    def put(self, id):
        """Updaten eines Kardinalitäts-Constraints"""
        adm = KleiderschrankAdministration()
        try:
            # Payload verarbeiten
            payload = api.payload

            cc = Kardinalitaet.from_dict(payload)
            if not cc:
                return '', 400

            cc.set_id(id)

            # Style laden und setzen
            style = adm.get_style_by_id(payload.get('style'))
            if not style:
                return '', 400
            cc.set_style(style)

            # Bezugsobjekt laden und setzen
            bezugsobjekt = adm.get_kleidungstyp_by_id(payload.get('bezugsobjekt'))
            if not bezugsobjekt:
                return '', 400
            cc.set_bezugsobjekt(bezugsobjekt)

            # Constraint speichern
            adm.save_kardinalitaet(cc)

            return cc, 200
        except Exception as e:
            return '', 500


@wardrobe_ns.route('/implicationconstraints')
@wardrobe_ns.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class ImplicationConstraintListOperations(Resource):
    @wardrobe_ns.marshal_list_with(implikation)
    #@secured
    def get(self):
        """Auslesen aller Implikations-Constraints"""
        adm = KleiderschrankAdministration()
        constraints_list = adm.get_all_implikationen()
        return constraints_list

    @wardrobe_ns.marshal_with(implikation, code=201)
    @wardrobe_ns.expect(implikation)
    #@secured
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


@wardrobe_ns.route('/implicationconstraints/<int:id>')
@wardrobe_ns.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@wardrobe_ns.param('id', 'Die ID des Implikations-Constraints')
class ImplicationConstraintOperations(Resource):
    @wardrobe_ns.marshal_with(implikation)
    #@secured
    def get(self, id):
        """Auslesen eines spezifischen Implikations-Constraints"""
        adm = KleiderschrankAdministration()
        constraint = adm.get_implikation_by_id(id)
        return constraint

    #@secured
    def delete(self, id):
        """Löschen eines Implikations-Constraints"""
        adm = KleiderschrankAdministration()
        constraint = adm.get_implikation_by_id(id)
        adm.delete_implikation(constraint)
        return '', 200

    @wardrobe_ns.marshal_with(implikation)
    @wardrobe_ns.expect(implikation, validate=True)
    # @secured
    def put(self, id):
        """Updaten eines Implikations-Constraints"""
        adm = KleiderschrankAdministration()

        # Payload in ein Implikation-Objekt umwandeln
        payload = api.payload
        ic = Implikation.from_dict(payload)

        if ic is not None:
            # Setzt die ID des Constraints
            ic.set_id(id)

            # Lädt den Style basierend auf der Style-ID aus dem Payload
            style_id = payload.get('style')
            style = adm.get_style_by_id(style_id)

            if not style:
                return '', 404

            # Setzt den Style in der Implikation
            ic.set_style(style)

            # Speichert die aktualisierte Implikation
            adm.save_implikation(ic)

            # Erfolgreiche Antwort
            return ic, 200
        else:
            # Fehler beim Verarbeiten des Payloads
            return '', 400


@wardrobe_ns.route('/mutexconstraints')
@wardrobe_ns.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class MutexConstraintListOperations(Resource):
    @wardrobe_ns.marshal_list_with(mutex)
    #@secured
    def get(self):
        """Auslesen aller Mutex-Constraints"""
        adm = KleiderschrankAdministration()
        constraints_list = adm.get_all_mutex()
        return constraints_list

    @wardrobe_ns.marshal_with(mutex, code=201)
    @wardrobe_ns.expect(mutex)
    #@secured
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

@wardrobe_ns.route('/mutexconstraints/<int:id>')
@wardrobe_ns.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@wardrobe_ns.param('id', 'Die ID des Mutex-Constraints')
class MutexConstraintOperations(Resource):
    @wardrobe_ns.marshal_with(mutex)
    #@secured
    def get(self, id):
        """Auslesen eines spezifischen Mutex-Constraints"""
        adm = KleiderschrankAdministration()
        constraint = adm.get_mutex_by_id(id)
        return constraint

    #@secured
    def delete(self, id):
        """Löschen eines Mutex-Constraints"""
        adm = KleiderschrankAdministration()
        constraint = adm.get_mutex_by_id(id)
        adm.delete_mutex(constraint)
        return '', 200

    @wardrobe_ns.marshal_with(mutex)
    @wardrobe_ns.expect(mutex, validate=True)
    #@secured
    def put(self, id):
        """Updaten eines Mutex-Constraints"""
        adm = KleiderschrankAdministration()
        mc = Mutex.from_dict(api.payload)
        if mc is not None:
            mc.set_id(id)
            adm.save_mutex(mc)
            return mc, 200
        else:
            return '', 500


if __name__ == '__main__':
    app.run(debug=True)
