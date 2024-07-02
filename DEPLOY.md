> [!WARNING]
> This document is a work-in-progress.

# Deploying SocialPass
This guide covers deploying SocialPass to production cloud servers.
For configuration of your deployment, please refer to [our self-hosting guide](./SELFHOST.md).

## VPS Deployment (Kamal)
[Kamal](https://kamal-deploy.org) provides a few key benefits for application deployment:
- Can be deployed to any Linux server with SSH access
- Simple to understand. Built around Docker and bash scripts.
- Simple to scale vertically and horizontally
- All-in-one solution. Provides rolling deployments, secret management, logging, and more.

### Step 1: Server Setup
#### A. Setup Server
First off, provision a new VPS. We recommend starting with 1CPU and 2GB of RAM. There is no shortage of providers to choose from, with some of the most popular including:
1. [AWS](https://aws.amazon.com/) (Lightsail or EC2).
2. [Digital Ocean Droplets](https://digitalocean.com/)
3. [Google Cloud](https://cloud.google.com/).
4. [Hetzner](https://www.hetzner.com/).
5. [Linode](https://www.linode.com/).
6. [Microsoft Azure](https://azure.microsoft.com/en-us).

#### B. Setup DNS
Next, setup up your DNS record. Create a new “A” record using whatever tool you use to manage your DNS, and point it at the IP address of the server you created above.

The most common domain to use is www.<yourdomain>.com.

Note: This can be done later in the process, but to avoid waiting for the changes to propagate, we recommend doing this as soon as your server is setup.

#### C. Setup Docker
Although Kamal can install Docker for you, it is recommended that you install Docker yourself, so that Kamal does not need to use the root user account---which can expose your server to more attacks.

You can test if Docker is installed by running `docker -v` on the command line. You should see output like
the following if it is installed correctly.

```
Docker version 24.0.5, build 24.0.5-0ubuntu1~20.04.1
```

If you need to install it, you can find instructions in [Docker's documentation](https://docs.docker.com/engine/install/ubuntu/). You only need to install Docker Engine, not Docker Desktop.


### Step 2: Kamal Setup (Remote Machine)
#### A. Prepare a user account:
Next, create a user for Kamal to use.
You can choose any username you like. In this example we will use `kamal`.
We'll also add this user to the `docker` group so that Kamal can run docker commands.

First login to your server as a user with root access. Then run the following commands:

```shell
sudo adduser kamal --disabled-password
sudo adduser kamal --add_extra_groups docker
```

Next, add your SSH key to the `kamal` user's `authorized_keys` file so you can login without a password.
If you need to generate an SSH key you can [follow these steps](https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-linux-server):

```shell
sudo mkdir -p /home/kamal/.ssh
sudo cp ~/.ssh/authorized_keys /home/kamal/.ssh/authorized_keys
sudo chown -R kamal:kamal /home/kamal/.ssh
```

Next, test the login works. Exit out of your server and on your *local machine* run:

```shell
ssh kamal@<ip-address>
```

If you've set everything up properly the `kamal` user should be able to login with no password.

Once you're logged in, as a final test, ensure the `kamal` user can run docker commands by running:

```shell
docker run hello-world
```

If the command above completes without error you are ready to go!

#### B. Prepare Server for deployment
Next, complete the following steps to get the Docker configuration ready for deployment.
These can be run by the `kamal` user on your remote server.

**Create the Docker Network**

Since we are running the app on a single server we need to use Docker networking to allow the containers to communicate
with each other. This requires a Docker network to be created on the server:

Run the following on your server, replacing `<your_app>` with your app ID/slug:

```shell
docker network create <your_app>-network
```

*Note: If you are running services on separate servers, you can skip this step and update the Kamal deploy configuration
to remove the references to the docker network.*

**Create the LetsEncrypt storage**

This is needed if you want Traefik to automatically generate SSL certificates for you (recommended). If not, you can skip
this step and update the Kamal deploy configuration to remove the references to LetsEncrypt
(search for `letsencrypt` and `secure`).

On your server run the following command *as root*. You may need to logout `kamal` and back in to `root`:

```shell
sudo mkdir -p /letsencrypt && sudo touch /letsencrypt/acme.json && sudo chmod 600 /letsencrypt/acme.json
```

#### C. Prepare Docker Registry
Before doing deployment, you need a place to store your Docker images, also known as a *Docker registry*.
The most popular one is [Docker Hub](https://hub.docker.com/), so we'll use that one, though
you can choose a different one if you want, as described in the [Kamal docs](https://kamal-deploy.org/docs/configuration).

First create an account on [Docker Hub](https://hub.docker.com/) and note your username.

Then create a new repository, choosing a unique name for your app, and marking it "private".

Finally you will need to create an access token. Go to "My Account" --> "Security" and make a new access token,
giving it the default permissions of Read, Write, Delete.
**Save this token somewhere as you will need it in the next step and will only see it once.**


### Step 3: Kamal Local Setup (Local Machine)
#### A. Install Kamal on local machine
If you have a Ruby environment available, you can install Kamal globally with:
`gem install kamal`

Otherwise, you can run a dockerized version via an alias (add this to your ~/.bashrc or similar to simplify re-use).
On MacOS:
`alias kamal='docker run -it --rm -v "${PWD}:/workdir" -v "/run/host-services/ssh-auth.sock:/run/host-services/ssh-auth.sock" -e SSH_AUTH_SOCK="/run/host-services/ssh-auth.sock" -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/basecamp/kamal:latest'`

On Linux:
`alias kamal='docker run -it --rm -v "${PWD}:/workdir" -v "${SSH_AUTH_SOCK}:/ssh-agent" -v /var/run/docker.sock:/var/run/docker.sock -e "SSH_AUTH_SOCK=/ssh-agent" ghcr.io/basecamp/kamal:latest'`


#### B. Setup Environment Variables
Kamal requires a `.env` file in this folder which will contain all the environment variables needed for deployment.
The `.env` file is not checked into source control. See `deploy/.env.kamal` for the required variables.

*Note that this file is distinct from the `.env` file used for development/production variables for your app.*

```bash
cd deploy
cp .env.kamal .env
```

#### C. Setup Kamal Configuration

The Kamal configuration is in `deploy/config/deploy.yml`.
You will need to update the following values:

* Docker image repo: `image: <namespace>/<repository-name>` - this is the repository you created above.
  If you're using Docker Hub, the `namespace` will typically be your username.
* Your server IP address (or hostname) `<IP-ADDRESS>` (this value is listed once per service).
* Your app domain name: `Host(``hostname.example.com``)`. This is the DNS endpoint you set up above.
* Docker registry username: `username: <DOCKER REGISTRY USERNAME>` - the username you chose above.

Additionally, in your `deploy/.env` file you should add the following variables:

* Set `KAMAL_REGISTRY_PASSWORD` to the access token value you created above.
* Choose secure, unique, and ideally random values for `POSTGRES_PASSWORD` and `SECRET_KEY`.
* Update the `DATABASE_URL` value (use the same password as `POSTGRES_PASSWORD`).

You can review other settings in `deploy.yml`, but those should be all that you need to set yourself
to do your first deployment.

### Step 4: Deployment
- Deploy

Finally, we can use Kamal to do the rest of the setup. Run the following on your local machine. The kamal setup command must be run from the deploy directory:

cd deploy/
kamal setup
This will perform all the tasks necessary to deploy your application (duplicated below from the Kamal docs):

- Connect to the servers over SSH
- Log into the registry both locally and remotely
- Build the image using Dockerfile.web in the root of the application.
- Push the image to the registry.
- Pull the image from the registry onto the servers.
- Push the .env file onto the servers.
- Ensure Traefik is running and accepting traffic on port 80.
- Ensure your app responds with 200 OK to GET /up (you must have curl installed inside your app image!).
- Start a new container with the version of the app that matches the current git version hash.
- Stop the old container running the previous version of the app.
- Prune unused images and stopped containers to ensure servers don’t fill up.
- If everything is set up properly then in five or so minutes you should be able to visit your new application at the configured domain. You’re done!

### Step 5: Post Deployment
- Manage changes after initial deployment
- Settings and Secrets
- Running one-off commands
- Configuration
