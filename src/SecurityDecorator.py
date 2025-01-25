# größtenteils übernommen aus der Vorlage von Prof. Thies aus 'PythonBankBeispiel-RELEASE_1.2.2'
from flask import request
from google.auth.transport import requests
import google.oauth2.id_token

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

        if id_token:
            try:
                # Token gegen die Firebase Auth API verifizieren
                claims = google.oauth2.id_token.verify_firebase_token(
                    id_token, firebase_request_adapter)

                if claims is not None:
                    google_user_id = claims.get("user_id")
                    print(request.method, request.path, "angefragt durch:", google_user_id)

                    objects = function(*args, **kwargs)
                    return objects
                else:
                    return '', 401  # UNAUTHORIZED
            except ValueError as exc:
                error_message = str(exc)
                return error_message, 401  # UNAUTHORIZED

        return '', 401  # UNAUTHORIZED

    return wrapper