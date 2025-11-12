import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from "./mongodb/connect.js";
import postRoutes from "./routes/postRoutes.js";
import imageRoutes from "./routes/imageRoutes.js"

dotenv.config();
// https://image-me.netlify.app
const app = express();
const corOption = {
    origin: ['https://image-me.netlify.app'],
    credentials: true,
};
app.use(cors(corOption));
app.use(express.json({ limit: "50mb" }));

app.use("/api/post", postRoutes);
app.use("/api/image", imageRoutes);

app.get("/", async (req, res) => {
    res.status(200).json({
    message: 'Hello from Image.me!',
  });
});

const startServer = async () => {
    try {
        connectDB(process.env.MONGODB_URI);
        app.listen(8080, () => console.log("Server running on port 8080"));
    } catch (error) {
        console.log(error);
    }
};
startServer();