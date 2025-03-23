
from .utils import *
from routers.users import get_current_user, get_db

app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_current_user] = override_get_current_user

def test_return_user(test_user):
    response = client.get("/users/user")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()['username'] ==  'admin'
    assert response.json()['first_name'] == 'admin'
    assert response.json()['last_name'] == 'admin'
    assert response.json()['email'] == 'admin@admin.com'
    assert response.json()['role'] == 'admin'

def test_change_password_success(test_user):
    json_request = {"password":"testpassword", "new_password":"newpassword"}
    response = client.put("/users/change-password/", json=json_request)

    assert response.status_code == status.HTTP_204_NO_CONTENT

def test_change_password_invalid_current_password(test_user):
    json_request = {"password": "wrong_password", "new_password": "newpassword"}
    response = client.put("/users/change-password/", json=json_request)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail':'Invalid Old Password'}

