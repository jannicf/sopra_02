from flask import request
from google.auth.transport import requests
import google.oauth2.id_token

from src.server.KleiderschrankAdministration import KleiderschrankAdministration


def secured(function):
    """Decorator zur Google Firebase-basierten Authentifizierung von Benutzern

    Da es sich bei diesem System um eine Fallstudie im Rahmen des Hochschulprojekts handelt,
    wurde hier bewusst auf ein komplexes Berechtigungskonzept verzichtet. Dieser Decorator
    implementiert eine grundlegende Authentifizierung mittels Firebase.

    POLICY: Jeder Nutzer mit einem von Firebase akzeptierten Account kann sich am System
    anmelden. Bei der Anmeldung werden Vor- und Nachname, Nickname sowie die Google User ID
    in unserem System gespeichert bzw. aktualisiert.
    """
    firebase_request_adapter = requests.Request()

    def wrapper(*args, **kwargs):
        # Firebase auth verifizieren
        id_token = request.cookies.get("token")
        error_message = None
        claims = None
        objects = None

        if id_token:
            try:
                # Token gegen die Firebase Auth API verifizieren
                claims = google.oauth2.id_token.verify_firebase_token(
                    id_token, firebase_request_adapter)

                if claims is not None:
                    adm = KleiderschrankAdministration()

                    google_user_id = claims.get("user_id")
                    email = claims.get("email")
                    name = claims.get("name")

                    # Name in Vor- und Nachname aufteilen
                    name_parts = name.split(" ", 1)
                    vorname = name_parts[0]
                    nachname = name_parts[1] if len(name_parts) > 1 else ""

                    # Nickname aus Email generieren (Teil vor dem @)
                    nickname = email.split("@")[0]

                    person = adm.get_person_by_google_id(google_user_id)
                    if person is not None:
                        """Fall: Der Benutzer ist unserem System bereits bekannt.
                        Wir aktualisieren Namen und Nickname für den Fall, dass sich
                        diese in Firebase geändert haben."""
                        person.set_vorname(vorname)
                        person.set_nachname(nachname)
                        person.set_nickname(nickname)
                        adm.save_person(person)
                    else:
                        """Fall: Erster Login des Benutzers.
                        Wir legen eine neue Person an."""
                        person = adm.create_person(
                            vorname,
                            nachname,
                            nickname,
                            google_user_id
                        )

                    print(request.method, request.path, "angefragt durch:", nickname)

                    objects = function(*args, **kwargs)
                    return objects
                else:
                    return '', 401  # UNAUTHORIZED
            except ValueError as exc:
                error_message = str(exc)
                return exc, 401  # UNAUTHORIZED

        return '', 401  # UNAUTHORIZED

    return wrapper