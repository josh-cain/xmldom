'use strict';

const DOMParser = require('../../dom-parser').DOMParser;
const expect = require('chai').expect;

var inc = 0;
var domErrorHandler = function(level, str) { 
  //console.log("x",level,str); 
  if(inc++>120)throw new Error()
};

describe('errorHandle', () => {
it('simple', () => {
  var parser = new DOMParser();
  var s = '<html><body title="1<2"></body></html>';
  var doc = parser.parseFromString(s, 'text/html');
  expect(doc==s.replace('<2','&lt;2')).to.equal(doc+'');
});
  it('unclosedFix', () => {
    var parser = new DOMParser();
    var fileContents = '<r><Page><Label /></Page  <Page></Page></r>';
    var expected =     '<r><Page><Label/></Page>  <Page/></r>'
    var inc = 0;
    var dom = parser.parseFromString(fileContents, "text/xml");
    //console.log(dom+'');
    //console.log(expected)
    expect(expected).to.equal(dom+'');
  });
  it('test', () => {
    var parser = new DOMParser();
    var fileContents = '<Page><Label class="title"/></Page  1';
    var inc = 0;
    var dom = parser.parseFromString(fileContents, "text/xml");
    //console.error('#$$$$$'+dom+'%%')
    expect(dom+'$').to.equal(fileContents.replace(/\s+1$/,'')+'>  1$');
    //console.log('dom-result:'+dom)
  });
  it('svg test', () => {
    var svgCase = [
      '<svg>',
      '  <metadata>...</metadata>',
      '  <defs id="defs14">',
      '  <path id="path4" d="M 68.589358,...-6.363961,-6.363964 z" />',
      '  <path id="path4" d="M 68.589358,...-6.363961,-6.363964 z" /></defs>',
      '</svg>'
    ].join('\n')
    var parser = new DOMParser({ locator:{}, errorHandler: domErrorHandler });
    var dom = parser.parseFromString(svgCase, "text/xml");
    expect(String(dom)).to.equal(svgCase.replace(/ \/>/g,'/>'),svgCase+'\n!=\n'+dom);
  });
  it('line error', () => {
    var xmlLineError=[
      '<package xmlns="http://ns.saxonica.com/xslt/export"',
      '         xmlns:fn="http://www.w3.org/2005/xpath-functions"',
      '         xmlns:xs="http://www.w3.org/2001/XMLSchema"',
      '         xmlns:vv="http://saxon.sf.net/generated-variable"',
      '         version="20"',
      '         packageVersion="1">',
      '  <co id="0" binds="1">',
      '</package>'].join('\r\n');

    var parser = new DOMParser({ locator:{}, errorHandler: domErrorHandler });
    var dom = parser.parseFromString(xmlLineError, "text/xml");
    //console.log('xmlLineError-result:'+dom)
    var node = dom.documentElement.firstChild.nextSibling
    //console.log(Object.keys(node),node.lineNumber)
    expect(node.lineNumber).to.equal(7);
  });
});
