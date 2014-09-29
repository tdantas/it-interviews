var assert       = require("assert")
var FollowEvent  = require('../../events/follow')
var UserRepository  = require('../../users/repository')


describe('FollowEvent', function() {

  it("receives a payload", function() {
    var payload = "1|F|2|1"
    var followEvent = FollowEvent(payload)
    assert.equal(payload, followEvent.payload)
  })

  it("parses the payload and retrieve to and from users", function() {
    var payload = "666|F|2|1"
    var followEvent = FollowEvent(payload)
    assert.equal(1, followEvent.to)
    assert.equal(2, followEvent.from)
  })

  it("parses the sequence from payload", function() {
    var payload = "666|F|2|1"
    var followEvent = FollowEvent(payload)
    assert.equal(666, followEvent.sequence)
  })

  describe("#process", function() {
    
    after(function() {
      UserRepository.reset()
    })
    before(function(){
      UserRepository.create(1, { write: function(){}})
      UserRepository.create(2, { write: function(){}})
    })

    it("adds the follow (from) in the user ( to )", function() {
      var followEvent = FollowEvent("666|F|2|1")
      followEvent.process()
      var to      = UserRepository.fetch(1)
      var from    = UserRepository.fetch(2)
      assert(to.isFollowing(from))
    })
  })
})