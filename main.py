from pydantic import BaseModel, Field

from fastapi import FastAPI, HTTPException, Path, Query
from starlette import status
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

class TodoRequest(BaseModel):
    title: str = Field(min_length=3)
    description: str = Field(min_length=3, max_length=500)
    priority: int = Field(gt=0, lt=5)
    complete: bool = False

@app.get("/", status_code=status.HTTP_200_OK)
async def read_all(db: db_dependency): # Depends => dependency injection -> we need to do something before we run the function
    return db.query(ToDoModel).all()

@app.get("/todo/{todo_id}", status_code=status.HTTP_200_OK)
async def read_todo(db: db_dependency, todo_id: int = Path(gt=0, title="The ID of the todo")):
    todo_model = db.query(ToDoModel).filter(ToDoModel.id == todo_id).first()
    if todo_model is not None:
        return todo_model
    raise HTTPException(status_code=404, detail="Todo not found")

@app.post("/todo", status_code=status.HTTP_201_CREATED)
async def create_todo(db:db_dependency, todo_request: TodoRequest):
    todo_model = ToDoModel(**todo_request.model_dump())
    db.add(todo_model) #getting database ready
    db.commit() # actually doing the transaction to the database

@app.put("/todo/{todo_id}", status_code=status.HTTP_200_OK)
async def update_todo(db:db_dependency,
                      todo_request: TodoRequest,
                      todo_id:int = Path(gt=0, title="The ID of the todo")):
    todo_model = db.query(ToDoModel).filter(ToDoModel.id == todo_id).first()
    if todo_model is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    todo_model.title = todo_request.title
    todo_model.description = todo_request.description
    todo_model.priority = todo_request.priority
    todo_model.complete = todo_request.complete

    db.add(todo_model)
    db.commit()

@app.delete("/todo/{todo_id}", status_code=status.HTTP_200_OK)
async def delete_todo(db: db_dependency, todo_id: int = Path(gt=0, title="The ID of the todo")):
    todo_model = db.query(ToDoModel).filter(ToDoModel.id == todo_id).first()
    if todo_model is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(todo_model)
    db.commit()