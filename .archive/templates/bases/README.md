The `base_primary.html` is going to be used as a base for the main dashboard pages, such as the events list, event create form, team edit, etc. It has the typical sidebar one would expect from a dashboard.

The `base_secondary.html` is used as a base for supporting pages. These include login, sign up, the error pages, etc.

Both bases extend from the `base.html` file, which contains all of the necessary setup in the `<head>` and `<body>` tags, making for easy inheritance and maintenance.