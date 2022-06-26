# SocialPass CSS Theme

This project implements a CSS theme for the suite of SocialPass products. The theme is meant to be used with Halfmoon 2, which is basically just an alternative to Bootstrap 5 that uses the same class names and markup.

To use this theme, include the following in your template:

```html
<!-- In the <head> tag -->
<link href="path/to/halfmoon.css" rel="stylesheet" />
<link href="path/to/socialpass-theme.css" rel="stylesheet" />

...

<!-- Before closing the <body> tag -->
<script src="path/to/halfmoon.js"></script>
```

As mentioned above, the class names and markup structure is exactly like Bootstrap 5, with some very minor changes. For example, `data-bs-*` attributes need to be replaced with `data-hm-*` ones.

If you have any questions, please reach out to Tahmid over Slack. I will try to add more examples and code to this README to help people get started.