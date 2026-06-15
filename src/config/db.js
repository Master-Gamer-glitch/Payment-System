import mongoose from 'mongoose'

export default function connectDb(){
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("Connected to MongoDB")
    }).catch((error)=>{
        console.log("Tere se ek DB connect nahi ho rahi\n\n",error);
        process.exit(1)
    })
}

