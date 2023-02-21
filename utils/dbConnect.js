//import * as mongoose from "mongoose"
import mongoose  from "mongoose"


const { MONGODB_URL } = process.env

if(!MONGODB_URL){
    throw new Error(
        "please check your enviroment variables"
    )
}

let cached = global.mongoose

if(!cached) {
    cached = global.mongoose = {conn: null, promise: null }
}

async function dbConnect () {
    if(cached.conn) return cached.conn;
    const opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: false,
        useFindAndModify: false, 
        useCreateIndex: true, 
    }
    cached.promise = mongoose.connect(MONGODB_URL, opts);
    cached.conn = await cached.promise;
    return cached.conn
}
export default dbConnect;