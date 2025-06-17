import { ChatCohere } from "@langchain/cohere";
import { RunnableSequence } from "@langchain/core/runnables";
import { BufferMemory } from "langchain/memory";
import { ChatPromptTemplate, MessagesPlaceholder, } from "@langchain/core/prompts";

import dotenv from 'dotenv';

dotenv.config();

const model = new ChatCohere({apiKey: process.env.COHERE_API_KEY});

// Add history in ChatPromptTemplate
const prompt = ChatPromptTemplate.fromMessages([
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);

// Define memory
const memory = new BufferMemory({
  returnMessages: true,
  inputKey: "input",
  outputKey: "output",
  memoryKey: "history",
});

const chain = RunnableSequence.from([
  {
    input: (initialInput) => initialInput.input,
    memory: () => memory.loadMemoryVariables({}),
  },
  {
    input: (previousOutput) => previousOutput.input,
    history: (previousOutput) => previousOutput.memory.history,
  },
  prompt,
  model,
]);


// test
const inputs = {
  input: "Hey, I'm Robin! I am from Minneapolis!",
};

const response = await chain.invoke(inputs);

console.log(response.content);

await memory.saveContext(inputs, {
  output: response.content,
});

const inputs2 = {
  input: "What's my name and where am I from?",
};

const response2 = await chain.invoke(inputs2);

console.log(response2.content);