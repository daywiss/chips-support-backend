var Promise = require('bluebird')
var assert = require('assert')
var lodash = require('lodash')
module.exports = function(libs){
  var methods = {}

  methods.searchUnknown = function(params){
    assert(params.search,'requires search term')
    var search = lodash.trim(params.search)
    return Promise.any([
      libs.fiesta.getJackpot(search).then(function(result){ 
        return { search:search, resultType:'Jackpot ID', result } 
      }),
      libs.fiesta.getJackpotByHash(search).then(function(result){ 
        return { search:search, resultType:'Jackpot Hash', result } 
      }),
      libs.fiesta.getCoinflip(search).then(function(result){ 
        return { search:search, resultType:'Coinflip ID', result } 
      }),
      libs.fiesta.getCoinflipByHash(search).then(function(result){ 
        return { search:search, resultType:'Coinflip Hash', result } 
      }),
      libs.fiesta.getUser(search).then(function(result){ 
        return { search:search, resultType:'User ID', result } 
      }),
      libs.fiesta.getUserBySteamID(search).then(function(result){ 
        return { search:search, resultType:'User Steam ID', result } 
      }),
      libs.fiesta.getRake(search).then(function(result){ 
        return { search:search, resultType:'Rake ID', result } 
      }),
      libs.fiesta.getPayout(search).then(function(result){ 
        return { search:search, resultType:'Payout ID', result } 
      }),
      libs.fiesta.getOrder(search).then(function(result){ 
        return { search:search, resultType:'Game Order ID', result } 
      }),
      libs.bots.getTradesByMessage(search).then(function(result){ 
        return { search:search, resultType:'Bot Trade Message ID', result } 
      }),
      libs.bots.getTrade(search).then(function(result){ 
        return { search:search, resultType:'Bot Trade ID', result } 
      }),
      libs.bots.getItem(search).then(function(result){ 
        return { search:search, resultType:'Bot Item ID', result } 
      }),
      libs.bots.getBotBySteamID(search).then(function(result){ 
        return { search:search, resultType:'Bot By Steam ID', result } 
      }),
    ]).catch(function(err){
      console.log(err.message)
      throw new Error("Unable to find anything matching search terms")
    })
  }

  methods.searchUserOrders= function(params){
    assert(params.userid,'requires userid')
    return libs.fiesta.getOrdersByUserID(params.userid,params.limit).then(function(result){
      return {search:params.userid,resultType:'User Orders',result}
    })
  }

  methods.getUserBackpack = function(params){
    assert(params.userid,'requires userid')
    return libs.fiesta.getBackpack(params.userid).then(function(result){
      return {search:params.userid, resultType:'User Backpack',result}
    })
  }

  methods.getWinningGames = function(params){
    assert(params.userid,'requires userid')
    return Promise.all([
        libs.fiesta.getWinningJackpots(params.userid),
        libs.fiesta.getWinningCoinflips(params.userid),
    ]).spread(lodash.concat).then(function(result){
      return {search:params.userid, resultType:'User Winning Games',result}
    })
  }

  methods.getGamesWithUser = function(params){
    assert(params.userid,'requires userid')
    return Promise.all([
        libs.fiesta.getJackpotsWithUser(params.userid),
        libs.fiesta.getCoinflipsWithUser(params.userid),
    ]).spread(lodash.concat).then(function(result){
      return {search:params.userid, resultType:'Games With User',result}
    })
  }

  methods.getGamesWithItem = function(params){
    assert(params.itemid,'requires itemid')
    return Promise.all([
        libs.fiesta.getJackpotsWithItem(params.itemid),
        libs.fiesta.getCoinflipsWithItem(params.itemid),
    ]).spread(lodash.concat).then(function(result){
      return {search:params.itemid, resultType:'Games With Item',result}
    })
  }
  methods.getTradesWithItem = function(params){
    assert(params.itemid,'requires itemid')
    return libs.bots.getTradesByItemID(params.itemid).then(function(result){
      return {search:params.itemid, resultType:'Trades with Item',result}
    })
  }

  methods.getOrdersWithItem = function(params){
    assert(params.itemid,'requires itemid')
    return libs.fiesta.getOrdersByItemID(params.itemid).then(function(result){
      return {search:params.itemid, resultType:'Orders with Item',result}
    })
  }

  methods.getOrderByTrade = function(params){
    assert(params.tradeid,'requires tradeid')
    return libs.fiesta.getOrderByTradeID(params.tradeid).then(function(result){
      return {search:params.tradeid, resultType:'Order By Trade',result}
    })
  }

  methods.setTradeActive = function(params){
    assert(params.tradeid,'tradid state')
    return libs.bots.changeTradeState(params.tradeid,'Active')
  }

  methods.getRake = function(params){
    assert(params.gameid,'requires gameid')
    return libs.fiesta.getRake(params.gameid).then(function(result){
      return {search:params.gameid, resultType:'Rake By Game', result}
    })
  }

  methods.getJackpot = function(params){
    return libs.fiesta.getJackpot(params.id)
  }
  methods.getBackpack = function(params){
    return libs.fiesta.getBackpack(params.id)
  }
  methods.getUser = function(params){
    return libs.fiesta.getUser(params.id)
  }
  methods.getCoinflip = function(params){
    return libs.fiesta.getUser(params.id)
  }

  methods.updateTicket = function(params){
    return libs.fiesta.updateTicket(params)
  }

  methods.getTicket = function(params){
    return libs.fiesta.getTicket(params.id)
  }

  methods.echo = function(params){
    return params
  }

  return function(action,params,token){
    console.table(lodash.assign({
      action
    },params))

    return Promise.try(function(){
      assert(lodash.has(methods,action),'Method not found')
      return methods[action](params || {})
    })
  }
}
