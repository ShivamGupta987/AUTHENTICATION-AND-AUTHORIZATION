import mongoose from "mongoose";
mongoose.set('strictQuery', false);

const connectionToDB = async () => {
    try {
        const connection = await mongoose.connect(
            process.env.MONGO_URI || "mongodb+srv://sg804595:Shivam123@cluster0.sje7yfk.mongodb.net/?retryWrites=true&w=majority",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        if (connection) {
            console.log(`Connected to DB: ${connection.connection.host}`);
        }
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

export default connectionToDB;
