import os

workers = int(os.environ.get('GUNICORN_PROCESSES', '3'))
threads = int(os.environ.get('GUNICORN_THREADS', '1'))

forwarded_allow_ips = '*'
secure_scheme_headers = { 'X-Forwarded-Proto': 'https' }

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or "secret_string"
    CORS_HEADERS = 'Content-Type'
