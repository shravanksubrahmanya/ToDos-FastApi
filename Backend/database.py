from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQL_ALCHEMY_DATABASE_URL="sqlite:///./todosapp.db"
# SQL_ALCHEMY_DATABASE_URL = "postgresql://postgres:admin@localhost/TodoApplicationDatabase"
engine = create_engine(SQL_ALCHEMY_DATABASE_URL, connect_args={'check_same_thread': False})
# engine = create_engine(SQL_ALCHEMY_DATABASE_URL)
session_local= sessionmaker(autocommit=False, autoflush=False, bind=engine)

base = declarative_base()