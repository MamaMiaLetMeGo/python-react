from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Temporary storage for blog posts
blog_posts = [
    {
        "id": 1,
        "title": "Welcome to My Blog",
        "content": "This is my first blog post! I'm excited to share my thoughts.",
        "date": "2024-12-18",
        "author": "Charles"
    }
]

@app.route('/api/posts', methods=['GET'])
def get_posts():
    logger.info('Received GET request for posts')
    return jsonify(blog_posts)

@app.route('/api/posts', methods=['POST'])
def create_post():
    logger.info('Received POST request with data: %s', request.data)
    try:
        data = request.json
        if not data:
            logger.error('No JSON data received')
            return jsonify({"error": "No data provided"}), 400
        
        if 'title' not in data or 'content' not in data:
            logger.error('Missing required fields')
            return jsonify({"error": "Title and content are required"}), 400

        new_post = {
            "id": len(blog_posts) + 1,
            "title": data['title'],
            "content": data['content'],
            "date": datetime.now().strftime('%Y-%m-%d'),
            "author": data.get('author', 'Anonymous')
        }
        
        blog_posts.append(new_post)
        logger.info('Successfully created new post: %s', new_post)
        return jsonify(new_post), 201

    except Exception as e:
        logger.error('Error creating post: %s', str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = next((post for post in blog_posts if post['id'] == post_id), None)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    return jsonify(post)

if __name__ == '__main__':
    app.run(debug=True, port=5000)