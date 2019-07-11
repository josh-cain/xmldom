'use strict'

const DOMParser = require('../../dom-parser').DOMParser;
const expect = require('chai').expect;

const xml = '<scxml xmlns="http://www.w3.org/2005/07/scxml" version="1.0"\n\
profile="ecmascript" id="scxmlRoot" initial="start">\n\
\n\
  <!--\n\
some comment (next line is empty)\n\
\n\
-->\n\
\n\
  <state id="start" name="start">\n\
  <transition event"init" name="init" target="main_state" />\n\
  </state>\n\
\n\
  </scxml>';
//console.log(xml)
var error = []
var parser = new DOMParser({
  locator: {},
  errorHandler: {
    error: function (msg) {
      error.push(msg);
      //throw new Error(msg)
    }
  }
});
var doc = parser.parseFromString(xml, 'text/html');
//console.log(doc.toString())
var doc = parser.parseFromString('<html><body title="1<2"><table>&lt;;test</body></body></html', 'text/html');
//console.log(doc.toString())

describe('errorHandle', () => {
  it('only function two args', () => {
    var error = {};
    var parser = new DOMParser({
      errorHandler: function (key, msg) { error[key] = msg }
    });
    try {
      var doc = parser.parseFromString('<html disabled><1 1="2"/></body></html>', 'text/xml');

      error.map(function (e) { error[e.replace(/\:[\s\S]*/, '')] = e });
      //console.log(error);
      expect(error.warning).to.not.be.null;
      expect(error.error).to.not.be.null;
      expect(error.fatalError).to.not.be.null;
      //console.log(doc+'')
    } catch (e) {
    }
  });
  it('only function1', () => {
    var error = [];
    var parser = new DOMParser({
      errorHandler: function (msg) { error.push(msg) }
    });
    try {
      var doc = parser.parseFromString('<html disabled><1 1="2"/></body></html>', 'text/xml');
      error.map(function (e) { error[e.replace(/\:[\s\S]*/, '')] = e });
      expect(error.warning).to.not.be.null;
      expect(error.error).to.not.be.null;
      expect(error.fatalError).to.not.be.null;
      //console.log(doc+'')
    } catch (e) {
    }
  });
  it('only function2', () => {
    var error = [];
    var errorMap = [];
    new DOMParser({
      errorHandler: function (msg) { error.push(msg) }
    }).parseFromString('<html><body title="1<2">test</body></html>', 'text/xml');
    'warn,warning,error,fatalError'.replace(/\w+/g, function (k) {
      var errorHandler = {};
      errorMap[k] = [];
      errorHandler[k] = function (msg) { errorMap[k].push(msg) }
      new DOMParser({ errorHandler: errorHandler }).parseFromString('<html><body title="1<2">test</body></html>', 'text/xml');
    });
    var error2 = [];
    for (var n in errorMap) {
      error2 = error2.concat(errorMap[n]);
      //console.assert(error.length == errorMap[n].length)
    }

    expect(error2.sort().join(',')).to.equal(error.sort().join(','));
  });
  it('error function', () => {
    var error = [];
    var parser = new DOMParser({
      locator: {},
      errorHandler: {
        error: function (msg) {
          error.push(msg);
          throw new Error(msg);
        }
      }
    });
    var doc = parser.parseFromString('<html><body title="1<2"><table>&lt;;test</body></body></html>', 'text/html');
    try {
      var doc = parser.parseFromString('<html><body title="1<2"><table>&lt;;test</body></body></html>', 'text/html');
    } catch (e) {
      //console.log(e,doc+'');
      expect(/\n@#\[line\:\d+,col\:\d+\]/.test(error.join(' '))).to.be.ok;
      return;
    }
    // TODO does this actually test anything?
    //console.assert(false,doc+' should be null');
  });
});
