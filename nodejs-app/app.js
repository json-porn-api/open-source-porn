'use strict';

const config = require('./config.js');
const log = require('./lib/logging');
const JsonPornAPI = require('./lib/json-porn-api.js');
const express = require('express');

const pornApi = JsonPornAPI({
  apiKey: config.jsonPornApiKey
});

const app = express();

app.use(log.requestLogger);
app.use(log.errorLogger);

app.get('/', (req, res) => {
  res.redirect('https://github.com/json-porn-api/open-source-porn');
});

app.get('/test', (req, res) => {
  var request = pornApi.porn()
    .withActorId(6255412097581056)      // Lexi Belle
    .withGenreId(5245132710346752)      // Blowjob
    .withProducerId(4559871752011776)   // X-Art
    .moviesOnly()
    .limit(1);

  request.get().then(function(porn) {
      res.status(200).send(log.toJsonString(porn)).end();
  }).catch(function(error) {
    res.status(500).send(log.toJsonString(error)).end();
  });
});

// Start the server
const PORT = process.env.PORT || config.serverPort;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
