var bodyParser = require('body-parser')           
var bearerToken = require('express-bearer-token') 
var cors = require('cors')                          
var lodash = require('lodash')
require('console.table')

module.exports = function(app,actions){
  app.use(cors())                                   
  app.use(bodyParser.json({
    limit:'10mb'
  }))                        
  app.use(bodyParser.urlencoded({extended:true}))   
  app.use(bearerToken())                            

  app.post('/:action',function(req,res,next){
    actions(req.params.action,req.body,req.token).then(function(result){
      console.log(result.resultType,result.result)
      res.json(result)
    }).catch(next)
  })

  app.get('*',function(req,res,next){
    res.send('Fiesta Support API Server')
  })

  app.use(function(err,req,res,next){
    console.table(lodash.assign({
      action:req.path,
    },req.body))
    console.log('error',err.stack)
    res.status(500).send(err.message || err)
  })

  return app
}



