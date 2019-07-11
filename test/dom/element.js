'use strict'

const XMLSerializer = require('../../dom').XMLSerializer;
const DOMParser = require('../../dom-parser').DOMParser;
const expect = require('chai').expect;

describe('XML elements', () => {
    // See: http://jsfiddle.net/bigeasy/ShcXP/1/
    it("Document_getElementsByTagName", () => {
        var doc = new DOMParser().parseFromString('<a><b/></a>');
        expect(doc.getElementsByTagName('*').length).to.equal(2);
        expect(doc.documentElement.getElementsByTagName('*').length).to.equal(1);
    });
    it('getElementsByTagName', () => {
        var doc = new DOMParser().parseFromString('<xml xmlns="http://test.com" xmlns:t="http://test.com" xmlns:t2="http://test2.com">' +
            '<t:test/><test/><t2:test/>' +
            '<child attr="1"><test><child attr="2"/></test></child>' +
            '<child attr="3"/></xml>', 'text/xml');
        var childs = doc.documentElement.getElementsByTagName('child');
        expect(childs.item(0).getAttribute('attr')).to.equal('1');
        expect(childs.item(1).getAttribute('attr')).to.equal('2');
        expect(childs.item(2).getAttribute('attr')).to.equal('3');
        expect((childs.length)).to.equal(3);

        var childs = doc.getElementsByTagName('child');
        expect(childs.item(0).getAttribute('attr')).to.equal('1');
        expect(childs.item(1).getAttribute('attr')).to.equal('2');
        expect(childs.item(2).getAttribute('attr')).to.equal('3');
        expect((childs.length)).to.equal(3);

        var childs = doc.documentElement.getElementsByTagName('*');
        for (var i = 0, buf = []; i < (childs.length); i++) {
            buf.push(childs[i].tagName)
        }
        expect((childs.length)).to.equal(7);

        var feed = new DOMParser().parseFromString('<feed><entry>foo</entry></feed>');
        var entries = feed.documentElement.getElementsByTagName('entry');
        expect(entries.length).to.equal(1);
        expect(entries[0].nodeName).to.equal('entry');
        expect(feed.documentElement.childNodes.item(0).nodeName).to.equal('entry');
    });
    it('getElementsByTagNameNS', () => {
        var doc = new DOMParser().parseFromString('<xml xmlns="http://test.com" xmlns:t="http://test.com" xmlns:t2="http://test2.com">' +
            '<t:test/><test/><t2:test/>' +
            '<child attr="1"><test><child attr="2"/></test></child>' +
            '<child attr="3"/></xml>', 'text/xml');

        var childs = doc.documentElement.getElementsByTagNameNS("http://test.com", '*');
        var i = 0
        expect(childs.length).to.equal(6);

        var childs = doc.getElementsByTagNameNS("http://test.com", '*');
        expect(childs.length).to.equal(7);

        var childs = doc.documentElement.getElementsByTagNameNS("http://test.com", 'test');
        expect(childs.length).to.equal(3);

        var childs = doc.getElementsByTagNameNS("http://test.com", 'test');
        expect(childs.length).to.equal(3);

        var childs = doc.getElementsByTagNameNS("*", "test");
        //console.log([].join.apply(childs,['\n@']))
        expect(childs.length).to.equal(4);

        var childs = doc.documentElement.getElementsByTagNameNS("*", "test");
        //console.log((childs.length))
        expect(childs.length).to.equal(4);
    });
    it('getElementById', () => {
        var doc = new DOMParser().parseFromString('<xml xmlns="http://test.com" id="root">' +
            '<child id="a1" title="1"><child id="a2"  title="2"/></child>' +
            '<child id="a1"   title="3"/></xml>', 'text/xml');
        expect(doc.getElementById('root')).to.be.ok;
        expect(doc.getElementById('a1').getAttribute('title')).to.equal('1');
        expect(doc.getElementById('a2').getAttribute('title')).to.equal('2');
        expect(doc.getElementById('a2').getAttribute('title2')).to.equal('');
    });
    it("append exist child", () => {
        var doc = new DOMParser().parseFromString('<xml xmlns="http://test.com" id="root">' +
            '<child1 id="a1" title="1"><child11 id="a2"  title="2"/></child1>' +
            '<child2 id="a1"   title="3"/><child3 id="a1"   title="3"/></xml>', 'text/xml');

        var doc1 = doc;
        var str1 = new XMLSerializer().serializeToString(doc);
        var doc2 = doc1.cloneNode(true);
        var doc3 = doc1.cloneNode(true);
        var doc4 = doc1.cloneNode(true);

        doc3.documentElement.appendChild(doc3.documentElement.lastChild);
        doc4.documentElement.appendChild(doc4.documentElement.firstChild);

        var str2 = new XMLSerializer().serializeToString(doc2);
        var str3 = new XMLSerializer().serializeToString(doc3);
        var str4 = new XMLSerializer().serializeToString(doc4);
        expect(str1).to.equal(str2);
        expect(str2).to.equal(str3);
        expect(str3).to.not.equal(str4);
        expect(str3.length).to.equal(str4.length);
    });
    it("append exist other child", () => {
        var doc = new DOMParser().parseFromString('<xml xmlns="http://test.com" id="root">' +
            '<child1 id="a1" title="1"><child11 id="a2"  title="2"><child/></child11></child1>' +
            '<child2 id="a1"   title="3"/><child3 id="a1"   title="3"/></xml>', 'text/xml');

        var doc1 = doc;
        var str1 = new XMLSerializer().serializeToString(doc);
        var doc2 = doc1.cloneNode(true);

        expect(doc2.documentElement.lastChild.childNodes.length).to.equal(0);
        doc2.documentElement.appendChild(doc2.documentElement.firstChild.firstChild);

        var str2 = new XMLSerializer().serializeToString(doc2);

        expect(doc2.documentElement.lastChild.childNodes.length).to.equal(1);
        expect(str1).to.not.equal(str2);
        expect(str1.length).to.not.equal(str2.length);
        var doc3 = new DOMParser().parseFromString(str2, 'text/xml');
        doc3.documentElement.firstChild.appendChild(doc3.documentElement.lastChild);
        var str3 = new XMLSerializer().serializeToString(doc3);
        expect(str1).to.equal(str3);
    });
    it("set textContent", () => {
        var doc = new DOMParser().parseFromString('<test><a/><b><c/></b></test>');
        var a = doc.documentElement.firstChild;
        var b = a.nextSibling;
        a.textContent = 'hello';
        expect(doc.documentElement.toString()).to.equal('<test><a>hello</a><b><c/></b></test>');
        b.textContent = 'there';
        expect(doc.documentElement.toString()).to.equal('<test><a>hello</a><b>there</b></test>');
        b.textContent = '';
        expect(doc.documentElement.toString()).to.equal('<test><a>hello</a><b/></test>');
        doc.documentElement.textContent = 'bye';
        expect(doc.documentElement.toString()).to.equal('<test>bye</test>');
    }),
        it("nested append failed", () => {
        });
    it("self append failed", () => {
    });
});
