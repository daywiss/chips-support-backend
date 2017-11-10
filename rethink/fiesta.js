var r = require('rethinkdb')
var Promise = require('bluebird')
var assert = require('assert')


module.exports = function(con){
  var methods = {}
  methods.getJackpotsWithUser = function(id){
    assert(id,'requires id')
    return r.table('jackpots').filter({players:{[id]:{}}})
      .orderBy(r.desc('created'))
      .coerceTo('array')
      .run(con).then(function(result){
        assert(result,'jackpots not found')
        return result
      })
  }
  methods.getCoinflipsWithUser = function(id){
    assert(id,'requires id')
    return r.table('coinflips').filter({players:{[id]:{}}})
      .orderBy(r.desc('created'))
      .coerceTo('array')
      .run(con).then(function(result){
        assert(result,'coinflips not found')
        return result
      })
  }
  methods.getCoinflipsWithItem = function(id){
    assert(id,'requires id')
    return r.table('coinflips').filter({items:{[id]:{}}})
      .orderBy(r.desc('created'))
      .coerceTo('array')
      .run(con).then(function(result){
        assert(result,'coinflips not found')
        return result
      })
  }
  methods.getJackpotsWithItem = function(id){
    assert(id,'requires id')
    return r.table('jackpots').filter({items:{[id]:{}}})
      .orderBy(r.desc('created'))
      .coerceTo('array')
      .run(con).then(function(result){
        assert(result,'jackpots not found')
        return result
      })
  }
  methods.getOrder = function(id){
    assert(id,'requires id')
    return r.table('orders').get(id).run(con).then(function(result){
      assert(result,'order not found')
      return result
    })
  }
  methods.getJackpotByHash = function(hash){
    assert(hash,'requires hash')
    return r.table('jackpots').filter(function(row){
      return row('provable')('hash').eq(hash)
    }).coerceTo('array').run(con).then(function(result){
      assert(result && result.length,'Jackpot not found with hash')
      return result[0]
    })
  }
  methods.getCoinflipByHash = function(hash){
    assert(hash,'requires hash')
    return r.table('coinflips').filter(function(row){
      return row('provable')('hash').eq(hash)
    }).coerceTo('array').run(con).then(function(result){
      assert(result && result.length,'Coinflip not found with hash')
      return result[0]
    })
  }
  methods.getJackpot = Promise.method(function(id){
    assert(id,'requires id')
    return r.table('jackpots').get(id).run(con).then(function(result){
      assert(result,'jackpot not found')
      return result
    })
  })
  methods.getCoinflip = Promise.method(function(id){
    assert(id,'requires id')
    return r.table('coinflips').get(id).run(con).then(function(result){
      assert(result,'coinflip not found')
      return result
    })
  })
  methods.getWinningJackpots = Promise.method(function(id){
    assert(id,'requires id')
    return r.table('jackpots').filter({winner:id})
      .orderBy(r.desc('created'))
      .coerceTo('array').run(con).then(function(result){
        return result
      })
  })
  methods.getWinningCoinflips = Promise.method(function(id){
    assert(id,'requires id')
    return r.table('coinflips').filter({winner:id})
      .orderBy(r.desc('created'))
      .coerceTo('array').run(con).then(function(result){
        return result
      })
  })
  methods.getUser = Promise.method(function(id){
    assert(id,'requires id')
    return r.table('users').get(id).run(con).then(function(result){
      assert(result,'user not found')
      return result
    })
  })
  methods.getOrdersByUserID = Promise.method(function(id,limit){
    limit = limit || 30
    assert(id,'requires id')
    return r.table('orders').filter({userid:id}).orderBy(r.desc('created')).limit(limit).coerceTo('array').run(con)
  })

  methods.getOrdersByItemID = Promise.method(function(id){
    assert(id,'requires id')
    // return r.table('orders').filter({items:{[id]:{}}}).orderBy(r.desc('created')).coerceTo('array').run(con)
    return r.table('orders').merge(function(row){
      return {
        itemids: row('items').map(function(row2){
          return row2('id')
        })
      }
    }).filter(r.row('itemids').contains(id)).orderBy(r.desc('created')).coerceTo('array').run(con)
  })

  methods.getOrderByTradeID = Promise.method(function(id){
    assert(id,'requires id')
    return r.table('orders').merge(function(row){
      return {
        tradeids: row('trades').map(function(row2){
          return row2('id')
        })
      }
    }).filter(r.row('tradeids').contains(id)).orderBy(r.desc('created')).coerceTo('array').run(con).then(function(result){
      assert(result,'order not found')
      assert(result.length,'order not found')
      return result[0]
    })
    // return r.table('orders').filter({trades:{[id]:{}}})
    //   .coerceTo('array')
    //   .run(con).then(function(result){
    //     assert(result,'order not found')
    //     assert(result.length,'order not found')
    //     return result[0]
    //   })
  })

  methods.getUserBySteamID = Promise.method(function(id){
    assert(id,'requires id')
    return r.table('users').filter({steamid:id}).coerceTo('array').run(con).then(function(result){
      assert(result,'user not found')
      assert(result.length,'user not found')
      return result[0]
    })
  })
  methods.getPayout = Promise.method(function(id){
    assert(id,'requires id')
    return r.table('payouts').get(id).run(con).then(function(result){
      assert(result,'payout not found')
      return result
    })
  })
  methods.getBackpack = Promise.method(function(id){
    assert(id,'requires id')
    return r.table('backpacks').get(id).run(con).then(function(result){
      assert(result,'backpack not found')
      return result
    })
  })                   
  methods.getRake = Promise.method(function(id){
    assert(id,'requires id')
    return r.table('rakes').get(id).run(con).then(function(result){
      assert(result,'rake not found')
      return result
    })
  })                   
  methods.getItem = Promise.method(function(id){
    assert(id,'requires id')
    return r.table('items').get(id).run(con).then(function(result){
      assert(result,'item not found')
      return result
    })
  })                   
  return methods

}

