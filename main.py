from fastapi import FastAPI
import models
from database import engine
from routers import auth
from routers import todos
from routers import admin
from routers import users

app = FastAPI()

models.base.metadata.create_all(bind=engine)

@app.get("/healthy")
def health_check():
    return {"status": "Healthy"}

app.include_router(auth.router)
app.include_router(todos.router)
app.include_router(admin.router)
app.include_router(users.router)
