from fastapi import FastAPI
from fastapi.params import Depends
from sqlalchemy.orm import Session
import models
from database import engine, session_local
from typing import Annotated, Optional
from models import ToDoModel

app = FastAPI()

models.base.metadata.create_all(bind=engine)

def get_db():
    db = session_local()
    # open up a connection only when you are using the database and close it after that.
    try:
        # only the code prior to and including the yield statement is executed before the function is run
        yield db
    finally:
        # the code after the yield statement is executed after the function is run
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@app.get("/")
async def read_all(db: db_dependency): # Depends => dependency injection -> we need to do something before we run the function
    return db.query(ToDoModel).all()