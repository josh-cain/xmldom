'use strict'

const DOMParser = require('../../dom-parser').DOMParser;
const expect = require('chai').expect;

describe('DOM DocumentFragment', () => {
	// see: http://jsfiddle.net/9Wmh2/1/
	it("append empty fragment", () => {
		var document = new DOMParser().parseFromString('<p id="p"/>');
		var fragment = document.createDocumentFragment();
		document.getElementById("p").insertBefore(fragment, null);
		fragment.appendChild(document.createTextNode("a"));
		document.getElementById("p").insertBefore(fragment, null);
		expect(document.toString()).to.equal('<p id="p">a</p>');
	});
});
