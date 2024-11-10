Pencil
Pencil is a full-stack blogging website that allows users to create, edit, and manage blog posts. This project utilizes a React frontend with a Flask backend and MySQL database for seamless data management and dynamic user interaction.

Table of Contents
Overview
Features
Architecture
Technologies Used
Installation
Usage
License
Overview
Pencil is designed to offer a simple yet powerful blogging experience. Users can register, log in, and manage their blogs, while also exploring content shared by others. The project includes key elements for secure data handling and user-friendly interactions.

Features
User authentication and authorization with JWT
CRUD operations for blog posts
Responsive design for mobile and desktop
Profile management, including profile picture uploads via Cloudinary
Image storage and retrieval
Architecture
The architecture of Pencil follows a typical model for modern web applications, with separate frontend and backend components:

1. Frontend
The frontend is responsible for presenting the UI and communicating with the backend via API calls.

HTML, CSS, JavaScript: Define the structure, style, and interactivity of pages.
React: Provides a dynamic and responsive interface, optimizing user experience with a component-based structure.
2. Backend
The backend handles data processing, authentication, and serving responses.

Python (Flask): Powers the backend, building routes for each page, handling data requests, and managing user actions.
MySQL: Stores user data, blog posts, and other structured information with relational tables.
Security: Flask extensions flask_cors and flask_jwt_extended ensure data protection and secure communication between the client and server.
Technologies Used
Frontend:
HTML, CSS, JavaScript
React (for dynamic content and improved performance)
Backend:
Flask (Python)
MySQL (for relational data management)
Security:
flask_cors (Cross-Origin Resource Sharing for secure API requests)
flask_jwt_extended (JSON Web Token for user authentication)
Cloudinary:
Used for image uploads and storage, enabling secure and efficient media management.
Installation
Clone the Repository

bash

git clone https://github.com/a-mabroukk/Pencil-website.git
cd Pencil-website
Backend Setup

Install Python dependencies:
bash

pip install -r requirements.txt
Set up your MySQL database and update database configuration in Flask app.
Run Flask server:
bash

flask run
Frontend Setup

Navigate to the frontend directory:
bash

cd frontend
Install npm dependencies:
bash

npm install
Start the frontend server:
bash

npm start
Usage
Run both the frontend and backend servers.
Access the application by navigating to http://localhost:5173 (or the configured frontend port) in your web browser.
Register or log in to start creating, editing, and managing blog posts.
License
This project is open-source and available under the MIT License.
