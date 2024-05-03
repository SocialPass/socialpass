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

---

### Optional: Apple Wallet (for tickets)

> [!NOTE]
> If you don't want Apple Wallet support, you can safely ignore this section. In that case, the ticket page will not have a "Save to Apple Wallet" button.

In order to set up Apple Wallet tickets, you need pass ID, a valid certificate, and a `key.pem` file. Please read the following instructions to get started: https://github.com/SocialPass/passbook/?tab=readme-ov-file#getting-started

Once you have your credentials, set the following environment variables:

```
APPLE_WALLET_CERTIFICATE=
APPLE_WALLET_PASSWORD=
APPLE_WALLET_PASS_TYPE_ID=
APPLE_WALLET_TEAM_ID=
```

---

### Optional: Google Wallet (for tickets)

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

---

### Optional: Google oAuth (for logins and sign ups)

We allow organizers to sign up via their Google accounts. Please read the following to get started: https://docs.allauth.org/en/latest/socialaccount/providers/google.html. Once you have set up your Google project to handle logins and sign ups, you need to set up the `client_id` and `secret` as environment variables:

```
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
```

**Please note**, this is totally optional. If you want to turn off logins and sign ups via Google accounts, go to `config/settings/base.py` and remove the `google` key from the `SOCIALACCOUNT_PROVIDERS` dictionary:

```python
...

SOCIALACCOUNT_PROVIDERS = {}

...
```

---

### Google Maps (for address autocomplete)

We use the Google Places API to support autocomplete for addresses on event forms. In order to integrate this, please read this guide: https://developers.google.com/maps/documentation/places/web-service/get-api-key. Once you have the key, set it as an environment variable:

```
GOOGLE_MAPS_API_KEY=
```

---

### Moralis (for NFT-gated tickets)

We use Moralis to handle NFT verification for NFT-gated tickets. Sign up for Moralis and [get your API key](https://docs.moralis.io/2.0/web3-data-api/evm/get-your-api-key), and set that as an environment variable:

> [!NOTE]  
> If you don't want to support NFT-gated tickets, then this can be safely ignored. Although, creating NFT-gated ticket tiers from the dashboard would cause problems as there would be no way to verify them.

```
MORALIS_API_KEY=
```

---

### Rollbar (for logging)

We use Rollbar for logging errors and warnings. Sign up for Rollbar and [get your access token](https://docs.rollbar.com/reference/getting-started-1#project-access-tokens), and set that as an environment variable:

```
ROLLBAR_ACCESS_TOKEN=
```

---

### Stripe (for payments)

As of right now, SocialPass *only* supports Stripe Connect, which means that there is one primary account (SocialPass for instance), and each organizer "connects" their secondary account (via the organizer dashboard). This is the ideal choice in regards to our business model. This may change in the future (with more options), but for now, please keep this in mind.

Please read the Stripe Connect docs for a better undestanding (and getting started): https://docs.stripe.com/connect.

Once you have set up your primary account, you only need the API key as an environment variable:

```
STRIPE_API_KEY=
```

## Whitelabeling

SocialPass supports team-wide whitelabeling. For reference, a team = one organizer. This means that organizers can have their event pages be branded with the proper colors, fonts, and logos. Only the checkout app (customer facing) is affected by the whitelabeling, although we do have plans to expand this to the full scope of the project.

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
- **Logo**: This logo file will be used on the website header (png recommended)
- **Ticket logo**: Used on PNG tickets (svg recommended)
- **Ticket logo google**: Used on Google Wallet tickets (Must be link to an image, jpg/png/gif, png recommended)
- **Ticket logo apple**: Used on Apple Wallet tickets (png recommended)
- **Favicon**: Icon for the website tab (png or svg recommended)
- **Css**: This CSS will override the default styles. You only need to override the CSS variables because we use Halfmoon for our project. Please see https://github.com/halfmoonui/halfmoon/blob/master/css/halfmoon.css to get a better idea. In general, we recommend overriding the `--bs-primary-*` and `--bs-info-*` variables to theme out your website. Here's an example that sets both context colors to different shades of blue:

```CSS
:root,
[data-bs-theme=light] {
	/* Primary */

	--bs-primary-hue: var(--bs-blue-hue);
	--bs-primary-saturation: var(--bs-blue-saturation);
	--bs-primary-100-hsl: var(--bs-blue-100-hsl);
	--bs-primary-200-hsl: var(--bs-blue-200-hsl);
	--bs-primary-300-hsl: var(--bs-blue-300-hsl);
	--bs-primary-400-hsl: var(--bs-blue-400-hsl);
	--bs-primary-500-hsl: var(--bs-blue-500-hsl);
	--bs-primary-600-hsl: var(--bs-blue-600-hsl);
	--bs-primary-700-hsl: var(--bs-blue-700-hsl);
	--bs-primary-800-hsl: var(--bs-blue-800-hsl);
	--bs-primary-900-hsl: var(--bs-blue-900-hsl);
	--bs-primary-100: var(--bs-blue-100);
	--bs-primary-200: var(--bs-blue-200);
	--bs-primary-300: var(--bs-blue-300);
	--bs-primary-400: var(--bs-blue-400);
	--bs-primary-500: var(--bs-blue-500);
	--bs-primary-600: var(--bs-blue-600);
	--bs-primary-700: var(--bs-blue-700);
	--bs-primary-800: var(--bs-blue-800);
	--bs-primary-900: var(--bs-blue-900);
	--bs-primary-hsl: var(--bs-blue-hsl);
	--bs-primary: var(--bs-blue);
	--bs-primary-foreground-hsl: var(--bs-blue-foreground-hsl);
	--bs-primary-foreground: var(--bs-blue-foreground);
	--bs-primary-text-emphasis-hsl: var(--bs-blue-text-emphasis-hsl);
	--bs-primary-text-emphasis: var(--bs-blue-text-emphasis);
	--bs-primary-hover-bg: var(--bs-blue-hover-bg);
	--bs-primary-active-bg: var(--bs-blue-active-bg);
	--bs-primary-bg-subtle: var(--bs-blue-bg-subtle);
	--bs-primary-border-subtle: var(--bs-blue-border-subtle);
	--bs-primary-checkbox-svg: var(--bs-blue-checkbox-svg);
	--bs-primary-dash-svg: var(--bs-blue-dash-svg);
	--bs-primary-radio-svg: var(--bs-blue-radio-svg);
	--bs-primary-switch-svg: var(--bs-blue-switch-svg);

	/* Info */

	--bs-info-hue: var(--bs-sky-hue);
	--bs-info-saturation: var(--bs-sky-saturation);
	--bs-info-100-hsl: var(--bs-sky-100-hsl);
	--bs-info-200-hsl: var(--bs-sky-200-hsl);
	--bs-info-300-hsl: var(--bs-sky-300-hsl);
	--bs-info-400-hsl: var(--bs-sky-400-hsl);
	--bs-info-500-hsl: var(--bs-sky-500-hsl);
	--bs-info-600-hsl: var(--bs-sky-600-hsl);
	--bs-info-700-hsl: var(--bs-sky-700-hsl);
	--bs-info-800-hsl: var(--bs-sky-800-hsl);
	--bs-info-900-hsl: var(--bs-sky-900-hsl);
	--bs-info-100: var(--bs-sky-100);
	--bs-info-200: var(--bs-sky-200);
	--bs-info-300: var(--bs-sky-300);
	--bs-info-400: var(--bs-sky-400);
	--bs-info-500: var(--bs-sky-500);
	--bs-info-600: var(--bs-sky-600);
	--bs-info-700: var(--bs-sky-700);
	--bs-info-800: var(--bs-sky-800);
	--bs-info-900: var(--bs-sky-900);
	--bs-info-hsl: var(--bs-sky-hsl);
	--bs-info: var(--bs-sky);
	--bs-info-foreground-hsl: var(--bs-sky-foreground-hsl);
	--bs-info-foreground: var(--bs-sky-foreground);
	--bs-info-text-emphasis-hsl: var(--bs-sky-text-emphasis-hsl);
	--bs-info-text-emphasis: var(--bs-sky-text-emphasis);
	--bs-info-hover-bg: var(--bs-sky-hover-bg);
	--bs-info-active-bg: var(--bs-sky-active-bg);
	--bs-info-bg-subtle: var(--bs-sky-bg-subtle);
	--bs-info-border-subtle: var(--bs-sky-border-subtle);
	--bs-info-checkbox-svg: var(--bs-sky-checkbox-svg);
	--bs-info-dash-svg: var(--bs-sky-dash-svg);
	--bs-info-radio-svg: var(--bs-sky-radio-svg);
	--bs-info-switch-svg: var(--bs-sky-switch-svg);
}

[data-bs-theme=dark] {
	/* Primary */

	--bs-primary-text-emphasis-hsl: var(--bs-blue-text-emphasis-hsl);
	--bs-primary-text-emphasis: var(--bs-blue-text-emphasis);
	--bs-primary-bg-subtle: var(--bs-blue-bg-subtle);
	--bs-primary-border-subtle: var(--bs-blue-border-subtle);

	/* Info */

	--bs-info-text-emphasis-hsl: var(--bs-sky-text-emphasis-hsl);
	--bs-info-text-emphasis: var(--bs-sky-text-emphasis);
	--bs-info-bg-subtle: var(--bs-sky-bg-subtle);
	--bs-info-border-subtle: var(--bs-sky-border-subtle);
}
```

- **Font regular**: Font file to use on website (otf recommended)
- **Font bold**: Bold version of the font file to use on website (otf recommended)
- **Ticket bg color**: Background color of tickets (hex code recommended)
- **Ticket text color**: Text color on tickets (hex code recommended)

Once you have created your whitelabel object, go to `/admin/root/team/` or `/<DJANGO_ADMIN_URL>/root/team/` and find the team you want to apply this to. Click on the team to open the details/form page. On this form, set the **Whitelabel** field to the whitelabel object you just created. And that's it!
