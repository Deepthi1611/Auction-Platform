import mongoose from "mongoose";

export const connection = ()=>{
    mongoose.connect(process.env.MONGO_URL, {
        dbName: 'Auction_platform'
    }).then(()=> {
        console.log('connected to database')
    }).catch((error)=>{
        console.log(`some error occurred while connecting to database: ${error}`)
    })
}