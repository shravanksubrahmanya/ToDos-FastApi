from http.client import responses

from httpx import request
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient
from starlette import status
import pytest
from models import ToDoModel
import sys
import os

# Add the ToDos directory to the sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database import base
from main import app
from routers.todos import get_db, get_current_user

TEST_SQL_ALCHEMY_DATABASE_URL = "sqlite:///./testdb.db"

engine = create_engine(TEST_SQL_ALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}, poolclass=StaticPool)

TestingSessionLocal = sessionmaker(autoflush=False, autocommit=False, bind=engine)

base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

def override_get_current_user():
    return {"username": 'admin', "user_id": 1, "user_role": "admin"}

app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_current_user] = override_get_current_user

client = TestClient(app)

@pytest.fixture
def test_todo():
    todo = ToDoModel(
        title="Learn to code",
        description = "Need to learn everyday",
        priority = 3,
        complete = False,
        owner_id = 1
    )

    db = TestingSessionLocal()
    db.add(todo)
    db.commit()
    yield db
    with engine.connect() as connection:
        connection.execute(text("DELETE FROM todos;"))
        connection.commit()

def test_read_all_authenticated(test_todo):
    response = client.get("/")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == [{'complete':False, 'title':'Learn to code', "description":"Need to learn everyday", 'id':1, 'priority':3, 'owner_id':1}]

def test_read_one_authenticated(test_todo):
    response = client.get("/todo/1")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {'complete':False, 'title':'Learn to code', "description":"Need to learn everyday", 'id':1, 'priority':3, 'owner_id':1}

def test_read_one_authenticated_not_found():
    response = client.get("/todo/999")
    assert response.status_code == 404
    assert response.json() == {"detail":"Todo not found"}

def test_create_todo(test_todo):
    request_data = {
        'title': 'New Todo',
        'description': 'New Todo description',
        'priority': 4,
        'complete': False
    }

    response = client.post("/todo", json=request_data)
    assert response.status_code == 201

    db = TestingSessionLocal()
    model = db.query(ToDoModel).filter(ToDoModel.id == 2).first()
    assert model.title == request_data.get('title')
    assert model.description == request_data.get('description')
    assert model.priority == request_data.get('priority')
    assert model.complete == request_data.get('complete')

def test_update_todo(test_todo):
    request_data = {
        'title': 'Change the title of the todo',
        'description': 'Need to learn everyday',
        'priority': 1,
        'complete': False
    }

    response = client.put('/todo/1', json=request_data)
    assert response.status_code == 204
    db = TestingSessionLocal()
    model = db.query(ToDoModel).filter(ToDoModel.id == 1).first()
    assert model.title == request_data.get('title')
    assert model.description == request_data.get('description')
    assert model.priority == request_data.get('priority')
    assert model.complete == request_data.get('complete')

def test_update_todo_not_found(test_todo):
    request_data = {
        'title': 'Change the title of the todo',
        'description': 'Need to learn everyday',
        'priority': 1,
        'complete': False
    }

    response = client.put('/todo/999', json=request_data)
    assert response.status_code == 404
    assert response.json() == {'detail':'Todo not found'}

def test_delete_todo(test_todo):
    response = client.delete('/todo/1')
    assert response.status_code == 204
    db = TestingSessionLocal()
    model = db.query(ToDoModel).filter(ToDoModel.id == 1).first()
    assert model is None

def test_delete_todo_not_found():
    response = client.delete('/todo/999')
    assert response.status_code == 404
    assert response.json() == {'detail': 'Todo not found'}