import { ChatCohere } from "@langchain/cohere";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import dotenv from 'dotenv';

dotenv.config();

const model = new ChatCohere({apiKey: process.env.COHERE_API_KEY});

const prompt1 = PromptTemplate.fromTemplate(
  `You are a master chef. Give me a recipe to make {food}.`
);
const prompt2 = PromptTemplate.fromTemplate(
  `You are a translator. Translate the recipe to {language}.`
);

const chain = prompt1.pipe(model).pipe(new StringOutputParser());

const combinedChain = RunnableSequence.from([
  {
    food: chain,
    language: (input) => input.language,
  },
  prompt2,
  model,
  new StringOutputParser(),
]);

const result = await combinedChain.invoke({
  food: "Blueberry muffins",
  language: "Spanish",
});

console.log(result);