'use strict';

const DOMParser = require('../../dom-parser').DOMParser;
const XMLSerializer = require('../../dom').XMLSerializer;
const expect = require('chai').expect;

describe('errorHandle', () => {
	it('unclosed tag', () => {
		console.log(new DOMParser().parseFromString('<foo')+'');
	});
	it('document source', () => {
		var testSource = '<?xml version="1.0"?>\n<!--test-->\n<xml/>';
		var dom = new DOMParser().parseFromString(testSource,'text/xml');
		expect(new XMLSerializer().serializeToString(dom)).to.equal(testSource);
	});
	it('test', () => {
		var description = "<p>populaciji (< 0.1%), te se</p>";
		var doc = new DOMParser().parseFromString(description, 'text/html');
		//console.log(doc.toString())
	});
});
