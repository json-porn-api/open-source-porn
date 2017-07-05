/**
 * @module json-porn-api
 */

'use strict';

const http = require('http');
const https = require('https');
const querystring = require('querystring')
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

/**
 * Creates the base request object that every endpoint uses.
 */
JsonPornAPI.prototype.createRequest = function() {
  const api = this;
  const request = {};

  request.path = "";
  request.queryParams = {};

  request.setPath = function(path) {
    this.path = path;
    return this;
  }

  request.setQueryParam = function(key, value) {
    this.queryParams[key] = value;
    return this;
  }

  request.limit = function(count) {
    return this.setQueryParam("count", count);
  }

  request.offset = function(offset) {
    return this.setQueryParam("offset", offset);
  }

  request.get = function() {
    return api.getRequest(request.path, request.queryParams);
  }

  return request;
}

/**
 * Creates a request object for the porn endpoint.
 */
JsonPornAPI.prototype.porn = function() {
  var request = this.createRequest().setPath("/porn/");

  request.withId = function(id) {
    return this.setQueryParam("pornId", id);
  }

  request.withProducerId = function(id) {
    return this.setQueryParam("producerId", id);
  }

  request.withGenreId = function(id) {
    return this.setQueryParam("genreId", id);
  }

  request.withActorId = function(id) {
    return this.setQueryParam("actorId", id);
  }

  request.includeDownloads = function(value) {
    return this.setQueryParam("includeDownloads", value);
  }

  request.includeImages = function(value) {
    return this.setQueryParam("includeImages", value);
  }

  request.withType = function(type) {
    return this.setQueryParam("pornType", type);
  }

  request.clipsOnly = function() {
    return this.withType(2);
  }

  request.moviesOnly = function() {
    return this.withType(4);
  }

  request.imagesOnly = function() {
    return this.withType(3);
  }

  return request;
}

JsonPornAPI.prototype.getRequest = function(path, queryParams) {
  const api = this;
  return Q.Promise(function(resolve, reject, notify) {
    // create request options
    const options = api.getDeafaultRequestOptions();
    options.path = path + "?" + querystring.stringify(queryParams);

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