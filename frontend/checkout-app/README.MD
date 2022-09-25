# Event Portal

The event portal is the part of SocialPass which lets users generate tickets by proving ownership of digital assets, and also lets them download/save the tickets. The current flow is that the event portal is opened up in an iFrame in the event details page in the discovery section of the product.

## Running locally

### Using Docker (Recommended)

You can run the application (along with everything else) using Docker:
https://github.com/nftylabs/socialpass#run-with-docker-and-docker-compose.

### Running manually

If you want to run the app without Docker, follow the steps below. Please note, you need to make sure you have the backend Django application running. You can do this with Docker (as mentioned above), or run it manually (with or without pyenv):
https://github.com/nftylabs/socialpass#run-with-pyenv.

#### Using Yarn

The app uses Vite, which does not work with some older versions of Node and npm. You can use something like nvm (https://github.com/nvm-sh/nvm) to get the required versions. Once that's done, you can run the following commands to start the app:

```
$ yarn install
$ yarn start
```

This should start the application in a local server.

#### Create an event and get the `<public_id>` (Work in progress)

Before being able to access any of the views in the event portal, you must do the following:

- Create an event (using the dashboard or otherwise)
- Make it live (run `event.live()` method from Django shell)
- Get the `<public_id>` from the admin site or Django shell

#### Available routes

Once you have the `<public_id>`, you can start visiting the available routes:

- `http://localhost:3000/<public_id>/event` - event details page
- `http://localhost:3000/<public_id>/checkout/blockchain` - checkout page, also known as the wallet connection page
- `http://localhost:3000/<public_id>/checkout/success` - checkout success page
- `http://localhost:3000/<public_id>/checkout/fail` - checkout fail page
- `http://localhost:3000/<public_id>/error` - generic error page
