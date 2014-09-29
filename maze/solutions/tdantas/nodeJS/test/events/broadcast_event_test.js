var assert          = require("assert")
var BroadcastEvent  = require('../../events/broadcast')
var UserRepository  = require('../../users/repository')
var sinon           = require('sinon')


describe('BroadcastEvent', function() {

  it("receives a payload", function() {
    var payload = "1|B"
    var broadcast = BroadcastEvent(payload)
    assert.equal(payload, broadcast.payload)
  })

  it("parses the sequence from payload", function() {
    var payload = "33|B"
    var broadcast = BroadcastEvent(payload)
    assert.equal(33, broadcast.sequence)
  })


  describe("#process" , function() {

    after(function() {
      UserRepository.reset()
    })

    before(function() {
      UserRepository.create(1, { write: function(){}})
      UserRepository.create(2, { write: function(){}})
    })

    
    it("process the event", sinon.test(function() {
      var brodcastEvent   = BroadcastEvent('1|B')
      var john      = UserRepository.fetch(1)
      var dantas    = UserRepository.fetch(2)

      var jMock = this.mock(john).expects("send").once();
      var dMock = this.mock(dantas).expects("send").once();
      brodcastEvent.process()

    }))
  })
})

