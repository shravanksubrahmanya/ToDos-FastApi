from pydantic import BaseModel, Field

from fastapi import APIRouter, HTTPException, Path
from starlette import status
from fastapi.params import Depends
from sqlalchemy.orm import Session
from database import session_local
from typing import Annotated
from models import ToDoModel
from .auth import get_current_user

router = APIRouter(
    prefix='/admin',
    tags=['admin']
)

def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get("/todo", status_code=status.HTTP_200_OK)
async def read_all(user: user_dependency, db: db_dependency):
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code=401, detail="Authentication Failed")
    return db.query(ToDoModel).all()

@router.delete("/todo/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(user:user_dependency, db:db_dependency, todo_id: int = Path(gt=0, description="The todo id to be deleted")):
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code=401, detail="Authentication Failed")
    todo_model = db.query(ToDoModel).filter(ToDoModel.id == todo_id).first()
    if todo_model is None:
        raise HTTPException(status_code=404, detail="ToDo Not Found")
    db.query(ToDoModel).filter(ToDoModel.id == todo_id).delete()
    db.commit()
