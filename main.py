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
            proposal.get_first_name(), proposal.get_last_name())
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


if __name__ == '__main__':
    app.run(debug=True)
