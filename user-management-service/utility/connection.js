import mongoose from "mongoose";

const connection = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("connected to mongoDB");
  } catch (error) {
    throw error;
  }
};

const disconnection = async () => {
  await mongoose.disconnect();
};

const isConnected = async () => {
  await mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected");
  });
};
export { connection, disconnection, isConnected };
