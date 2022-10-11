# Root
As the name implies, `apps/root` sits at the center of the SocialPass application.
This app contains the core database schema and its related migrations, factories for the database schema, shared utility classes, an admin interface and more.

A more detailed breakdown is below.

# `management/`
Contains custom `manage.py` commands.

# `migrations/`
Contains SQL migrations for database schema.

# `utilities/`
Contains shared utility classes / functions

# `admin.py`
Contains the admin interface

# `models.py`
Contains database model class definitions
This codebase follows the 'fat model' approach, so a significant chunk of business logic is also stored here via fields, methods and properties.