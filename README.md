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

## How to add pages

### The basics

- Add a directory for templates called "pages" at the root of your app.
- Add html files in the pages directory.
- Link to the pages with normal links: `<a href="#mypage">A page in my app</a>`
- (Optional) Add code to the pages... covered below

### The anatomy of a `MobilePage` object

MobilePages has a very simple api. You can add code to the page object held in the framework and that code will run when the page is loaded. First, you will need to create the page object itself. To do this, simply call the `page` method:

```
MobilePages.page('mypage');
```

If the framework has the page object of that name, it will retrieve it and return the page object. Otherwise, a new page object is created. 

#### MobilePages.page([string])

If a name is passed, the framework retrieves or creates the page object. If nothing is passed to `.page` the current page is returned.

Every page object inherits from a base prototype object and has the following default properties:

#### name

A `string` representing the name of the object used to retrieve it when calling `MobilePages.page(nameOfObject)`. The template page must be named the same (i.e. `name.html`).

Example usage:

```js
var currentPageName = MobilePages.page().name
```

#### go()

Action: Change the page to this page.
Return: The page object. Enables method chaining.

*If an `init` function has been defined on the page object, it will be called by the framework*

Example usage:

```js
MobilePages.page('home').go(); //the framework will load the 'home' template and run the init function if it exists
```

#### addProperty(string[, object|function|array|primitive])

Parameters: name, optional property (`undefined` if not present)
Action: Define a property on teh page object by the given name
Return: The page object. Enables method chaining.

Example usage:

```js
MobilePages.page('home')
    .addProperty(
        'init',
        function() {
            // take some setup action
            // reference to this works
            console.log(this) // works as expected/refers to the object itself
            this.dataLoader(); // the property is added before init is called
        })
    .addProperty(
        'dataLoader',
        function() {
            // we can chain these together
            // referencing this works here
            this.someValue = 'some value';
        })
    .go(); // let's go to the page
```

#### unregister()

Action: Removes the page object from the framework.
Return: None

The object will no longer be referenced by the framework. This can be useful if you want to allow the GC to clean up the object in case you don't need it anymore.

Example usage:
```js
MobilePages.page('home').unregister(); // the page can no longer be referenced.
```

### template

A `string` used to cache the html of the template page to keep from having to get the page every time you want to go to it.
