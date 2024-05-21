> [!WARNING]
> This document is a work-in-progress.

# Self-Hosting SocialPass

In order to self-host SocialPass, you need to mainly do the following:

1. Get the Django app running with a PostgreSQL database
2. Integrate the required and optional 3rd-party APIs
3. Optional: Whitelabel

The instructions for the first step above is described in details in the **README.md**. For the next two steps, please keep reading this document.

## Integrate 3rd-party APIs

The 3rd-party integrations are handled via environment variables stored in the `.envs/` hidden folder. In the following sections, whenever the names of variables are mentioned as being required for that integration, it just means you need to store the values in any or all of the following files (depending on which environment you want to target):

- `.envs/.env.local`
- `.envs/.env.production`
- `.envs/.env.test`

In order to configure the 3rd-party integrations, you can make changes to the `config/settings/integrations.py`. The individual options are discussed in the relevant sections below. More alternatives for each 3rd-party API are coming in the future.

### AWS S3 (for media and file uploads)

By default, SocialPass uses AWS S3 for handling media and file uploads. Please read https://docs.aws.amazon.com/AmazonS3/latest/userguide/GetStartedWithS3.html to get started on AWS S3 by creating your bucket. After that, you need to set up the following environment variables:

```
DJANGO_AWS_ACCESS_KEY_ID=
DJANGO_AWS_S3_REGION_NAME=
DJANGO_AWS_SECRET_ACCESS_KEY=
DJANGO_AWS_STORAGE_BUCKET_NAME=
DJANGO_AWS_S3_ENDPOINT_URL=
```

---

### Mailgun (for email)

> [!NOTE]
> This is not required for local. By default, emails will be printed out in your terminal on local.

Mailgun is the preferred choice for sending emails. Sign up for Mailgun and [get your API key](https://help.mailgun.com/hc/en-us/articles/203380100-Where-can-I-find-my-API-keys-and-SMTP-credentials), and set that as an environment variable:

```
MAILGUN_API_KEY=
```

##### `config/settings/integrations.py`
- **Disable**: Set `emai_provider` to `False`
- **Alternatives**: None yet

---

### Apple Wallet (for tickets)

In order to set up Apple Wallet tickets, you need pass ID, a valid certificate, and a `key.pem` file. Please read the following instructions to get started: https://github.com/SocialPass/passbook/?tab=readme-ov-file#getting-started

Once you have your credentials, set the following environment variables:

```
APPLE_WALLET_CERTIFICATE=
APPLE_WALLET_PASSWORD=
APPLE_WALLET_PASS_TYPE_ID=
APPLE_WALLET_TEAM_ID=
```

##### `config/settings/integrations.py`
- **Disable**: Set `wallet_apple` to `False`

When disabled, the ticket page will not have a "Save to Apple Wallet" button.

---

### Google Wallet (for tickets)

> [!NOTE]
> If you don't want Google Wallet support, you can safely ignore this section. In that case, the ticket page will not have a "Save to Google Wallet" button.

Google Wallet tickets require their own set of credentials. Please read the following instructions to get started: https://developers.google.com/wallet/generic/getting-started/onboarding-guide

Once you have your credentials, set the following environment variables:

```
GOOGLE_WALLET_PRIVATE_KEY_ID=
GOOGLE_WALLET_PRIVATE_KEY=
GOOGLE_WALLET_CLIENT_ID=
GOOGLE_WALLET_ISSUER_ID=
GOOGLE_WALLET_PROJECT_ID=
GOOGLE_WALLET_CLIENT_EMAIL=
GOOGLE_WALLET_CLIENT_CERT_URL=
```

##### `config/settings/integrations.py`
- **Disable**: Set `wallet_google` to `False`

When disabled, the ticket page will not have a "Save to Google Wallet" button.

---

### Google oAuth (for logins and sign ups)

We allow organizers to sign up via their Google accounts. Please read the following to get started: https://docs.allauth.org/en/latest/socialaccount/providers/google.html. Once you have set up your Google project to handle logins and sign ups, you need to set up the `client_id` and `secret` as environment variables:

```
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
```

##### `config/settings/integrations.py`
- **Disable**: Set `oauth_google` to `False`

When disabled, the login and sign up page will not have a button to connect Google accounts.

---

### Google Maps (for address autocomplete)

We use the Google Places API to support autocomplete for addresses on event forms. In order to integrate this, please read this guide: https://developers.google.com/maps/documentation/places/web-service/get-api-key. Once you have the key, set it as an environment variable:

```
GOOGLE_MAPS_API_KEY=
```

##### `config/settings/integrations.py`
- **Disable**: Set `maps_provider` to `False`
- **Alternatives**: None yet

When disabled, the event create and update pages will not have autocomplete support for the address field, and a map will not pop up when an address is entered.

---

### Token verification (for NFT-gated tickets)

We use Moralis to handle NFT verification for NFT-gated tickets. Sign up for Moralis and [get your API key](https://docs.moralis.io/2.0/web3-data-api/evm/get-your-api-key), and set that as an environment variable:

```
MORALIS_API_KEY=
```

##### `config/settings/integrations.py`
- **Disable**: Set `token_verification` to `False`
- **Alternatives**: None yet

When disabled, NFT-gated ticketing will be completely ignored/hidden (on dashboard and checkout app).

---

### Logging (for error reporting)

We use Rollbar for reporting errors and warnings. Sign up for Rollbar and [get your access token](https://docs.rollbar.com/reference/getting-started-1#project-access-tokens), and set that as an environment variable:

```
ROLLBAR_ACCESS_TOKEN=
```

##### `config/settings/integrations.py`
- **Disable**: Set `error_reporting` to `False`
- **Alternatives**: None yet

When disabled, the logging will simply be ignored, so your project will have no logs.

---

### Stripe (for payments)

As of right now, SocialPass *only* supports Stripe Connect, which means that there is one primary account (SocialPass for instance), and each organizer "connects" their secondary account (via the organizer dashboard). This is the ideal choice in regards to our business model. This may change in the future (with more options), but for now, please keep this in mind.

Please read the Stripe Connect docs for a better undestanding (and getting started): https://docs.stripe.com/connect.

Once you have set up your primary account, you only need the API key as an environment variable:

```
STRIPE_API_KEY=
```

##### `config/settings/integrations.py`
- **Disable**: Set `stripe` to `False`
- **Alternatives**: Set `stripe` to `"direct"` for direct payments

When disabled, paid (fiat) ticketing will be completely ignored/hidden (on dashboard and checkout app).

By default, SocialPass uses Stripe Connect. This means that any team that wants to sell paid tickets needs to first link their Stripe account with SocialPass's account. If the alternative to **direct** Stripe payment is used, then this step is ignored. In that case, all transactions will happen via the main SocialPass Stripe account. Learn more about Stripe Connect here: https://docs.stripe.com/connect.

## Whitelabeling

SocialPass supports project-wide AND team-wide whitelabeling. For reference, a team = one organizer.

### How to whitelabel

---

#### Create admin/staff account on Django's admin site

You need to first create an admin account on Django's admin site. The best way to do this is to run the following command on the console (and fill out the details):

```
python manage.py createsuperuser
```

You can also ask your webmaster to do it for you, in case you can't access the console. Staff accounts will also work, but in that case, the permissions must be explicitly set to allow the user to create/change whitelabeling objects.

---

#### Create whitelabeling from the admin site

After you have your credentials, log in to the admin site. On local, this is `/admin`, on staging and production, this is `/<DJANGO_ADMIN_URL>` where the `DJANGO_ADMIN_URL` is an environment variable you set up.

Once inside the admin site, go to `/admin/root/whitelabel/add/` or `/<DJANGO_ADMIN_URL>/root/whitelabel/add/` and fill out the form. Given below are descriptions of each field (and what they do):

- **Brand name**: Name of the organizer/team
- **Logo**: The logo for the brand (png, high quality recommended)
- **Ticket logo (Optional)**: Used on tickets (png, high quality recommended), if not provided, the normal **logo** is used instead
- **Favicon (Optional)**: Icon for the website tab (png recommended), if not provided, the normal **logo** is used instead
- **Primary context (Optional)**: Set to a color from our built-in pallette, no need to override CSS
- **Info context (Optional)**: Set to a color from our built-in pallette, no need to override CSS
- **Css (Optional)**: This CSS will override the default styles. You only need to override the CSS variables because we use Halfmoon for our project. Please see https://github.com/halfmoonui/halfmoon/blob/master/css/halfmoon.css to get a better idea. In general, we recommend using the two context fields above, but this can be used for font imports and usage (from Google fonts for example):

```CSS
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

:root {
	--bs-body-font-family: "Roboto", sans-serif;
}
```

- **Font regular (Optional)**: Font file to use on website (otf recommended)
- **Font bold (Optional)**: Bold version of the font file to use on website (otf recommended)
- **Ticket bg color (Optional)**: Background color of tickets (hex code recommended)
- **Ticket text color (Optional)**: Text color on tickets (hex code recommended)
- **Is global**: If set to true, the whitelabeling will be applied project-wide

**For project-wide whitelabeling**: Set the **Is global** field to true on the whitelabeling form on admin.

**For team-wide whitelabeling**: Once you have created your whitelabel object, go to `/admin/root/team/` or `/<DJANGO_ADMIN_URL>/root/team/` and find the team you want to apply this to. Click on the team to open the details/form page. On this form, set the **Whitelabel** field to the whitelabel object you just created.
