# Use arguments for node and python versions to allow easy updates
ARG NODE_VERSION=18
ARG PYTHON_VERSION=3.11

# Stage 1: Build assets with Node.js
FROM node:$NODE_VERSION as build

# Set the working directory inside the container
WORKDIR /opt/app/

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Install Node.js dependencies
RUN yarn install

# Copy the rest of the application code to the container
COPY . .

# Stage 2: Setup the runtime environment with Python!
FROM python:$PYTHON_VERSION-slim as runtime

# Set the working directory inside the container
WORKDIR /opt/app/

# Update package lists and install necessary packages
RUN apt-get update -y && apt-get install -y curl postgresql-client git

# Set up a virtual environment for Python
ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE="config.settings.production"
RUN python -m venv /opt/venv/

# Install Python dependencies from requirements.txt
COPY config/requirements/production.txt production.txt
COPY config/requirements/base.txt base.txt
RUN pip install --upgrade pip
RUN pip install -r production.txt

# Copy application code to the container, excluding files in .dockerignore
COPY . .
COPY ./.env .

# Copy built assets from the build stage
COPY --from=build /opt/app/static/ ./static/

# Collect static files for the Django application
RUN python manage.py collectstatic --clear --noinput

# Expose the application port
EXPOSE 8000

# Define the command to run the application
CMD ["config/deploy/entry", "web"]