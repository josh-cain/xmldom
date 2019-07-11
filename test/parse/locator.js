'use strict';

const DOMParser = require('../../dom-parser').DOMParser;
const expect = require('chai').expect;

const parser = new DOMParser({
  locator:{}
});
//var doc = parser.parseFromString('<root>\n\t<err</root>', 'text/html');

function assertPosition(n, line, col,info) {
  expect(n.lineNumber).to.equal(line,'lineNumber:'+n.lineNumber+'/'+line+'\n@'+info);
  expect(n.columnNumber).to.equal(col,'columnNumber:'+n.columnNumber+'/'+col+'\n@'+info);
}

describe('DOMLocator', () => {
  it("empty line number", () => {
    var xml= [
'<scxml xmlns="http://www.w3.org/2005/07/scxml" version="1.0"',
'       profile="ecmascript" id="scxmlRoot" initial="start">',
'',
'  <!--',
'      some comment (next line is empty)',
'',
'  -->',
'',
'  <state id="start" name="start">',
'    <transition event"init" name="init" target="main_state" />',
'  </state>',
'',
'  </scxml>'
    ].join('\n')
    var parser = new DOMParser({locator:{}});
    var doc = parser.parseFromString(xml, 'text/xml');
    var trans = doc.getElementsByTagName('transition')[0];
    //console.error(doc+'')
    expect(trans.lineNumber).to.equal(10)//,''+trans+trans.lineNumber+'/'+trans.parentNode.previousSibling.previousSibling.lineNumber)

  });
  it('node positions', () => {
    var parser = new DOMParser({locator:{}});
    var doc = parser.parseFromString('<?xml version="1.0"?><!-- aaa -->\n' +
      '<test>\n' +
      '  <a attr="value"><![CDATA[1]]>something\n</a>x</test>', 'text/xml');
    var test = doc.documentElement;
    var a = test.firstChild.nextSibling;
    assertPosition(doc.firstChild, 1, 1,'first child');
    assertPosition(doc.firstChild.nextSibling, 1, 1+'<?xml version="1.0"?>'.length,'first child nextSibling');
    assertPosition(test, 2, 1,'document element'+test);
    //assertPosition(test.firstChild, 1, 7);
    assertPosition(a, 3, 3,'documentElement firstchild nextSibling'+a);
    assertPosition(a.firstChild, 3, 19,'a.firstchild');
    assertPosition(a.firstChild.nextSibling, 3, 19+'<![CDATA[1]]>'.length,'a.firstchild.nextsibling');
    assertPosition(test.lastChild, 4, 5,'test.lastChild');
  });
  it('error positions', () => {
    var error = []
    var parser = new DOMParser({
      locator:{systemId:'c:/test/1.xml'},
      errorHandler:function(msg){
        console.error('#######'+msg);
        error.push(msg);
      }
    });
    var xml = '<html><body title="1<2"><table>&lt;;test</body></body></html>';
    var doc = parser.parseFromString(xml, 'text/html');
    var attr = doc.documentElement.firstChild.attributes.item(0);
    //assert.equal()
    assertPosition(attr, 1, 19,'title="1<2 ')
    //console.assert(/\n@c\:\/test\/1\.xml#\[line\:\d+,col\:\d+\]/.test(error.join(' ')),'line,col must record:'+error)
  });
  it('error positions p', () => {
    var error = []
    var parser = new DOMParser({
      locator:{},
      errorHandler:function(msg){
        error.push('@@'+msg);
      }
    });
    var doc = parser.parseFromString('<root>\n\t<err</root>', 'text/html');
    var root = doc.documentElement;
    var textNode = root.firstChild;
    //console.log('!!!!!'+root+'/'+error)
    console.assert(/\n@#\[line\:2,col\:2\]/.test(error.join(' ')),'line,col must record:'+error);
    //console.log(textNode.lineNumber+'/'+textNode.columnNumber)
  });
});
