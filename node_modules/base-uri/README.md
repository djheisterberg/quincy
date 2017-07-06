# [base-uri: Get the base URI of your application](https://el-tramo.be/base-uri)

Returns the base URI where your application is running. This allows you to
create applications that can be deployed at any sub-uri (e.g.
with [Passenger Phusion](https://www.phusionpassenger.com/documentation/Users%20guide%20Nginx.html#deploying_rack_to_sub_uri)), without needing to hard
code the path in your application.

In a **Node** environment, looks at `PASSENGER_BASE_URI` if it is present, and
otherwise defaults to `/`. 

In a **browser** environment, looks at the location of
the executing script, and takes the dirname of this. This assumes that your script
is always located at the top of your application.

## Installation

    npm install base-uri --save


## Usage

### General

    var baseURI = require('base-uri');


### Express

Use the base URI to determine at which point to mount all your routes.

    var app = express();
    var baseURI = require('base-uri');

    // Create all your routes
    var router = express.Router();
    router.get('/', function (req, res) {
        res.send('Hello world');
    });

    // Mount the routes at the base URI
    app.use(baseURI, router);


### Browser

Use the base URI to create internal application links.

    var baseURI = require('base-uri');
    var $ = require('jquery');

    $('body').append('<a href="' + baseURI + '/somewhere">Link</a>');

or with ES6

    import baseURI from 'base-uri';
    import $ from 'jquery';

    $('body').append(`<a href='${baseURI}/somewhere'>Link</a>`));

