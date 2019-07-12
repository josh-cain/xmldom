'use strict'

const DOMParser = require('../../dom-parser').DOMParser;
const expect = require('chai').expect;

describe('XML Namespace Parse', () => {
	it("testlitecns", () => {
		var doc = new DOMParser({
			xmlns: { 'c': 'http://www.xidea.org/lite/core', '': 'http://www.w3.org/1999/xhtml' }
		}).parseFromString('<html><body><c:var name="a" value="${1}"/></body></html>', "text/xml");
		//console.log(String(doc))
		var el = doc.getElementsByTagName('c:var')[0];
		// TODO this should actually assert something....
		// console.log(String(el.namespaceURI))
		// console.log(String(doc))
	});
	//ignore default prefix xml attribute
	it("test", () => {
		// TODO fix this assert with real ones
		var assert = assert || {
			equal: function (v1, v2) {
				expect(v1).to.equal(v2);
			}
		}
		// Just for debugging
		var w3 = "http://www.w3.org/1999/xhtml";
		var n1 = "http://www.frankston.com/public";
		var n2 = "http://rmf.vc/n2";
		var n3 = "http://rmf.vc/n3";
		var hx = '<html test="a" xmlns="' + w3 + '" xmlns:rmf="' + n1 + '"><rmf:foo hello="asdfa"/></html>';

		var doc = new DOMParser().parseFromString(hx, "text/xml");
		//console.log(de.prefix,de.getAttributeNode('xmlns').prefix)
		var els = [].slice.call(doc.documentElement.getElementsByTagNameNS(n1, "foo"));
		for (var _i = 0, els_1 = els; _i < els_1.length; _i++) {
			var el = els_1[_i];

			var te = doc.createElementNS(n1, "test");
			te.setAttributeNS(n1, "bar", "valx");
			var te = doc.createElementNS(n1, "test");
			te.setAttributeNS(n1, "bar", "valx");
			//console.log("New Elm: " + ss(te));
			assert.equal(String(te), '<test xmlns="' + n1 + '" bar="valx"/>');
			el.appendChild(te);
			var tx = doc.createElementNS(n2, "test");
			tx.setAttributeNS(n2, "bar", "valx");
			//console.log("New Elm: " + String(tx));
			assert.equal(String(tx), '<test xmlns="' + n2 + '" bar="valx"/>');
			el.appendChild(tx);

			//console.log("Element: " + ss(tx));
		}
		var sr = String(doc);
		//console.log("Serialized: " + sr.replace(/>/g, ">\n  "));

	});
});
