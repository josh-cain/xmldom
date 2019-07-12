'use strict';

const DOMParser = require('../../dom-parser').DOMParser;
const expect = require('chai').expect;

describe('XML Namespace Parse', () => {
    it('default namespace', () => {
       var dom = new DOMParser().parseFromString('<xml xmlns="http://test.com"><child attr="1"/></xml>','text/xml');
       var root = dom.documentElement;
       expect(root.namespaceURI).to.equal('http://test.com')
       expect(root.lookupNamespaceURI('')).to.equal( 'http://test.com')
       expect(root.firstChild.namespaceURI).to.equal('http://test.com')
       expect(root.firstChild.lookupNamespaceURI('')).to.equal( 'http://test.com')
       expect(root.firstChild.getAttributeNode('attr').namespaceURI).to.equal(null)
    });
    it('prefix namespace', () => {
       var dom = new DOMParser().parseFromString('<xml xmlns:p1="http://p1.com" xmlns:p2="http://p2.com"><p1:child a="1" p1:attr="1" b="2"/><p2:child/></xml>','text/xml');
       var root = dom.documentElement;
       expect(root.firstChild.namespaceURI).to.equal( 'http://p1.com')
       expect(root.lookupNamespaceURI('p1')).to.equal( 'http://p1.com')
       expect(root.firstChild.getAttributeNode('attr')).to.equal( null)
       expect(root.firstChild.getAttributeNode('p1:attr').namespaceURI).to.equal( 'http://p1.com')
       expect(root.firstChild.nextSibling.namespaceURI).to.equal( 'http://p2.com')
       expect(root.firstChild.nextSibling.lookupNamespaceURI('p2')).to.equal( 'http://p2.com')
    });
    it('after prefix namespace', () => {
       var dom = new DOMParser().parseFromString('<xml xmlns:p="http://test.com"><p:child xmlns:p="http://p.com"/><p:child/></xml>','text/xml');
       var root = dom.documentElement;
       expect(root.firstChild.namespaceURI).to.equal('http://p.com')
       expect(root.lastChild.namespaceURI).to.equal('http://test.com')
       expect(root.firstChild.nextSibling.lookupNamespaceURI('p')).to.equal( 'http://test.com')
    });
});
