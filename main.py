from fastapi import FastAPI
import sys
import os

# To ensure that your application uses absolute paths,
# you can modify the sys.path in your main application file (main.py) to include the ToDos directory.
# This way, all imports will be resolved correctly.

sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from models import base
from database import engine
from routers import auth, todos, admin, users


app = FastAPI()

base.metadata.create_all(bind=engine)

@app.get("/healthy")
def health_check():
    return {"status": "Healthy"}

app.include_router(auth.router)
app.include_router(todos.router)
app.include_router(admin.router)
app.include_router(users.router)
