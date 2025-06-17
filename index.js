import { ChatCohere } from "@langchain/cohere";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

import dotenv from "dotenv";

dotenv.config();

const model = new ChatCohere({ apiKey: process.env.COHERE_API_KEY });

const promptTemplate = PromptTemplate.fromTemplate("Give me a recipe for {food}")

const outputParser = new StringOutputParser();

const chain = RunnableSequence.from([promptTemplate, model, outputParser])

const result = await chain.invoke({food: "apple pie"});

console.log(result);