var assert           = require("assert")
var UsersRepository  = require('../users/repository')
var User             = require('../users/entity')

describe('UsersRepository', function() {

  beforeEach(function(){
    UsersRepository.reset()
  })

  it("persists client", function() {
    var id = 213
    var socket = {}
    UsersRepository.create(id, socket)
    var user = UsersRepository.fetch(id)
    assert.equal(213, user.id)
  })

  it("returns NULL pattern client when does not exists", function(){
    var user = UsersRepository.fetch(666)
    assert(UsersRepository.all().length === 0)
    assert.equal(User.NULL, user)
  })

  it("deletes the user from repository", function(){
    UsersRepository.create(300, {})
    UsersRepository.delete(300)
    assert.equal(User.NULL, UsersRepository.fetch(300))
  })

  it("returns all users", function(){
    UsersRepository.create(300, {})
    UsersRepository.create(200, {})
    var users = UsersRepository.all()
    users.forEach(function(user){
      assert.equal(true, (user.id == 200 || user.id== 300))
    })
    assert.equal(2, users.length)
  })

  it("emits only when there is no more users", function(){
    UsersRepository.on('empty', function() {
       throw("should not be here")
    })
    UsersRepository.create(55,{})
    UsersRepository.create(23,{})
    UsersRepository.delete(55)
  })

  it("emits empty when there is no more users", function(done){
    UsersRepository.on('empty', done)
    UsersRepository.create(55,{})
    UsersRepository.delete(55)
  })

})