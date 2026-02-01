import mongoose from "mongoose";

const databaseConnection = async () => {
  try {
    const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.4mpktoa.mongodb.net/?appName=Cluster0`;

    await mongoose.connect(uri);

    console.log("Connected to database successfully");
  } catch (error) {
    console.error(`Error connecting to the database. \n${err}`);
    console.error(error);
    process.exit(1); // stop app if DB fails
  }
};

export default databaseConnection;