from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient
from starlette import status
import pytest
import sys
import os

# Add the ToDos directory to the sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database import base
from models import ToDoModel, Users
from main import app
from routers.auth import bcrypt_context

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

@pytest.fixture
def test_user():
    user = Users(
        username="admin",
        email="admin@admin.com",
        first_name="admin",
        last_name="admin",
        hashed_password = bcrypt_context.hash("testpassword"),
        role="admin",
    )

    db = TestingSessionLocal()
    db.add(user)
    db.commit()
    yield user
    with engine.connect() as connection:
        connection.execute(text("DELETE FROM USERS;"))
        connection.commit()
