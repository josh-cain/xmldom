'use strict';

const XMLSerializer = require('../../dom').XMLSerializer;
const DOMParser = require('../../dom-parser').DOMParser;
const fs = require('fs');

describe('DOMLocator', () => {
  it('test.xml', () => {
    var data = fs.readFileSync(__dirname+'/file-test1.xml').toString().replace(/\r\n?/g,'\n');
    fs.writeFileSync(__dirname+'/file-test1.xml',data)
    var dom = new DOMParser().parseFromString(data);
    var result= new XMLSerializer().serializeToString(dom)
    //console.assert(result == data.replace(/<\!\[CDATA\[\]\]>/g,'').replace(/><\/\w+>/g,'/>'),result)
    fs.writeFileSync(__dirname+'/file-test1.result.xml',result)
    // TODO assert something..
  });
});
