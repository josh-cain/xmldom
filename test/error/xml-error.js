'use strict'

const DOMParser = require('../../dom-parser').DOMParser;
const expect = require('chai').expect;

describe('errorHandle', () => {
  it('empty document', () => {
  	var errors = [];
	var p = new DOMParser({
		errorHandler: function(key,msg){
		//console.log(key,msg)
		errors.push(key, msg);
	}
	});
	var dom = p.parseFromString('', 'text/xml');
	expect(errors.length).to.be.ok;
  });
  it('unclosed document', () => {
  	var errors = [];
	var p = new DOMParser({
		errorHandler: function(key,msg){
		errors.push(key, msg);
	}
	});
	var dom = p.parseFromString('<img>', 'text/xml');
	expect(errors.length).to.be.ok;
  });
  it('unclosed xml', () => {
  	var errors = [];
	var p = new DOMParser({
		errorHandler: function(key,msg){
		errors.push(key, msg)
	}
	});
	var dom = p.parseFromString('<img>', 'text/html');
	//console.log(errors)
	expect(errors.length).to.equal(0);
  });
  it("invalid xml node", () => {
		var errors = [];
		var p = new DOMParser({
			errorHandler: function(key,msg){
				//console.log(key,msg)
				errors.push(key, msg);
			}
		});
		//console.log('loop');
		var dom = new DOMParser().parseFromString('<test><!--', 'text/xml');
		//var dom = new DOMParser().parseFromString('<div><p><a></a><b></b></p></div>', 'text/html');
		//console.log(dom+'')
		expect(dom.documentElement+'').to.equal('<test/>');
		var dom = p.parseFromString('<r', 'text/xml');
		//console.log(dom.documentElement)
		expect(dom.documentElement+'').to.equal('<r/>');
  });
  it('invalid xml attribute(miss qute)', () => {
  	var errors = [];
	var p = new DOMParser({
		errorHandler: function(key,msg){
		//console.log(key,msg)
		errors.push(key, msg);
	}
	});
	var dom = p.parseFromString('<img attr=1/>', 'text/html');
	//console.log(dom+'')
	expect(errors.length).to.be.ok;
  });
  it('invalid xml attribute(<>&)', () => {
	var p = new DOMParser({
	});
	var dom = p.parseFromString('<img attr="<>&"/>', 'text/html');
	//console.log(dom+'##'+errors.length)
	expect(dom+'').to.equal('<img attr="&lt;>&amp;"/>');
  });
});
