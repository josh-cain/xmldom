'use strict';

const XMLSerializer = require('../../dom').XMLSerializer;
const DOMParser = require('../../dom-parser').DOMParser;
const expect = require('chai').expect;

const parser = new DOMParser();

describe('html normalizer', () => {
  it('text & <', () => {
    var dom = new DOMParser().parseFromString('<div>&amp;&lt;123&456<789;&&</div>','text/html');
    expect(dom).to.equal('<div>&amp;&lt;123&amp;456&lt;789;&amp;&amp;</div>');

    var dom = new DOMParser().parseFromString('<div><123e>&<a<br/></div>','text/html');
    expect(dom).to.equal('<div>&lt;123e>&amp;&lt;a<br/></div>');

    var dom = new DOMParser().parseFromString('<div>&nbsp;&copy;&nbsp&copy</div>','text/html');
    expect(dom).to.equal('<div>\u00a0\u00a9&amp;nbsp&amp;copy</div>');

    var dom = new DOMParser().parseFromString('<html xmlns:x="1"><body/></html>','text/html');
    expect(dom).to.equal('<html xmlns:x="1"><body></body></html>');
  });
  it('attr', () => {
    var dom = new DOMParser().parseFromString('<html test="a<b && a>b && \'&amp;&&\'"/>','text/html');
    expect().to.equal('<html test="a&lt;b &amp;&amp; a>b &amp;&amp; \'&amp;&amp;&amp;\'"></html>');

    var dom = new DOMParser().parseFromString('<div test="alert(\'<br/>\')"/>','text/html');
    expect().to.equal('<div test="alert(\'&lt;br/>\')"></div>');
    var dom = new DOMParser().parseFromString('<div test="a<b&&a< c && a>d"></div>','text/html');
    expect().to.equal('<div test="a&lt;b&amp;&amp;a&lt; c &amp;&amp; a>d"></div>');

    var dom = new DOMParser().parseFromString('<div a=& bb c d=123&&456/>','text/html');
    expect().to.equal('<div a="&amp;" bb="bb" c="c" d="123&amp;&amp;456"></div>');

    var dom = new DOMParser().parseFromString('<div a=& a="&\'\'" b/>','text/html');
    expect().to.equal('<div a="&amp;\'\'" b="b"></div>');
  });
  it('attrQute', () => {
    var dom = new DOMParser().parseFromString('<html test="123"/>','text/html');
    expect().to.equal('<html test="123"></html>');

    //		var dom = new DOMParser().parseFromString('<r><Label onClick="doClick..>Hello, World</Label></r>','text/html');
    //    	expect().to.equal('<r><Label onClick="doClick..">Hello, World</Label></r>',dom+'!!')
    //		
    var dom = new DOMParser().parseFromString('<Label onClick=doClick..">Hello, World</Label>','text/html');
    expect().to.equal('<Label onClick="doClick..">Hello, World</Label>');
  });
  it("unclosed", () => {
    var dom = new DOMParser().parseFromString('<html><meta><link><img><br><hr><input></html>','text/html');
    expect().to.equal('<html><meta/><link/><img/><br/><hr/><input/></html>');

    var dom = new DOMParser().parseFromString('<html title =1/2></html>','text/html');
    expect().to.equal('<html title="1/2"></html>');

    var dom = new DOMParser().parseFromString('<html title= 1/>','text/html');
    expect().to.equal('<html title="1"></html>');

    var dom = new DOMParser().parseFromString('<html title = 1/>','text/html');
    expect().to.equal('<html title="1"></html>');

    var dom = new DOMParser().parseFromString('<html title/>','text/html');
    expect().to.equal('<html title="title"></html>');

    var dom = new DOMParser().parseFromString('<html><meta><link><img><br><hr><input></html>','text/html');
    expect().to.equal('<html><meta/><link/><img/><br/><hr/><input/></html>');
  });
  it('script', () => {
    //console.log(1112224441);
    var dom = new DOMParser().parseFromString('<script>alert(a<b&&c?"<br>":">>");</script>','text/html');
    expect().to.equal('<script>alert(a<b&&c?"<br>":">>");</script>');
    //console.log(1122211);
    var dom = new DOMParser().parseFromString('<script>alert(a<b&&c?"<br>":">>");</script>','text/xml');
    expect().to.equal('<script>alert(a&lt;b&amp;&amp;c?"<br/>":">>");</script>');
    //console.log(1111);
    var dom = new DOMParser().parseFromString('<script>alert(a<b&&c?"<br/>":">>");</script>','text/html');
    expect().to.equal('<script>alert(a<b&&c?"<br/>":">>");</script>');

    var dom = new DOMParser().parseFromString('<script src="./test.js"/>','text/html');
    expect().to.equal('<script src="./test.js"></script>');

  });
  it('textarea', () => {
    var dom = new DOMParser().parseFromString('<textarea>alert(a<b&&c?"<br>":">>");</textarea>','text/html');
    expect().to.equal('<textarea>alert(a&lt;b&amp;&amp;c?"&lt;br>":">>");</textarea>');

    var dom = new DOMParser().parseFromString('<textarea>alert(a<b&&c?"<br>":">>");</textarea>','text/xml');
    expect().to.equal('<textarea>alert(a&lt;b&amp;&amp;c?"<br/>":">>");</textarea>');
  });
});
