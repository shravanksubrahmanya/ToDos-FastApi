from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient
import pytest

from database import base
from models import ToDoModel
from main import app

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
