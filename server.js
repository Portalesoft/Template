const compression = require('compression');
const express = require('express');
const path = require('path');
const app = express();

// Server routes go here ...
app.get('/hello', (req, res) => res.send({ hi: 'there' }));

// Default route processing
if (process.env.NODE_ENV !== 'production') {

    // Development resources not required in production
    const webpackMiddleware = require('webpack-dev-middleware');
    const webpack = require('webpack');
    const webpackConfig = require('./webpack.config.js');
    app.use(webpackMiddleware(webpack(webpackConfig)));

} else {

    // GZIP all assets
    app.use(compression());

    // Make everything inside our dist directory freely available
    app.use(express.static('dist'));

    // If anyone makes any request to any route on our server, send them back the index html file
    // This is specifically required for integration with the react router and browser history module
    app.get('*', (req,res) => {
        res.sendFile(path.join(__dirname, 'dist/index.html'));
    });

}

// AWS and Heroku will not want us to specify a port number but instead to bind to a port set by the server
app.listen(process.env.PORT || 3010, () => console.log('Listening'));