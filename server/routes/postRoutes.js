import express from "express";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { Post } from "../models/posts.js";

dotenv.config();

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_KEY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

router.route("/").get(async (req, res) => {
    try {
        const posts = await Post.find({});
        res.status(200).json({
            success: true,
            data: posts,
        });
    } catch (error) {
        res.status(500).json({
            message: "fetching posts failed, please try again!",
            success: false,
        });
    }
});

router.route("/").post(async (req, res) => {
    try {
        const { name, prompt, photo } = req.body;
        const photoUrl = await cloudinary.uploader.upload(photo);
        const newPost = await Post.create({
            name,
            prompt,
            photo,
        });

        res.status(200).json({
            data: newPost,
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to create a post, please try again!",
            success: false,
        });
    }
});

export default router;
