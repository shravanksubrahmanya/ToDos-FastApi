# ToDo Application using FastAPI and SQLite3

This repository contains a backend API for a ToDo application built using FastAPI and SQLite3. The application allows users to manage their to-do tasks with features such as creating, reading, updating, and deleting tasks. The application also includes authentication and authorization mechanisms to ensure secure access to the API.

## Features

- **User Authentication and Authorization**: Secure login and access control for users.
- **CRUD Operations for ToDos**: Create, read, update, and delete to-do tasks.
- **SQLite3 Database**: Lightweight and easy-to-use database for storing user and to-do data.
- **Dependency Injection**: Utilizes FastAPI's dependency injection for database sessions and user authentication.

## Packages Used

- **FastAPI**: Web framework for building APIs with Python 3.7+.
- **SQLAlchemy**: SQL toolkit and Object-Relational Mapping (ORM) library.
- **SQLite3**: Database engine.
- **Pydantic**: Data validation and settings management using Python type annotations.
- **pytest**: Testing framework for Python.
- **bcrypt**: Library for hashing passwords.

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/shravanksubrahmanya/ToDos-FastApi.git
    cd ToDos-FastApi
    ```

2. **Create a virtual environment**:
    ```bash
    python -m venv .venv
    ```

3. **Activate the virtual environment**:
    - On Windows:
        ```bash
        .venv\Scripts\activate
        ```
    - On macOS/Linux:
        ```bash
        source .venv/bin/activate
        ```

4. **Install the required packages**:
    ```bash
    pip install -r requirements.txt
    ```

## Running the Application

1. **Start the FastAPI server**:
    ```bash
    uvicorn main:app --reload
    ```

2. **Access the API documentation**:
    - Open your browser and navigate to `http://127.0.0.1:8000/docs` for the interactive Swagger UI.
    - Alternatively, visit `http://127.0.0.1:8000/redoc` for the ReDoc documentation.

## Running Tests

1. **Run the tests using pytest**:
    ```bash
    pytest
    ```

## API Endpoints

### Authentication

- **Login**: `POST /token`
    - Request: `{ "username": "user", "password": "password" }`
    - Response: `{ "access_token": "token", "token_type": "bearer" }`

### ToDo Management

- **Get All ToDos**: `GET /todos/`
- **Get ToDo by ID**: `GET /todos/todo/{todo_id}`
- **Create ToDo**: `POST /todos/todo`
    - Request: `{ "title": "New Todo", "description": "Description", "priority": 1, "complete": false }`
- **Update ToDo**: `PUT /todos/todo/{todo_id}`
    - Request: `{ "title": "Updated Title", "description": "Updated Description", "priority": 2, "complete": true }`
- **Delete ToDo**: `DELETE /todos/todo/{todo_id}`

## Authentication and Authorization

The application uses JWT (JSON Web Tokens) for authentication. Users must log in to receive an access token, which must be included in the `Authorization` header of subsequent requests to protected endpoints.

### Example

```bash
curl -X 'POST' \
  'http://127.0.0.1:8000/token' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "user",
  "password": "password"
}'
```

Include the received token in the Authorization header for protected endpoints:
```bash
curl -X 'GET' \
  'http://127.0.0.1:8000/todos/' \
  -H 'Authorization: Bearer <access_token>'
```

### Database
The application uses SQLite3 as the database engine. The database schema is defined using SQLAlchemy ORM models.


### What Users Can Do
* ***Register and Log In:*** Users can register and log in to the application.
* ***Manage ToDos:*** Authenticated users can create, read, update, and delete their to-do tasks.

### Repository URL
For more information and to view the source code, visit the GitHub repository.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Developed by Shravan K Subrahmanya