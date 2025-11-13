import express from "express";
import * as dotenv from "dotenv";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    // apiKey: process.env.NEXT_OPENAI_API_KEY,
    apiKey: process.env.OPEN_ROUTER_API,
});

console.log(process.env.OPEN_ROUTER_API)
// const genAi = new GoogleGenAI({
//     apiKey: process.env.GEM_API_KEY,
// });

router.route("/").post(async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.5-flash-image",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: prompt,
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
                            },
                        },
                    ],
                },
            ],
        });

        console.log(completion.choices[0].message);
        const imageUrl =
            completion.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (imageUrl) {
            res.status(200).json({ photo: imageUrl });
        } else {
            res.status(400).json({
                error: "No image URL found in the model response.",
            });
        }

        // const response = await genAi.models.generateContent({
        //     model: "gemini-2.5-flash",
        //     // contents: prompt,
        //     contents: [
        //         {
        //             role: "user",
        //             parts: [{ text: prompt }],
        //         },
        //     ],
        // });
        // console.log("response: ", response);
        // for (const part of response.candidates[0].content.parts) {
        //   if (part.text) {
        //     console.log(part.text);
        //   } else if (part.inlineData) {
        //     const imageData = part.inlineData.data;
        //     const buffer = Buffer.from(imageData, "base64");
        //     fs.writeFileSync("gemini-native-image.png", buffer);
        //     console.log("Image saved as gemini-native-image.png");
        //   }
        // }

        // const response = await fetch(
        //   "https://api-inference.huggingface.co/models/prompthero/openjourney",
        //   {
        //     method: "POST",
        //     headers: {
        //       Authorization: `Bearer ${process.env.HG_TOKEN}`,
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({ inputs: prompt }),
        //   }
        // );

        // Hugging Face returns binary image as array buffer
        // const image = aiResponse.data.data[0].b64_json;
        // res.status(200).json({ photo: image });¨

        // const model = genai.getGenerativeModel({ model: "gemini-1.5-flash" });
        // const result = await model.generateContent(prompt);

        // console.log(result.response.text());

        // const result = await response.json();

        // if (result.error) return res.status(500).json({ error: result.error });

        // The API usually returns an array of base64 images
        // const imagePart = response.candidates[0].content.parts[0];
        // console.log(imagePart)

        // if (imagePart?.inlineData?.data) {
        //     const imageBase64 = imagePart.inlineData.data;
        //     console.log(imageBase64)
        //     res.status(200).json({ photo: imageBase64 });
        // } else {
        //     res.status(400).json({ error: "Model did not return an image." });
        // }
    } catch (error) {
        res.status(500).json({
            error:
                error.message
        });
    }
});

export default router;
