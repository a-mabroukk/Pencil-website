from pencil import app, db, login_manager
from flask_cors import CORS
from flask import render_template, redirect, url_for, flash, request, abort, jsonify
from werkzeug.utils import secure_filename
from pencil.models import Post, User, Comment, ReplyComment, ChildReply, Profile, Role, load_user
from pencil.forms import RegisterForm, LoginForm, PostForm, SearchForm, CommentForm, ReplyForm, ProfileForm, ReplyReplyForm
from sqlalchemy.orm import joinedload
#from pencil.member_role import create_role_member
from flask_login import login_user, logout_user, login_required, current_user
from datetime import datetime
import os
from flask_cors import CORS, cross_origin
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager

@app.route("/")
@app.route("/home", methods=["GET", "POST"])
# @login_required
@cross_origin()
def home_page():
    search_form = SearchForm()
    search_results = []
    if search_form.input_search.data:
        search_results = Post.query.filter(Post.title.ilike(f"%{search_form.input_search.data}%")).all()
        # If no results found, search by ID
        if not search_results:
            search_results = Post.query.filter(Post.id.ilike(f"%{search_form.input_search.data}%")).all()
        # Flash a message if no results found after both searches
        if not search_results:
            flash("No results found", category="info")
            return jsonify("No results found"), 200
            # return redireact(url_for("home_page", search_results=[]))  # Redirect with empty results

        search_result = [res.to_dict() for res in search_results]

        #search_result = []
        #for res in search_results:
            #search_result.append(res.to_dict())


        return jsonify(search_result)
    posts = Post.query.order_by(Post.title.desc()).limit(20).all()
    #for post in posts:
        #posts_dict.append(post.to_dict())
    posts_dict = [post.to_dict() for post in posts]
    return jsonify(posts_dict)
    # return render_template("home.html", posts=posts, search_form=search_form, search_results=search_results)

@app.route("/publish", methods=["POST", "GET"])
# @login_required
@jwt_required()
@cross_origin()
def posting_page():
    post_form = PostForm()
    user_id = get_jwt_identity()
    # Publishing a post
    #if post_form.validate_on_submit(): # Ensure the form is valid
    if request.method == "POST":
        print("POST request received",post_form.title.data)
        if post_form.title.data:
            try:
                print("Form data:", post_form.title.data, post_form.content.data)
                post_to_create = Post(title=post_form.title.data,
                                    content=post_form.content.data,
                                    owner=user_id)
                db.session.add(post_to_create)
                db.session.commit()
                return jsonify({"message": "The blog has been saved successfully", "category": "success", "post_id":  post_to_create.id}), 201
                #flash(f"The blog has been saved successfully", category="success")
                #return redirect(url_for("blog_page", post_id=post_id))
            except Exception as e:
                db.session.rollback()  # Rollback in case of error
                flash("An error occurred while saving the post. Please try again.", category="danger")
    if post_form.errors != {}:
        for error_message in post_form.errors.values():
            return jsonify(errors=post_form.errors, category="danger"), 400
            #flash(f"There is an error with adding: {error_message}", category="danger")
    return jsonify({"message": "Invalid request."}), 400
    #return render_template("add_post.html", post_form=post_form)

@app.route("/blog", methods=["POST", "GET"])
# @login_required
@jwt_required()
@cross_origin()
def blog_page():
    comment_form = CommentForm()
    reply_form = ReplyForm()
    replies_reply_form = ReplyReplyForm()

    post_id = request.args.get("post_id")
    user_id = get_jwt_identity()

    if post_id:
        requested_blog = Post.query.filter_by(id=post_id).first()
        if requested_blog:
            if request.method == "POST":
                data = request.get_json()
                print("POST request received")
                if 'save' in request.form:
                    print("Save button clicked")
                    if requested_blog in current_user.archives:
                        return jsonify({"message": "Blog is already saved", "category": "info"}), 200
                        #flash("Blog is already saved.", category="info")
                    else:
                        current_user.archives.append(requested_blog)
                        db.session.commit()
                        return jsonify({"message": "Blog saved successfully"}, category="success"), 200
                        #flash(f"The blog is has been saved successfully", category="success")
                        #return redirect(url_for("save_page"))

                if comment_form.comment.data:
                    print("Comment form data:", comment_form.comment.data)
                    comment_to_post = Comment(text=comment_form.comment.data,
                                              comment_owner=user_id,
                                              comments_on_post=requested_blog.id)
                    db.session.add(comment_to_post)
                    db.session.commit()
                    # comment_id = comment_to_post.id
                    return jsonify({"message": "Comment added successfully", "category": "success", "post_id": post_id}), 201

                    #flash(f"Thanks for your comment", category="success")
                    #return redirect(url_for("blog_page", post_id=post_id))
                #if reply_form.validate_on_submit():
                if reply_form.reply.data:
                    comment_id = data.get("comment_id")
                    if comment_id:
                        reply_to_post = ReplyComment(text=reply_form.reply.data, responder=user_id,
                                                     reply_comment=comment_id)
                        db.session.add(reply_to_post)
                        db.session.commit()
                        # reply_id = reply_to_post.id
                        return jsonify({"message": "reply added successfully", "category": "success", "post_id": post_id}), 201
                        #flash(f"Thanks for your comment", category="success")
                        #return redirect(url_for("blog_page", post_id=post_id))
                if  replies_reply_form.reply_reply.data:
                    reply_id = data.get("reply_id")
                    if reply_id:
                        replies_to_reply = ChildReply(text=replies_reply_form.reply_reply.data, child_reply_owner=user_id,
                                                      replies_reply=reply_id)
                        db.session.add(replies_to_reply)
                        db.session.commit()
                        # reply_reply_id = replies_to_reply.id
                        return jsonify({"message": "reply added successfully", "category": "success", "post_id": post_id}), 201
                        #flash(f"Thanks for your comment", category="success")
                        #return redirect(url_for("blog_page", post_id=post_id))
            if request.method == "GET":
                # Display a specific blog with its comments and the replies associated with those comments
                comment_with_replies = (db.session.query(Comment).filter(Comment.comments_on_post == post_id).options(
                                        joinedload(Comment.reply_comments).joinedload(ReplyComment.replies_on_reply))
                                        .order_by(Comment.publication_date.desc()).all())
                comments_response = []
                for comment in comment_with_replies:
                    comment_data = {"id": comment.id, "text": comment.text, "comment_owner": comment.comment_owner, "publication_date": comment.publication_date,
                                    "replies": []}  # This will hold the replies to this comment


                    # Add replies to the comment
                    for reply in comment.reply_comments:
                        reply_data = { "id": reply.id, "text": reply.text, "responder": reply.responder, "publication_date": reply.publication_date,
                                      "replies": []}  # This will hold replies to this reply (if needed)

                    # If you have a structure for replies on replies, you can populate them here
                        for child_reply in reply.replies_on_reply:
                            child_reply_data = {"id": child_reply.id, "text": child_reply.text, "child_reply_owner": child_reply.child_reply_owner,
                                                "publication_date": child_reply.publication_date}
                            reply_data["replies"].append(child_reply_data)

                        comment_data["replies"].append(reply_data)

                    comments_response.append(comment_data)
                return jsonify({"post": {"id": requested_blog.id, "title": requested_blog.title, "content": requested_blog.content,
                                        "publication_date": requested_blog.publication_date}, "comments": comments_response}), 200
                #return render_template("blog.html", post_id=requested_blog, comment_form=comment_form,
                                        #posted_comments=comment_with_replies, reply_form=reply_form, replies_reply_form=replies_reply_form)
            else:
                return jsonify({"message": "Blog not found", "category": "danger"}), 401
                #flash(f"Blog not found", category="danger")
                #return redirect(url_for("home_page"))
    for error_message in reply_form.errors.values():
        flash(f"There was an error : {error_message}", category="danger")
        return jsonify(errors=reply_form.errors), 400
    return redirect(url_for("home_page"))

@app.route("/saved", methods=["GET", "POST"])
@login_required
def save_page():
    items = current_user.archives
    return render_template("saved_items.html", items=items)

@app.route("/modify-comment", methods=["POST", "GET"])
@login_required
def modify_comment():
    # Fetch the comment ID from request arguments
    comment_to_modify = request.args.get("comment_to_modify")
    if comment_to_modify is not None:
        commnts = Comment.query.filter_by(id=comment_to_modify).first()
        print("Comment retrieved:", commnts)  # Debugging print
        # Check if the comment exists
        if commnts is None:
            flash("Comment not found. Please try again.", category="danger")
            return redirect(url_for("blog_page"))

    # Initialize form with existing comment data
    form = CommentForm(obj=commnts)

    if request.method == "POST":
        if form.validate_on_submit():  # Ensure the form is valid
            # Update comment data
            commnts.text = form.comment.data
            commnts.modification_date = datetime.now()
            db.session.commit()
            flash("The comment has been updated successfully.", category='success')
            return redirect(url_for("blog_page", comment_to_modify=commnts.comments_on_post))
        else:
            return render_template("modify_comments.html", form=form, commnts=commnts)

    # Render the template whether or not the comment was found
    return render_template("modify_comments.html", form=form, commnts=commnts)


@app.route("/edit-reply-on-comment", methods=["POST", "GET"])
@login_required
def update_reply():
    # Fetch the comment ID from request arguments
    reply_to_modify = request.args.get("reply_to_modify")
    if reply_to_modify is not None:
        replies = ReplyComment.query.filter_by(id=reply_to_modify).first()
        # Check if the comment exists
        if replies is None:
            flash("Comment not found. Please try again.", category="danger")
            return redirect(url_for("blog_page"))

    # Initialize form with existing comment data
    form = ReplyForm(obj=replies)

    if request.method == "POST":
        if form.validate_on_submit():  # Ensure the form is valid
            # Update comment data
            replies.text = form.reply.data
            replies.modification_date = datetime.now()
            db.session.commit()
            flash("The comment has been updated successfully.", category='success')
            return redirect(url_for("blog_page", reply_to_modify=replies.reply_comment))
        else:
            return render_template("edit_reply_to_comment.html", form=form, replies=replies)

    # Render the template whether or not the comment was found
    return render_template("edit_reply_to_comment.html", form=form, replies=replies)

@app.route("/modify", methods=["POST", "GET"])
#@login_required
@jwt_required()
@cross_origin()
def modify_post():
    post_id = request.args.get("post_id")
    current_user.id = get_jwt_identity()
    if post_id:
        post = Post.query.filter_by(id=post_id).first()
        if not post:
            return jsonify({"message": "Blog not found", "category": "danger"}), 401
            #flash(f"The blog not found", category="danger")
            #return redirect(url_for("home_page"))
        if current_user.id != post.owner:
            return jsonify({"message": "You do not have permission to modify this blog.", "category": "danger"}), 401
            #flash("You do not have permission to modify this blog.", category="danger")
            #return redirect(url_for("blog_page"))
    # Initialize form with existing post data
    form = PostForm(obj=post)

    if request.method == "POST":
        if form.title.data:
        #if form.validate_on_submit(): # Ensure the form is valid
        # Update specific blog if it exists
            post.title = form.title.data
            post.content = form.content.data
            modification_date = datetime.now()
            post.modification_date = modification_date
            db.session.commit()
            return jsonify({"message": "The blog has been updated successfully.", "post_id": post.id, "category": "success"}), 200
            #flash(f"The blog has been updated successfully.", category='success')
            #return redirect(url_for("blog_page", post_id=post.id))
        else:
            # Render the form again with errors
            return jsonify({"message": "Form validation failed", "errors": form.errors}), 400
            #return render_template("modify.html", form=form, post=post)
    return jsonify({"title": post.title, "content": post.content, "publication_date": post.publication_date}), 200
    #return render_template("modify.html", form=form, post=post)

@app.route("/delete", methods=["POST", "GET"])
@login_required
def delete_page():
    # Canceling blog
    current_user.id = get_jwt_identity()
    post_id = request.args.get("post_id")
    if post_id:
        post_to_delete = Post.query.filter_by(id=post_id).first()
        if not post_to_delete:
            return jsonify({"message": "The blog was not found."}), 404
            #flash(f"The blog not found", category="danger")
        elif current_user.id != post_to_delete.owner:
            return jsonify({"message": "You do not have permission to delete this blog."}), 403
            #flash(f"You do not heve permission to delete this blog", category="danger")
            #return redirect(url_for("home_page"))
        else:
            db.session.delete(post_to_delete)
            db.session.commit()
            flash(f"The blog has been removed successfully", category="success")
    return jsonify({"message": "Post ID is required."}), 400
    #return redirect(url_for("home_page"))

@app.route("/delete-comment", methods=["POST", "GET"])
@login_required
def delete_comment():
    comment_id = request.args.get("comment_id")
    if comment_id:
        comment_to_delete = Comment.query.filter_by(id=comment_id).first()
        if not comment_to_delete:
            flash("The comment is no longer available.", category="danger")
            return redirect(url_for("home_page"))

        db.session.delete(comment_to_delete)
        db.session.commit()
        flash(f"The comment has been removed successfully", category="success")
    return redirect(url_for("blog_page", post_id=comment_to_delete.comments_on_post))

@app.route("/delete-reply-comment", methods=["POST", "GET"])
@login_required
def delete_reply():
    reply_id = request.args.get("reply_id")
    if reply_id:
        reply_to_delete = ReplyComment.query.filter_by(id=reply_id).first()
        if not reply_to_delete:
            flash("The comment is no longer available.", category="danger")
            return redirect(url_for("home_page"))

        db.session.delete(reply_to_delete)
        db.session.commit()
        flash(f"The comment has been removed successfully", category="success")
    return redirect(url_for("blog_page", post_id=reply_to_delete.comments_on_post))

@app.route("/profile", methods=["GET"])
#@login_required
@jwt_required()
@cross_origin()
def profile():

    profile_id = request.args.get("profile_id")
    current_user.id = get_jwt_identity()
    if profile_id:
    # Fetch the profile associated with the user
        profile_to_display = Profile.query.filter_by(users_profile=profile_id).first()
        if profile_to_display:
            profile = profile_to_display.to_dict()
            return jsonify({"profile": profile, "category": "success"}), 200
            #return render_template("profile.html", profile_id=profile_to_display)
        else:
            return jsonify({"message": "No profile with this name", "category": "danger"}), 200
        #flash(f"No profile with this name", category="danger")
        #return redirect(url_for("home_page"))
    return jsonify({"message": "No profile with this name", "category": "danger"}), 200
    #return redirect(url_for("home_page"))

@app.route("/update-profile", methods=["POST", "GET"])
#@login_required
@jwt_required()
@cross_origin()
def edit_profile():
    profile_form = ProfileForm()

    profile_id = request.args.get("profile_id")
    current_user.id = get_jwt_identity()
    if profile_id:
        # Fetch the current user's profile if it exists
        profile_to_update = Profile.query.filter_by(id=profile_id, users_profile=current_user.id).first()
        if not profile_to_update:
            print("Profile retrieved:", profile_id)  # Debugging print
            return jsonify({"message": "Blog not found", "category": "danger"}), 401

    profile_form = ProfileForm(obj=profile_to_update)
    print(request.method)
    if request.method == "POST":
        print("POST request received")
        if profile_form.name.data:
        #if profile_form.validate_on_submit():  # Ensure the form is valid
            if 'picture' in request.files:
                file = request.files['picture']
                if file.filename != '':
                    filename = secure_filename(file.filename)
                    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))  # Save the file
                    original_filename, extension = os.path.splitext(file.filename)
                    profile_to_update.profile_picture = f"{original_filename}{extension}"
                    db.session.commit()
            if profile_to_update:
                # Update existing profile
                profile_to_update.name = profile_form.name.data
                profile_to_update.username = profile_form.username.data
                profile_to_update.bio = profile_form.bio.data
                profile_to_update.gmail_links = profile_form.gmail.data
                profile_to_update.facebook_links = profile_form.facebook.data
                profile_to_update.instagram_links = profile_form.instagram.data
                profile_to_update.x_links = profile_form.x.data
                profile_to_update.linkedin_links = profile_form.linkedin.data
                profile_to_update.github_links = profile_form.github.data
                db.session.commit()
                profile = profile_to_update.to_dict()
                return jsonify({"message": "The profile has been updated successfully.", "profile": profile, "category": "success"}), 200
                #flash("Your profile was updated successfully", category="success")
                #return redirect(url_for("profile"))
        # Handle validation errors
        for error_message in profile_form.errors.values():
            flash(f"There was an error updating your profile: {error_message}", category="danger")
            return jsonify(errors=profile_form.errors), 400
    return jsonify({"profile": profile_to_update.to_dict()}), 200
    #return render_template("modify_profile.html", form=profile_form, profile_to_update=profile_to_update)

# @app.route("/delete/<id>", methods=["POST"])
# @login_required
# def delete_page(id):
    # Canceling blog
    # post = Post.query.filter_by(id=id).first()
    # if not post:
        # flash(f"The blog not found", category="danger")
    # elif current_user.id != post.owner:
        # flash(f"You do not heve permission to delete this blog", category="danger")
        # return redirect(url_for("home_page"))
    # else:
        # db.session.delete(post)
        # db.session.commit()
        # flash(f"The blog has been removed successfully", category="success")
    # return redirect(url_for("home_page"))

@app.route("/register", methods=["GET", "POST"])
def register_page():
    form = RegisterForm()
    profile_form = ProfileForm()

    if request.method == "POST":
        if form.email_address.data:
            print("Form data:", form.username.data, form.email_address.data, form.password1.data)
            #user_to_create = User.query.filter_by(email=request.form.email_address).first()
            # if user already exists render the message
            #if user_to_create:
                #flash(f"The email address provided is already in use", category="danger")
                # render signup.html if user exists
                #return render_template('register.html')
            user_to_create = User(username=form.username.data,
                                  email=form.email_address.data,
                                  password=form.password1.data)
            # Create a new profile if one does not exist
            profile_to_update = Profile(users=user_to_create, name=form.username.data, username=form.username.data , gmail_links=form.email_address.data, bio = "This is a bio")
            db.session.add(user_to_create)
            db.session.add(profile_to_update)

            db.session.commit()
            login_user(user_to_create)
            access_token = create_access_token(identity=user_to_create.id)
            #flash(f"Account created successfully! You are now logged in as {user_to_create.username}", category='success')
            #return redirect(url_for("home_page"))
            return jsonify(message=f"Account created for {user_to_create.username}!"), 201
        if form.errors != {}:
            for error_message in form.errors.values():
                flash(f"There is an error with registing: {error_message}", category="danger")
                return jsonify(errors=form.errors), 400
    return jsonify({"id": user_to_create.id, "username": user_to_create.username})
    #return render_template("register.html", form=form)

@app.route("/login", methods=["POST", "GET"])
def login_page():
    form = LoginForm()
    print("Form data:", form.username.data, form.password.data)
    #if form.validate_on_submit():
    attempted_user = User.query.filter_by(username=form.username.data).first()
    if attempted_user and attempted_user.check_password_correction(attempted_password=form.password.data):
        login_user(attempted_user)
        access_token = create_access_token(identity=attempted_user.id)

        return jsonify({"message": "Success! You are logged in.", "access_token": access_token}), 200
        #flash(f"Success! You are logged in as: {attempted_user.username}", category="success")
        #return redirect(url_for("home_page"))
    else:
        return jsonify({"message": "Username or password are not correct! Please try again"}), 401
        #flash('Username or password are not correct! Please try again', category='danger')
    #return render_template("login.html", form=form)
    #return jsonify({"id": attempted_user.id, "email": attempted_user.email})

@app.route("/logout")
def logout_page():
    logout_user()
    flash("You have been logged out!", category='info')
    return redirect(url_for("home_page"))



jwt = JWTManager(app)

# When JWT is missing
@jwt.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({"message": "Missing or invalid token. Please log in.", "redirect": "/login"}), 401

# When JWT has expired
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({"message": "Token has expired. Please log in again.", "redirect": "/login"}), 401