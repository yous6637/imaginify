import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose

if(!cached) {
  cached = (global as any).mongoose = { 
    conn: null, promise: null 
  }
}

export const connectToDatabase = async () => {
  if(cached.conn) return cached.conn;

  if(!MONGODB_URL) throw new Error('Missing MONGODB_URL');

  console.log({ MONGODB_URL })
  cached.promise = 
    cached.promise || 
    mongoose.connect("mongodb+srv://youcef33:youcef1234@imaginify.0birjtg.mongodb.net/?retryWrites=true&w=majority&appName=imaginify", { 
      dbName: 'imaginify', bufferCommands: false 
      
    })

  cached.conn = await cached.promise;

  return cached.conn;
}