from pencil import db
from pencil import db, login_manager
from pencil import bcrypt
from flask_login import UserMixin
from datetime import datetime
from pencil.base_model import BaseModel


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class SavedBlog(BaseModel):
    __tablename__ = "saved_blogs"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("post.id"), nullable=False)
    publication_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    users = db.relationship("User", back_populates="archives")
    blogs = db.relationship("Post", back_populates="saved_posts")
    def __repr__(self):
        return f"<SavedBlog user_id={self.user_id} post_id={self.post_id}>"

class User(BaseModel, UserMixin):
    id  = db.Column(db.Integer(), primary_key=True, nullable=False)
    username = db.Column(db.String(length=30), nullable=False, unique=True)
    email = db.Column(db.String(length=50), nullable=False, unique=True)
    password_hash = db.Column(db.String(length=100), nullable=False)
    posts = db.relationship("Post", backref="owned_user", lazy=True)
    commentators = db.relationship("Comment", backref="owned_commentator", lazy=True)
    replies = db.relationship("ReplyComment", backref="owned_responder", lazy=True)
    small_replies = db.relationship("ChildReply", backref="who_reply", lazy=True)
    archives = db.relationship("SavedBlog", back_populates="users")
    profile = db.relationship("Profile", back_populates="users", uselist=False)

    @property
    def password(self):
        return self.password

    @password.setter
    def password(self, plain_text_password):
        self.password_hash = bcrypt.generate_password_hash(plain_text_password).decode('utf-8')

    def check_password_correction(self, attempted_password):
        return bcrypt.check_password_hash(self.password_hash, attempted_password)

class Profile(BaseModel):
    id = db.Column(db.Integer(), primary_key=True, nullable=False)
    profile_picture = db.Column(db.String(), nullable=True)
    name = db.Column(db.String(length=50), nullable=False)
    username = db.Column(db.String(length=50), nullable=False)
    bio =  db.Column(db.Text(), nullable=False)
    gmail_links = db.Column(db.String(), nullable=False)
    facebook_links = db.Column(db.String(), nullable=True)
    instagram_links =  db.Column(db.String(), nullable=True)
    x_links = db.Column(db.String(), nullable=True)
    linkedin_links = db.Column(db.String(), nullable=True)
    github_links = db.Column(db.String(), nullable=True)
    users_profile = db.Column(db.Integer(), db.ForeignKey("user.id"))
    owned_posts = db.relationship("Post", backref="blogs", lazy=True)
    users = db.relationship("User", back_populates="profile")

    def __repr__(self):
        return f"Profile {self.id}"

class Post(BaseModel):
    id  = db.Column(db.Integer(), primary_key=True, nullable=False)
    post_image = db.Column(db.String(), nullable=True)
    title = db.Column(db.String(length=50), nullable=False)
    content = db.Column(db.Text(), nullable=False)
    publication_date = db.Column(db.DateTime, default=datetime.utcnow())
    modification_date = db.Column(db.DateTime, default=datetime.utcnow())
    owner = db.Column(db.Integer(), db.ForeignKey("user.id"))
    profile_owner = db.Column(db.Integer(), db.ForeignKey("profile.id"))
    saved_posts = db.relationship("SavedBlog", back_populates="blogs", cascade="all, delete-orphan")
    post_comments = db.relationship("Comment", backref="owned_comments", lazy=True)

    def __repr__(self):
        return f"Post {self.id}"

class Comment(BaseModel):
    id = db.Column(db.Integer(), primary_key=True, nullable=False)
    text = db.Column(db.Text(), nullable=False)
    publication_date = db.Column(db.DateTime, default=datetime.utcnow())
    modification_date = db.Column(db.DateTime, default=datetime.utcnow())
    comment_owner = db.Column(db.Integer(), db.ForeignKey("user.id"))
    comments_on_post = db.Column(db.Integer(), db.ForeignKey("post.id"))
    reply_comments =  db.relationship("ReplyComment", backref="owned_replies", lazy=True)
    def __repr__(self):
        return f"Comment {self.id}"

class ReplyComment(BaseModel):
    __tablename__ = "replycomment"
    id = db.Column(db.Integer(), primary_key=True, nullable=False)
    text = db.Column(db.Text(), nullable=False)
    publication_date = db.Column(db.DateTime, default=datetime.utcnow())
    modification_date = db.Column(db.DateTime, default=datetime.utcnow())
    responder = db.Column(db.Integer(), db.ForeignKey("user.id"))
    reply_comment = db.Column(db.Integer(), db.ForeignKey("comment.id"))
    replies_on_reply = db.relationship("ChildReply", backref="children", lazy=True)
    def __repr__(self):
        return f"ReplyComment {self.id}"

class ChildReply(BaseModel):
    __tablename__ = "childreply"
    id = db.Column(db.Integer(), primary_key=True, nullable=False)
    text = db.Column(db.Text(), nullable=False)
    publication_date = db.Column(db.DateTime, default=datetime.utcnow())
    modification_date = db.Column(db.DateTime, default=datetime.utcnow())
    child_reply_owner = db.Column(db.Integer(), db.ForeignKey("user.id"))
    replies_reply = db.Column(db.Integer(), db.ForeignKey("replycomment.id"))
    def __repr__(self):
        return f"ChildReply {self.id}"
