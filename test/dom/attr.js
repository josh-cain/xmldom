'use strict'

const DOMParser = require('../../dom-parser').DOMParser;
const expect = require('chai').expect;

describe('XML attrs', () => {
	it('should set attribute', () => {
    	var root = new DOMParser().parseFromString("<xml/>",'text/xml').documentElement;
    	root.setAttribute('a','1');
    	expect(root.attributes[0].localName).to.equal('a');
    	root.setAttribute('b',2);
    	root.setAttribute('a',1);
    	root.setAttribute('a',1);
    	root.setAttribute('a',1);
		expect(root.attributes.length).to.equal(2);
    	try {
    		var c = root.ownerDocument.createElement('c');
    		c.setAttributeNode(root.attributes.item(0));
    	} catch (e) {
    		expect(e.code).to.equal(10);
    		return;
		}
		// expecting exception.  TODO break out into seperate case
    	expect(false).to.be.true;
    });
    it('should set ns attribute', () => {
    	var root = new DOMParser().parseFromString("<xml xmlns:a='a' xmlns:b='b' xmlns='e'><child/></xml>",'text/xml').documentElement;
    	var child = root.firstChild
    	child.setAttributeNS('a','a:a','1');
    	child.setAttributeNS('b','b:b','2');
		child.setAttributeNS('b','b:a','1');
		expect(child.attributes.length).to.equal(3);
    	child.setAttribute('a',1);
		child.setAttributeNS('b','b:b','2');
		expect(child.attributes.length).to.equal(4);
    	try {
    		var c = root.ownerDocument.createElement('c');
    		c.setAttributeNodeNS(root.attributes.item(0));
    	} catch (e) {
    		expect(e.code).to.equal(10);
    		return;
    	}
		// expecting exception.  TODO break out into seperate case
    	expect(false).to.be.true;
    });
    it('should override attribute', () => {
    	var root = new DOMParser().parseFromString("<xml xmlns:a='a' xmlns:b='b' xmlns='e'><child/></xml>",'text/xml').documentElement;
    	root.setAttributeNS('a','a:a','1');
    	expect(root.attributes.length).to.equal(4);
//not standart
//    	root.firstChild.setAttributeNode(root.attributes[0]);
//    	console.assert(root.attributes.length == 0);
    });
    it('should parse attribute namespace', () => {
    	var root = new DOMParser().parseFromString("<xml xmlns:a='a' xmlns:b='b' a:b='e'></xml>",'text/xml').documentElement;
    	expect(root.getAttributeNS("a", "b")).to.equal("e");
    });
    it("override ns attribute", () => {

    });
    it("set existed attribute", () => {

    });
    it("set document existed attribute", () => {

	});
});
