MobilePages
===========

A page switching framework for your Phonegap app. MobilePages is intended to help you simplify the process of building a single-page app.

##Installation

- Download and include the file in your `index.html`.
- Add a `div` with an id of "pages" in your html file.

```
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0" />
        <title>My Mobile App</title>
        <link rel="stylesheet" type="text/css" href="assets/css/app.css">
    </head>
    <body>
    
        <div id="pages" class="no-menu"></div>
        
        <!-- JS files here -->
        <script src="cordova.js"></script>
        <script src="assets/js/lib/MobilePages.js"></script>
    </body>
</html>

```
Dependencies: none.
