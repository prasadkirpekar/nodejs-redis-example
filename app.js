const db = require('./db')
const express = require('express')
const redis = require('redis');
const { json } = require('body-parser');
const app = express()
app.use(express.json());

const APP_PORT = 3000
const REDIS_PORT = 6379


const rclient = redis.createClient(REDIS_PORT);

function cache(req,res,next){
    const id = req.params.id;
    const key = `user${id}`
    rclient.get(key,function(err,data){
        if(err) throw err;
        if(data!==null){
            console.log("Fetched from redis")
            res.send(JSON.parse(data))
        }
        else{
            next()
        }
    })
}

app.get('/user/:id', cache , function (req, res) {
    const id = req.params.id
    user = db.fetchuser(id,function(result){
        if(result.length>0){
            cacheUser(id,3600,result[0])
            return res.send(result[0])
        }
        else return res.send(result);
    });
    
    
})

app.post('/user', function (req, res) {
    let user = req.body.user

    db.adduser(user,function(result){
        console.log(result)
        res.send(result)
    });
    
})

app.post('/user/:id/update', function (req, res) {
    const user = req.body.user
    const id = req.params.id
    db.updateuser(id,user,function(result){
        console.log(result)
        if(result){
            cacheUser(id,3600,user)
        }
        res.send(result)
    });
    
})

function cacheUser(id,exp,data){
    console.log("Redis set")
    const key = `user${id}`
    var value  = JSON.stringify(data)
    rclient.setex(key,exp,value)
}

 
app.listen(APP_PORT)