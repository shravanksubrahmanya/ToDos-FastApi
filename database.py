from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

SQL_ALCHEMY_DATABASE_URL="sqlite:///./todosapp.db"

engine = create_engine(SQL_ALCHEMY_DATABASE_URL, connect_args={'check_same_thread': False})

session_local= sessionmaker(autocommit=False, autoflush=False, bind=engine)

base = declarative_base()