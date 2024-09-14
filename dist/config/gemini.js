"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
// const genAI = new GoogleGenerativeAI('AIzaSyDyHHqXLXVP0gcJLJox5foa2ClGVvbVOqk');
// async function run() {
//   const model: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// const prompt = "Write a story about a marvel avengers.";
// const result = await model.generateContent(prompt);
// const result = await model.generateContent([
//   "What is in this photo?",
//   {
//     inlineData: {
//       data: Buffer.from(fs.readFileSync('path/to/image.png')).toString("base64"),
//       mimeType: 'image/png'
//     }
//   }
// ]);
// console.log(result.response.text());
// }
// run();
const chatBot = () => __awaiter(void 0, void 0, void 0, function* () {
    const genAI = new generative_ai_1.GoogleGenerativeAI('AIzaSyDyHHqXLXVP0gcJLJox5foa2ClGVvbVOqk');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: "Hello" }],
            },
            {
                role: "model",
                parts: [{ text: "Great to meet you. What would you like to know?" }],
            },
        ],
    });
    let result = yield chat.sendMessage("I have 2 dogs in my house.");
    console.log(result.response.text());
    result = yield chat.sendMessage("How many paws are in my house?");
    console.log(result.response.text());
});
chatBot();
