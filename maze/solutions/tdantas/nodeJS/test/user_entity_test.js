var assert = require("assert")
var User             = require('../users/entity')

describe('User', function() {

  it("receives the id and socket", function(){
    var id = 321
    var socket = {}
    var user = new User(321, socket)
    assert.equal(id, user.id)
    assert.equal(socket, user.socket)
  })

  describe("NULL PATTERN", function(){
    var NULL = User.NULL

    it("returns NULL pattern", function(){
      assert(NULL)
    })

    it("returns N/A id", function(){
      assert.equal("N/A", NULL.id)
    })

    it("returns socket stub write function", function(){
      assert(NULL.socket.write)
    })
  })

  it("follows other users", function(){
    var john   =  new User(1,{})
    var james  =  new User(2,{})
    assert.equal(0, john.following().length)
    john.follow(james)
    assert.equal(1, john.following().length)
  })

  it("responds true for following users", function(){
    var john   =  new User(1,{})
    var james  =  new User(2,{})
    john.follow(james)
    assert(john.isFollowing(james))
  })

  it("unfollows users", function(){
    var john   =  new User(1,{})
    var james  =  new User(2,{})
    john.follow(james)
    john.unfollow(james)
    assert.equal(0, john.following().length)
  })

  it("unfollows twice does not explode", function() {
    var john   =  new User(1,{})
    var james  =  new User(2,{})
    john.unfollow(james)
    john.unfollow(james)
    assert.equal(0, john.following().length)
  })

  it("does not explode when unfollow unknown user", function() {
    var john   =  new User(1,{})
    var james  =  new User(2,{})
    john.unfollow(james)
    assert.equal(0, john.following().length)
  })

  it("does not follow the same user twice", function(){
    var john   =  new User(1,{})
    var james  =  new User(2,{})
    john.follow(james)
    john.follow(james)
    assert.equal(1, john.following().length)
  })

  it("sends message over socket", function(){
    var result = null
    var expected = "WHATEVERPAYLOAD"
    var john   =  new User(1, { write: function(payload) { result = payload } })
    john.send(expected)
    assert.equal(expected, result)
  })

  describe("#isFollowing", function(){

    it("returns true when user follow other", function() { 
      var john   =  new User(1,{})
      var james  =  new User(2,{})
      john.follow(james)
      assert(john.isFollowing(james))
    })

    it("returns false when does not follow", function() {
      var john   =  new User(1,{})
      var james  =  new User(2,{})
      assert.equal(false, john.isFollowing(james))
    })

  })

  it("sends message over socket", function(){
    var result = null
    var expected = "WHATEVERPAYLOAD"
    var john   =  new User(1, { write: function(payload) { result = payload } })
    john.send(expected)
    assert.equal(expected, result)
  })

})
