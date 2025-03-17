from database import base
from sqlalchemy import Column, Integer, String, Boolean

class ToDoModel(base):
    __tablename__ = "todos" # Table name: what to name this table inside the database

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    priority = Column(Integer)
    complete = Column(Boolean, default=False)
