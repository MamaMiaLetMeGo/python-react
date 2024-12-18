from setuptools import setup, find_packages

setup(
    name="fullstack",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        'flask',
        'flask-sqlalchemy',
        'flask-migrate',
        'flask-cors',
        'psycopg2-binary',
        'python-dotenv',
    ],
)
