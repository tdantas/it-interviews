var assert = require("assert")
var CRLFParser = require('../parser')

describe("CRLFParser", function(){
  it("parses one valid event", function(done){
    var crlfParser = new CRLFParser()
    var expectedEvent = "123|F|5|3\r\n"
    crlfParser.on("token", function(event){
      assert.equal(expectedEvent, event)
      done()
    })
    crlfParser.parse(expectedEvent)
  })

  it("parses event with space", function(done){
    var crlfParser = new CRLFParser()
    var expectedEvent = " 123|F|5|3\r\n"
    crlfParser.on("token", function(event) {
      assert.equal(expectedEvent, event)
      done()
    })
    crlfParser.parse(expectedEvent)
  })

  it("parses event with space in the end", function(done){
    var crlfParser = new CRLFParser()
    var expectedEvent = "123|F|5|3 \r\n"
    crlfParser.on("token", function(event){
      assert.equal(expectedEvent, event)
      done()
    })
    crlfParser.parse(expectedEvent)
  })

  it("slices the parser internal buffer", function(){
    var crlfParser = new CRLFParser()
    var expectedEvent = "123|F|5|3\r\n1|B\r\n EXPECTED"
    crlfParser.parse(expectedEvent)
    assert.equal(crlfParser.buf, " EXPECTED")
  })

  it("does not slice when event is incomplete", function(){
    var crlfParser = new CRLFParser()
    var expectedEvent = "123|F|5|3\r"
    crlfParser.parse(expectedEvent)
    assert.equal(crlfParser.buf, expectedEvent)
  })

  it("emit when event is complete ", function(done){
    var crlfParser = new CRLFParser()
    var expectedEvent = "123|F|5|3\r"
    crlfParser.parse(expectedEvent)
    assert.equal(crlfParser.buf, expectedEvent)
    crlfParser.on("token", function(event){
      if(event === "123|F|5|3\r\n") done()
    })
    crlfParser.parse("\n1|B")
    assert.equal(crlfParser.buf, "1|B")
  })

  it("slice the buffer when emit the event", function(){
    var crlfParser = new CRLFParser()
    var expectedEvent = "123|F|5|3\r"
    crlfParser.parse(expectedEvent)
    assert.equal(crlfParser.buf, expectedEvent)
    crlfParser.parse("\n1|B") //will emit
    assert.equal(crlfParser.buf, "1|B")
  })

})