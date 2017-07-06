/* eslint global-require: 0, no-console: 0 */

'use strict';

function getBaseURI() {
	if (typeof document !== 'undefined') {
		// Browser
		var url = require('url');
		var scriptEls = document.getElementsByTagName('script'); // eslint-disable-line no-undef
		var lastScript = scriptEls[scriptEls.length-1];
		var baseURI = lastScript.getAttribute("data-base-uri");
		if (baseURI) {
			return baseURI;
		}
		var scriptPath = url.parse(lastScript.src).pathname;
		return scriptPath.substring(0, scriptPath.lastIndexOf('/')); 
	}
	else if (typeof process === 'object' && process.env) {
		// Node
		return process.env.PASSENGER_BASE_URI || '';
	}
	else {
		console.error('Unable to get base URI of application');
		return undefined;
	}
}

module.exports = getBaseURI();
