import { ChatCohere } from "@langchain/cohere";
import dotenv from 'dotenv';

dotenv.config();

const model = new ChatCohere({apiKey: process.env.COHERE_API_KEY});
