/**
 * @module json-porn-api
 */

'use strict';

const http = require('http');
const https = require('https');
const Q = require('Q');
const log = require('./logging');

const HOST_NAME_MASHAPE = 'steppschuh-json-porn-v1.p.mashape.com';
const HOST_NAME_APP_ENGINE = 'winged-octagon-86816.appspot.com';
const HOST_NAME_JSON_PORN = 'json-porn.com';

function JsonPornAPI(options) {
  if (this instanceof JsonPornAPI === false) {
    return new JsonPornAPI(options);
  }
  this.options = options;
  return this;
}

JsonPornAPI.prototype.test = function() {
  console.log("test=" + this.options.test);

  this.getRequest("/porn/?count=1", {
    "key": "value"
  }).then(function(data) {
    log.debug('Success:\n' + log.toJsonString(data));
  }).catch(function(error) {
    log.warn('Error:\n' + log.toJsonString(error));
  });

  return this;
}

JsonPornAPI.prototype.getRequest = function(path, params) {
  var api = this;
  return Q.Promise(function(resolve, reject, notify) {
    // create request options
    const options = api.getDeafaultRequestOptions();
    options.path = path;
    // TODO: add params

    // initiate request
    api.request(options).then(function(responseJson) {
      // check status code
      let statusCode = responseJson.statusCode;
      if (!statusCode || statusCode != 200) {
        // unexpected status code
        throw responseJson;
      }

      // return response content
      resolve(responseJson.content);
    }).catch(function(error) {
      reject(error);
    });
  });
}

JsonPornAPI.prototype.getDeafaultRequestOptions = function() {
  const options = {
    method: 'GET',
    hostname: HOST_NAME_MASHAPE,
    headers: {
      'X-Mashape-Key': this.options.apiKey,
      'Accept': 'application/json'
    }
  };
  return options;
}

JsonPornAPI.prototype.request = function(options) {
  return Q.Promise(function(resolve, reject, notify) {
    log.debug('Sending request with options:\n' + log.toJsonString(options));

    // create request
    const req = https.request(options, (res) => {
      res.setEncoding('utf8');
      var responseData = [];

      // handle new data chunks
      res.on('data', (chunk) => {
        responseData.push(chunk);
      });

      // handle response
      res.on('end', () => {
        log.debug('Response headers:\n' + log.toJsonString(res.headers));
        var responseJson = JSON.parse(responseData.join(''));
        log.debug('Response body:\n' + log.toJsonString(responseJson));
        resolve(responseJson);
      });

    });

    // handle error
    req.on('error', (error) => {
      log.warn('Request error:\n' + log.toJsonString(error));
      reject(error);
    });

    req.end();
  })
}

module.exports = JsonPornAPI;