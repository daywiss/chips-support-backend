var r = require('rethinkdb')
var Promise = require('bluebird')
var assert = require('assert')


module.exports = function(con){
  var methods = {}
  methods.getTrade = function(id){
    return r.table('trades').get(id).run(con).then(function(result){
      assert(result,'trade not found')
      return result
    })
  }
  methods.getTradesByItemID = function(id){
    return r.table('trades').getAll(id,{index:'itemid'})
      .orderBy(r.desc('created')).coerceTo('array').run(con).then(function(result){
        assert(result,'trade not found')
        return result
      })
  }
  methods.getTradesByMessage = function(id){
    return r.table('trades').getAll(id,{index:'messageid'}).orderBy(r.desc('created'))
      .coerceTo('array').run(con).then(function(result){
        assert(result,'trades not found')
        assert(result.length,'trades not found')
        return result
      })
  }
  methods.getTradesBySteamID = function(id){
    return r.table('trades').getAll(id,{index:'steamid'})
      .orderBy(r.desc('created')).coerceTo('array').run(con).then(function(result){
        assert(result,'trades not found')
        assert(result.length,'trades not found')
        return result
      })
  }

  methods.getBotBySteamID = function(id){
    return r.table('bots').getAll(id,{index:'steamid'}).coerceTo('array').run(con).then(function(result){
      assert(result,'bot not found')
      assert(result.length,'bot not found')
      return result[0]
    })
  }

  methods.getBot = Promise.method(function(id){
    return r.table('bots').get(id).run(con).then(function(result){
      assert(result,'bot not found')
      return result
    })
  })

  methods.getItem = Promise.method(function(id){
    return r.table('items').get(id).run(con).then(function(result){
      assert(result,'item not found')
      return result
    })
  })

  methods.changeTradeState = Promise.method(function(id,state){
    return r.table('trades').get(id).update({state:state}).run(con)
  })


  return methods

}

