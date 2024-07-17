# config/gunicorn.py
#
# Server Socket
bind = f'unix:/var/www/socialpass/socialpass.sock'

# Worker Processes
workers = 2

# Worker Class
worker_class = 'sync'

# Logging
accesslog = '-'
errorlog = '-'
loglevel = 'info'

# Application Import
wsgi_app = 'config.wsgi:application'

# Timeout
timeout = 30

# Keep-Alive
keepalive = 2
