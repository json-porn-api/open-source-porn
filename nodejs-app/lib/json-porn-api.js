/**
 * @module json-porn-api
 */

'use strict';

function JsonPornAPI(options) {

	if (this instanceof JsonPornAPI === false) {
		return new JsonPornAPI(options);
	}

	this.options = options;

	return this;
}

JsonPornAPI.prototype.test = function() {
	console.log("test=" + this.options.test);
	return this;
}

module.exports = JsonPornAPI;