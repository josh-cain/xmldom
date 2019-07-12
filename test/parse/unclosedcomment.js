'use strict';

const DOMParser = require('../../dom-parser').DOMParser;
const expect = require('chai').expect;

describe('errorHandle', () => {
  it('unclosedcomment', () => {
    var parser = new DOMParser();
    expect(() => parser.parseFromString('<!--', 'text/xml')).to.Throw('Unclosed comment');
  });
});
