'use strict';

const config = require('./config.js');
const JsonPornAPI = require('./lib/json-porn-api.js');
const express = require('express');

const app = express();
const pornApi = JsonPornAPI({
	apiKey: config.jsonPornApiKey
});

app.get('/', (req, res) => {
    res.redirect('https://github.com/json-porn-api/open-source-porn');
});

app.get('/test', (req, res) => {
	pornApi.test();
    res.status(200).send('Test').end();
});

// Start the server
const PORT = process.env.PORT || config.serverPort;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
