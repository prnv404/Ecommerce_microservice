import mongoose from "mongoose";

export const ConnectDb = async (MONGO_URI: string) => {

    try {
        await mongoose.connect(MONGO_URI)
    } catch (error) {
        throw error
    }

}