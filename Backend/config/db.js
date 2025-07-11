const Mongo = require("mongoose")

const Connect = async()=>{
    Mongo.connect(process.env.Mongo_URL)
    .then(()=>{
        console.log("Mongodb connected successfully")
    })
    .catch((e)=>{
        console.log(`db error:${e}`)
    })
}

module.exports = Connect;