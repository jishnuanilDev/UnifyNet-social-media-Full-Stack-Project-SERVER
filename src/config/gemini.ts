import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import * as fs from "fs";

const genAI = new GoogleGenerativeAI('AIzaSyAhpccgF3zU5_ZiXLAt-qnrdta0VCSLmg0');

export async function captionGenerate(postImage:any) {
  const model: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = "Write a story about a marvel avengers.";
  // const result = await model.generateContent(prompt);
  const base64Data = postImage.split(',')[1];
  try {
    const result = await model.generateContent([
      "Generate a one line caption for social media",
      {
        inlineData: {
          data: base64Data,   // Only base64 string
          mimeType: 'image/png'  // Ensure this matches your image type
        }
      }
    ]);

    console.log('caption mwonuse',result.response.text());  // Output the generated caption
    console.log('caption mwonuse didididididididi');
    return  result.response.text();
   
  } catch (error) {
    console.error("API Error in gemini:", error);  // Log detailed error info
  }

}


// const chatBot = async()=>{
//     const genAI = new GoogleGenerativeAI('AIzaSyDyHHqXLXVP0gcJLJox5foa2ClGVvbVOqk');
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const chat = model.startChat({
//       history: [
//         {
//           role: "user",
//           parts: [{ text: "Hello" }],
//         },
//         {
//           role: "model",
//           parts: [{ text: "Great to meet you. What would you like to know?" }],
//         },
//       ],
//     });
//     let result = await chat.sendMessage("I have 2 dogs in my house.");
//     console.log(result.response.text());
//     result = await chat.sendMessage("How many paws are in my house?");
//     console.log(result.response.text());
//   }
  
//   chatBot();