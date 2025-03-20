from pydantic import BaseModel, Field

from fastapi import APIRouter, HTTPException, Path
from starlette import status
from fastapi.params import Depends
from sqlalchemy.orm import Session
from database import session_local
from typing import Annotated
from models import Users
from .auth import get_current_user
from .auth import bcrypt_context, authenticate_user

router = APIRouter(
    prefix='/users',
    tags=['users']
)

def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

class UserVerification(BaseModel):
    password: str
    new_password : str = Field(min_length=6, description="New Password")

@router.get("/user", status_code=status.HTTP_200_OK)
async def get_user(user: user_dependency, db:db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    return db.query(Users).filter(Users.id == user.get("user_id")).first()

@router.put("/change-password/", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(user: user_dependency, db:db_dependency, user_verification: UserVerification):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    user_model = db.query(Users).filter(Users.id == user.get('user_id')).first()
    if user_model is None:
        raise HTTPException(status_code=404, detail="User details is not found")
    if not bcrypt_context.verify(user_verification.password, user_model.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid Old Password")
    user_model.hashed_password = bcrypt_context.hash(user_verification.new_password)
    db.add(user_model)
    db.commit()
