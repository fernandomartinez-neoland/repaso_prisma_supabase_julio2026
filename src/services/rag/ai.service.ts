import { Ollama } from "ollama";
import "dotenv/config";

const AI = new Ollama({host:'https://ollama.com', headers:{Authorization:'Bearer '+process.env.OLLAMA_API_KEY}});

export async function ollamaAI(prompt:string){
    const response = await AI.chat({
    model: "gpt-oss:120b",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: true,
  });
  let mensaje = "";
  //   console.log(await response[0].message.content);
  for await (const part of response) {
    if (part.message.content != "") {
      mensaje += part.message.content;
    }
  }
  console.log(mensaje)
  return mensaje;
}