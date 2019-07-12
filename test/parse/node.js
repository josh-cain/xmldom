'use strict';

const XMLSerializer = require('../../dom').XMLSerializer;
const DOMParser = require('../../dom-parser').DOMParser;
const expect = require('chai').expect;
var parser = new DOMParser();

describe('XML Node Parse', () => {
  it('element', () => {
    var dom = new DOMParser().parseFromString('<xml><child/></xml>');
    expect(dom.childNodes.length).to.equal(1);
    expect(dom.documentElement.childNodes.length).to.equal(1);
    expect(dom.documentElement.tagName).to.equal('xml');
    expect(dom.documentElement.firstChild.tagName).to.equal('child');
  });
  it('text', () => {
    var dom = new DOMParser().parseFromString('<xml>start center end</xml>');
    var root = dom.documentElement;
    expect(root.firstChild.data).to.equal('start center end');
    expect(root.firstChild.nextSibling).to.be.null;
  });
  it('cdata', () => {
    var dom = new DOMParser().parseFromString('<xml>start <![CDATA[<encoded>]]> end<![CDATA[[[[[[[[[]]]]]]]]]]></xml>');
    var root = dom.documentElement;
    expect(root.firstChild.data).to.equal('start ');
    expect(root.firstChild.nextSibling.data).to.equal('<encoded>');
    expect(root.firstChild.nextSibling.nextSibling.nextSibling.data).to.equal('[[[[[[[[]]]]]]]]');
  });
  it('cdata empty', () => {
    var dom = new DOMParser().parseFromString('<xml><![CDATA[]]>start <![CDATA[]]> end</xml>');
    var root = dom.documentElement;
    expect(root.textContent).to.equal('start  end');
  });
  it('comment', () => {
    var dom = new DOMParser().parseFromString('<xml><!-- comment&>< --></xml>');
    var root = dom.documentElement;
    expect(root.firstChild.nodeValue).to.equal(' comment&>< ');
  });
  it('cdata comment', () => {
    var dom = new DOMParser().parseFromString('<xml>start <![CDATA[<encoded>]]> <!-- comment -->end</xml>');
    var root = dom.documentElement;
    expect(root.firstChild.nodeValue).to.equal('start ');
    expect(root.firstChild.nextSibling.nodeValue).to.equal('<encoded>');
    expect(root.firstChild.nextSibling.nextSibling.nextSibling.nodeValue).to.equal(' comment ');
    expect(root.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nodeValue).to.equal('end');
  });
  it('text node with no character entities', () => {
    var dom = new DOMParser().parseFromString('<xml>test value</xml>');
    var root = dom.documentElement;
    expect(root.firstChild.textContent).to.equal('test value');
  });
  /** 
   * These tests were added to confirm a change that removed logic which was
   * inappropriately converting pairs of Unicode code point character entities
   * into a single value.
   * 
   * This appears to be against the XML 1.0 specification "Section 4.1:
   * Character and Entity References":
   * 
   * > If the character reference begins with " &#x ", the digits and letters
   * > up to the terminating ; provide a hexadecimal representation of the
   * > character's code point in ISO/IEC 10646. If it begins just with " &# ",
   * > the digits up to the terminating ; provide a decimal representation of
   * > the character's code point.
   * 
   * {@link https://www.w3.org/TR/xml/#sec-references}
   */
  it('text node with two one-byte character entities', () => {
    var dom = new DOMParser().parseFromString('<xml>&lt;inner&gt;&lt;/inner&gt;</xml>');
    var root = dom.documentElement;
    expect(root.firstChild.textContent).to.equal('<inner></inner>');
  });
  it('text node with a two-byte character entity', () => {
    var dom = new DOMParser().parseFromString('<xml>f&#xC3;&#xBC;n</xml>');
    var root = dom.documentElement;
    expect(root.firstChild.textContent).to.equal('fÃ¼n');
  });
  it('text node with a single two-byte character entity', () => {
    var dom = new DOMParser().parseFromString('<xml>f&#x00FC;n</xml>');
    var root = dom.documentElement;
    expect(root.firstChild.textContent).to.equal('fün');
  });
  it('text node with two one-byte Unicode character entities', () => {
    var dom = new DOMParser().parseFromString('<xml>kchen&#x4E03;&#x5473;@shichimitogarashi.org</xml>');
    var root = dom.documentElement;
    expect(root.firstChild.textContent).to.equal('kchen七味@shichimitogarashi.org');
  });
  /**
   * End of unicode tests
   */
  it('append node', () => {
    var dom = new DOMParser().parseFromString('<xml/>');
    var child = dom.createElement("child");
    expect(child).to.equal(dom.documentElement.appendChild(child));
    expect(child).to.equal(dom.documentElement.firstChild);
    var fragment = new dom.createDocumentFragment();
    expect(child).to.equal(fragment.appendChild(child));
  });
  it('insert node', () => {
    var dom = new DOMParser().parseFromString('<xml><child/></xml>');
    var node = dom.createElement("sibling");
    var child = dom.documentElement.firstChild;
    child.parentNode.insertBefore(node, child);
    expect(node).to.equal(child.previousSibling);
    expect(node.nextSibling).to.equal(child);
    expect(node.parentNode).to.equal(child.parentNode);
  });
  it('insert fragment', () => {
    var dom = new DOMParser().parseFromString('<xml><child/></xml>');
    var fragment = dom.createDocumentFragment();
    expect(fragment.nodeType).to.equal(11);
    var first = fragment.appendChild(dom.createElement("first"));
    var last = fragment.appendChild(dom.createElement("last"));
    expect(fragment.firstChild).to.equal(first);
    expect(fragment.lastChild).to.equal(last);
    expect(last.previousSibling).to.equal(first);
    expect(first.nextSibling).to.equal(last);
    var child = dom.documentElement.firstChild;
    child.parentNode.insertBefore(fragment, child);
    expect(last.previousSibling).to.equal(first);
    expect(first.nextSibling).to.equal(last);
    expect(child.parentNode.firstChild).to.equal(first);
    expect(last).to.equal(child.previousSibling);
    expect(last.nextSibling).to.equal(child);
    expect(first.parentNode).to.equal(child.parentNode);
    expect(last.parentNode).to.equal(child.parentNode);
  });
  it("instruction", () => {
    var source = '<?xml version="1.0"?><root><child>&amp;<!-- &amp; --></child></root>';
    var doc = new DOMParser().parseFromString(source,"text/xml");
    var source2 = new XMLSerializer().serializeToString(doc);
    expect(source).to.equal(source2);
  });
  it('public id && sysid', () => {
    var error = []
    var parser = new DOMParser({
      locator:{},
      errorHandler:function(msg){
        error.push(msg);
      }
    });
    var doc = parser.parseFromString('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html/>', 'text/html');
    //console.log(doc+'')

  });
});
//var ELEMENT_NODE                = NodeType.ELEMENT_NODE                = 1;
//var ATTRIBUTE_NODE              = NodeType.ATTRIBUTE_NODE              = 2;
//var TEXT_NODE                   = NodeType.TEXT_NODE                   = 3;
//var CDATA_SECTION_NODE          = NodeType.CDATA_SECTION_NODE          = 4;
//var ENTITY_REFERENCE_NODE       = NodeType.ENTITY_REFERENCE_NODE       = 5;
//var ENTITY_NODE                 = NodeType.ENTITY_NODE                 = 6;
//var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
//var COMMENT_NODE                = NodeType.COMMENT_NODE                = 8;
//var DOCUMENT_NODE               = NodeType.DOCUMENT_NODE               = 9;
//var DOCUMENT_TYPE_NODE          = NodeType.DOCUMENT_TYPE_NODE          = 10;
//var DOCUMENT_FRAGMENT_NODE      = NodeType.DOCUMENT_FRAGMENT_NODE      = 11;
//var NOTATION_NODE               = NodeType.NOTATION_NODE               = 12;
