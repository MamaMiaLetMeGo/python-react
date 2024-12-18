from flask import Blueprint, jsonify, request, abort
from flask_login import login_required, login_user, current_user
from .models import db, User, Post, Comment, Category

bp = Blueprint('main', __name__)

# Auth routes
@bp.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

@bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        login_user(user)
        return jsonify({'message': 'Logged in successfully'})
    return jsonify({'error': 'Invalid credentials'}), 401

# Post routes
@bp.route('/api/posts', methods=['GET'])
def get_posts():
    category = request.args.get('category')
    if category:
        posts = Post.query.join(Post.categories).filter(Category.name == category).order_by(Post.created_at.desc()).all()
    else:
        posts = Post.query.order_by(Post.created_at.desc()).all()
    return jsonify([post.to_dict() for post in posts])

@bp.route('/api/posts', methods=['POST'])
@login_required
def create_post():
    data = request.json
    categories = []
    if 'categories' in data:
        for cat_name in data['categories']:
            category = Category.query.filter_by(name=cat_name).first()
            if not category:
                category = Category(name=cat_name)
                db.session.add(category)
            categories.append(category)
    
    new_post = Post(
        title=data['title'],
        content=data['content'],
        user_id=current_user.id,
        categories=categories
    )
    db.session.add(new_post)
    db.session.commit()
    return jsonify(new_post.to_dict()), 201

@bp.route('/api/posts/<int:post_id>', methods=['PUT'])
@login_required
def update_post(post_id):
    post = Post.query.get_or_404(post_id)
    if post.user_id != current_user.id:
        abort(403)
    
    data = request.json
    post.title = data.get('title', post.title)
    post.content = data.get('content', post.content)
    
    if 'categories' in data:
        post.categories = []
        for cat_name in data['categories']:
            category = Category.query.filter_by(name=cat_name).first()
            if not category:
                category = Category(name=cat_name)
                db.session.add(category)
            post.categories.append(category)
    
    db.session.commit()
    return jsonify(post.to_dict())

@bp.route('/api/posts/<int:post_id>', methods=['DELETE'])
@login_required
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    if post.user_id != current_user.id:
        abort(403)
    db.session.delete(post)
    db.session.commit()
    return '', 204

# Comment routes
@bp.route('/api/posts/<int:post_id>/comments', methods=['POST'])
@login_required
def add_comment(post_id):
    post = Post.query.get_or_404(post_id)
    data = request.json
    comment = Comment(
        content=data['content'],
        user_id=current_user.id,
        post_id=post_id
    )
    db.session.add(comment)
    db.session.commit()
    return jsonify({'message': 'Comment added successfully'}), 201
