from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
import os  # Import the os module here
from werkzeug.utils import secure_filename
from flask_cors import CORS
from werkzeug.datastructures import FileStorage
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///pencil.db"
app.config['SECRET_KEY'] = '55c4fe454d8ee50f9f81054f'
app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static', 'uploads')  # Path where images will be stored
app.config['JWT_SECRET_KEY'] = '55c4fe454d8ee50f9f81054f'

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Maximum file size (16MB)
if not os.path.exists(app.config["UPLOAD_FOLDER"]):
    os.makedirs(app.config["UPLOAD_FOLDER"])

ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
 
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
login_manager = LoginManager(app)
login_manager.login_view = "login_page"
login_manager.login_message_category = "info"


# Import models after db is initialized
from pencil.models import User  # Ensure these are imported here

from pencil import routes
