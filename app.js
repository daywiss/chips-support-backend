require('dotenv').config()

var Express = require('./libs/express')
var Actions = require('./libs/actions')
var r = require('rethinkdb')
var app = require('express')()
var Promise = require('bluebird')

var Fiesta = require('./rethink/fiesta')
var Bots = require('./rethink/bots')

var env = process.env

Promise.props({
  fiesta:r.connect({
    db:env.FIESTA_RETHINK_DB,
    host:env.FIESTA_RETHINK_HOST,
    password:env.FIESTA_RETHINK_PASS,
    user:env.FIESTA_RETHINK_USER,
    port:env.FIESTA_RETHINK_PORT,
  }),
  bots:r.connect({
    db:env.BOTS_RETHINK_DB,
    host:env.BOTS_RETHINK_HOST,
    password:env.BOTS_RETHINK_PASS,
    user:env.BOTS_RETHINK_USER,
    port:env.BOTS_RETHINK_PORT,
  }),
}).then(function(cons){
  var libs = {
    fiesta:Fiesta(cons.fiesta),
    bots:Bots(cons.bots),
    env:env,
  }
  var actions = Actions(libs)
  app = Express(require('express')(),actions)

  app.listen(env.EXPRESS_PORT,function(){
    console.log('Express listening on port',env.EXPRESS_PORT)
  })
})
 
