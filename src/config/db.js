import mongoose from 'mongoose'

function connectDb(){
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("Connected to MongoDB")
    }).catch((error)=>{
        console.log("Tere se ek DB connect nahi ho rahi",error);
        process.exit(1)
        
    })

}

export default connectDb