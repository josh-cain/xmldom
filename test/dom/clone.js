'use strict'

const XMLSerializer = require('../../dom').XMLSerializer;
const DOMParser = require('../../dom-parser').DOMParser;
const expect = require('chai').expect;

describe('Document functions', () => {
	it('clones documents', () => {
		const xmlString = '<doc1 attr1="1" attr2="a2">text1<child>text2</child></doc1>';
		const originalDoc = new DOMParser().parseFromString(xmlString, 'text/xml');
		const clonedDoc = originalDoc.cloneNode(true);
		expect(new XMLSerializer().serializeToString(clonedDoc)).to.equal(xmlString);
	});
	it('imports nodes from other documents', () => {
		const doc1 = new DOMParser().parseFromString("<doc2 attr='2'/>");
		const doc2 = new DOMParser().parseFromString("<doc1 attr1='1' attr2='a2'>text1<child>text2</child></doc1>", 'text/xml');
		const expectedResult = '<doc2 attr="2"><doc1 attr1="1" attr2="a2">text1<child>text2</child></doc1></doc2>'

		const n = doc1.importNode(doc2.documentElement, true);
		doc1.documentElement.appendChild(n);
		expect(new XMLSerializer().serializeToString(doc1)).to.equal(expectedResult);
		expect(new XMLSerializer().serializeToString(doc2)).to.not.equal(expectedResult);
	});
});
