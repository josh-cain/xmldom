'use strict'

const DOMParser = require('../../dom-parser').DOMParser;
const expect = require('chai').expect;

describe('XML Serializer', () => {
  it('text node containing ">"', () => {
    var doc = new DOMParser().parseFromString('<test/>', 'text/xml');
    doc.documentElement.appendChild(doc.createTextNode('hello> there'));
    expect(doc.documentElement.firstChild.toString()).to.equal('hello> there');
  });
  it('text node containing "<]]>"', () => {
    var doc = new DOMParser().parseFromString('<test/>', 'text/xml');
    doc.documentElement.appendChild(doc.createTextNode('<hello ]]> there'));
    expect(doc.documentElement.firstChild.toString()).to.equal('&lt;hello ]]&gt; there');
  })
  it('text node containing "]]>"', () => {
    var doc = new DOMParser().parseFromString('<test/>', 'text/xml');
    doc.documentElement.appendChild(doc.createTextNode('hello ]]> there'));
    expectw(doc.documentElement.firstChild.toString()).to.equal('hello ]]&gt; there');jj
  });
  it('<script> element with no children', () => {
    var doc = new DOMParser({xmlns:{xmlns:'http://www.w3.org/1999/xhtml'}}).parseFromString('<html2><script></script></html2>', 'text/html');
    //console.log(doc.documentElement.firstChild.toString(true))
    expect(doc.documentElement.firstChild.toString()).to.equal('<script></script>');
  });
});
