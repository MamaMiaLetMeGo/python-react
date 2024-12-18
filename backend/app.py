from flask import Blueprint, jsonify, request
from datetime import datetime
import logging
from backend import db
from backend.models import Post

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

bp = Blueprint('main', __name__)

# Temporary storage for blog posts (will be replaced with database)
blog_posts = [
    {
        "id": 1,
        "title": "Welcome to My Blog",
        "content": "This is my first blog post! I'm excited to share my thoughts.",
        "date": "2024-12-18",
        "author": "Charles"
    }
]

@bp.route('/api/posts', methods=['GET'])
def get_posts():
    logger.info('Received GET request for posts')
    posts = Post.query.all()
    return jsonify([post.to_dict() for post in posts])

@bp.route('/api/posts', methods=['POST'])
def create_post():
    logger.info('Received POST request with data: %s', request.data)
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'content', 'author']
        for field in required_fields:
            if field not in data:
                logger.error(f'Missing required field: {field}')
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Create new post
        new_post = Post(
            title=data['title'],
            content=data['content'],
            author=data['author']
        )
        
        # Add to database
        db.session.add(new_post)
        db.session.commit()
        
        logger.info('Successfully created new post: %s', new_post.to_dict())
        return jsonify(new_post.to_dict()), 201
    
    except Exception as e:
        logger.error(f"Error creating post: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to create post'}), 500

@bp.route('/api/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = Post.query.get_or_404(post_id)
    return jsonify(post.to_dict())

if __name__ == '__main__':
    from app import app
    app.register_blueprint(bp)
    app.run(debug=True, port=5000)