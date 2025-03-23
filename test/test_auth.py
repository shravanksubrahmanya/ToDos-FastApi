
from .utils import *
from routers.auth import get_db, get_current_user, authenticate_user

app.dependency_overrides[get_db()] = override_get_db()

def test_authenticate_user(test_user):
    db = TestingSessionLocal()
    authenticated_user = authenticate_user(test_user.username, "testpassword", db)
    assert authenticated_user is not None
    assert authenticated_user.username == test_user.username

    non_existent_user = authenticate_user("wrong_username", "testpassword", db)
    assert non_existent_user is False

    wrong_password_user = authenticate_user(test_user.username, "wrong_password", db)
    assert wrong_password_user is False
