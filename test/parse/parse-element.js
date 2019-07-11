'use strict';

const DOMParser = require('../../dom-parser').DOMParser;
const XMLSerializer = require('../../dom').XMLSerializer;
const parser = new DOMParser();

describe('XML Node Parse', () => {
  it('noAttribute', () => {
    var dom = new DOMParser().parseFromString('<xml ></xml>','text/xml');
    var dom = new DOMParser().parseFromString('<xml></xml>','text/xml');
    var dom = new DOMParser().parseFromString('<xml />','text/xml');
    var dom = new DOMParser().parseFromString('<xml/>','text/xml');
    var dom = new DOMParser().parseFromString('<xml/>','text/xml');
  });
  it('simpleAttribute', () => {
    var dom = new DOMParser().parseFromString('<xml a="1" b="2"></xml>','text/xml');
    var dom = new DOMParser().parseFromString('<xml a="1" b="2" ></xml>','text/xml');
    var dom = new DOMParser().parseFromString('<xml a="1" b=\'\'></xml>','text/xml');
    var dom = new DOMParser().parseFromString('<xml a="1" b=\'\' ></xml>','text/xml');
    var dom = new DOMParser().parseFromString('<xml a="1" b="2/">','text/xml');
    var dom = new DOMParser().parseFromString('<xml a="1" b="2" />','text/xml');
    var dom = new DOMParser().parseFromString('<xml  a="1" b=\'\'/>','text/xml');
    var dom = new DOMParser().parseFromString('<xml  a="1" b=\'\' />','text/xml');
  });
  it('nsAttribute', () => {
    var dom = new DOMParser().parseFromString('<xml xmlns="1" xmlns:a="2" a:test="3"></xml>','text/xml');
    var dom = new DOMParser().parseFromString('<xml xmlns="1" xmlns:a="2" a:test="3" ></xml>','text/xml');
    var dom = new DOMParser().parseFromString('<xml xmlns="1" xmlns:a="2" a:test="3/">','text/xml');
    var dom = new DOMParser().parseFromString('<xml xmlns="1" xmlns:a="2" a:test="3" />','text/xml');
  });
});
