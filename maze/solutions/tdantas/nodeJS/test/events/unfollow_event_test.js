var assert          = require("assert")
var UnfollowEvent   = require('../../events/unfollow')
var UserRepository  = require('../../users/repository')


describe('UnfollowEvent', function() {

  it("receives a payload", function() {
    var payload = "1|U|2|1"
    var unfollowEvent = UnfollowEvent(payload)
    assert.equal(payload, unfollowEvent.payload)
  })

  it("parses the payload and retrieve to and from users", function() {
    var payload = "1|U|3|4"
    var unfollowEvent = UnfollowEvent(payload)
    assert.equal(4, unfollowEvent.to)
    assert.equal(3, unfollowEvent.from)
  })

  it("parses the sequence from payload", function() {
    var payload = "13|U|2|1"
    var unfollowEvent = UnfollowEvent(payload)
    assert.equal(13, unfollowEvent.sequence)
  })

  describe("#process", function() {
    
    after(function() {
      UserRepository.reset()
    })
    before(function(){
      UserRepository.create(6, { write: function(){}})
      UserRepository.create(7, { write: function(){}})
    })

    it("adds the follow (from) in the user ( to )", function() {
      var unfollowEvent = UnfollowEvent("32|U|6|7")
      var to      = UserRepository.fetch(7)
      var from    = UserRepository.fetch(6)
      to.follow(from)
      unfollowEvent.process()
      assert(!to.isFollowing(from))
    })
    
  })
})