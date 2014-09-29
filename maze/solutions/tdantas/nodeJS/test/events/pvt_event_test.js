var assert          = require("assert")
var PVTEvent        = require('../../events/pvt')
var UserRepository  = require('../../users/repository')
var sinon           = require('sinon')



describe('PVTEvent', function() {

  it("receives a payload", function() {
    var payload = "1|P|2|1"
    var pvtEvent = PVTEvent(payload)
    assert.equal(payload, pvtEvent.payload)
  })

  it("retrieves users from payload", function() {
    var payload = "666|P|2|1"
    var pvtEvent = PVTEvent(payload)
    assert.equal(1, pvtEvent.to)
    assert.equal(2, pvtEvent.from)
  })


  describe("process", function(){

    after(function() {
      UserRepository.reset()
    })
    before(function(){
      UserRepository.create(1, { write: function(){}})
      UserRepository.create(2, { write: function(){}})
    })

    it("sends private msg to user", sinon.test(function() {
      var pvtEvent = PVTEvent("666|P|2|1")
      var john      = UserRepository.fetch(1)
      this.mock(john).expects("send").withArgs("666|P|2|1").once();
      pvtEvent.process()
    }))


    it("only to user receive the payload", sinon.test(function() {
      var pvtEvent = PVTEvent("666|P|2|1")
      var john      = UserRepository.fetch(2)
      this.mock(john).expects("send").never();
      pvtEvent.process()
    }))
  
  })
})
