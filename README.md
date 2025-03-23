# Full Stack ToDo Application

This repository contains a full-stack ToDo application with a FastAPI backend and a modern frontend. The application allows users to manage their to-do tasks with features such as creating, reading, updating, and deleting tasks, along with user authentication and authorization.

## Project Structure

The project is divided into two main parts:

- **Backend**: FastAPI + SQLite3 (in `Backend/` directory)
- **Frontend**: React + Vite application (in `ToDos-Frontend/` directory)

## Features

- **User Authentication and Authorization**: Secure login and access control for users
- **CRUD Operations for ToDos**: Create, read, update, and delete to-do tasks
- **Responsive UI**: Modern and user-friendly interface
- **SQLite3 Database**: Lightweight database for storing user and to-do data
- **REST API**: Well-structured API endpoints for frontend-backend communication

## Backend Technologies

- **FastAPI**: Web framework for building APIs with Python 3.7+
- **SQLAlchemy**: SQL toolkit and Object-Relational Mapping (ORM) library
- **SQLite3**: Database engine
- **Pydantic**: Data validation using Python type annotations
- **pytest**: Testing framework
- **bcrypt**: Password hashing library

## Frontend Technologies

- **React**: Frontend library
- **Vite**: Build tool and development server
- **TailwindCSS**: Utility-first CSS framework
- **Material-UI**: UI component library
- **JWT**: Token-based authentication

## Installation and Setup

### Backend Setup

1. **Navigate to backend directory**:

   ```bash
   cd Backend
   ```

2. **Create a virtual environment**:

   ```bash
   python -m venv .venv
   ```

3. **Activate the virtual environment**:

   - Windows:
     ```bash
     .venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source .venv/bin/activate
     ```

4. **Install backend dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

### Frontend Setup

1. **Navigate to frontend directory**:

   ```bash
   cd ToDos-Frontend
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

## Running the Application

### Start Backend Server

1. **From the backend directory**:
   ```bash
   uvicorn main:app --reload
   ```
2. **Access backend API docs**:
   - Swagger UI: `http://127.0.0.1:8000/docs`
   - ReDoc: `http://127.0.0.1:8000/redoc`

### Start Frontend Development Server

1. **From the frontend directory**:
   ```bash
   npm run dev
   ```
2. **Access the application**:
   - Open `http://localhost:5173` in your browser

## API Endpoints

### Authentication

- **Login**: `POST /token`
- **Register**: `POST /users/`

### ToDo Management

- **Get All ToDos**: `GET /todos/`
- **Get ToDo by ID**: `GET /todos/todo/{todo_id}`
- **Create ToDo**: `POST /todos/todo`
- **Update ToDo**: `PUT /todos/todo/{todo_id}`
- **Delete ToDo**: `DELETE /todos/todo/{todo_id}`

## Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

Frontend tests have not been implemented yet. They will be added in future updates to include:

- Unit tests with Jest
- Component testing with React Testing Library
- Integration tests for API interactions
- End-to-end testing with Cypress

To run the existing application:

1. **Start the backend server**:

```bash
cd backend
uvicorn main:app --reload
```

2. **Start the frontend development server**:

```bash
cd frontend
npm run dev
```

## Authentication Flow

1. Users register/login through the frontend interface
2. Backend validates credentials and returns JWT token
3. Frontend stores token in local storage
4. Token is included in subsequent API requests

## Development

- Backend runs on `http://127.0.0.1:8000`
- Frontend runs on `http://localhost:5173`
- API requests from frontend to backend are handled through the Fetch API

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Developed by Shravan K Subrahmanya
