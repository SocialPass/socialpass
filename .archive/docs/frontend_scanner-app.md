# Ticket Scanner

The ticket scanner is the part of SocialPass which lets event organizers scan tickets when they are presented by the users at the event location (to grant entry). The current flow is that the scanner is a mobile app that the organizers will download and install on their phones.

## Running locally

### Using Docker (Recommended)

You can run the application (along with everything else) using Docker:
https://github.com/SPTech-Group/socialpass#run-with-docker-and-docker-compose.

### Running manually

If you want to run the app without Docker, follow the steps below. Please note, you need to make sure you have the backend Django application running. You can do this with Docker (as mentioned above), or run it manually (with or without pyenv):
https://github.com/SPTech-Group/socialpass#run-with-pyenv.

#### Using Yarn

The app uses Vite, which does not work with some older versions of Node and npm. You can use something like nvm (https://github.com/nvm-sh/nvm) to get the required versions. Once that's done, you can run the following commands to start the app:

```
$ yarn install
$ yarn start
```

This should start the application in a local server.

### Create an event and ticket redemption key (Work in progress)

Before being able to access any of the views in the ticket scanner, you must do the following:

- Create an event (using the dashboard or otherwise)
- Make it live (run `event.live()` method from Django shell)
- Create a ticket redemption key for this event (from the admin site)
- Get the `<ticket_redemption_key_public_id>` for the key you created (again from the admin site)

### Available routes

Once you have the `<ticket_redemption_key_public_id>`, you can start visiting the available routes:

- `localhost:3001/<ticket_redemption_key_public_id>` - home page
- `localhost:3001/<ticket_redemption_key_public_id>/scanner` - scanner page
- `localhost:3001/<ticket_redemption_key_public_id>/statistics` - statistics page
