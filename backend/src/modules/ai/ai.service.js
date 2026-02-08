import env from "../../config/env.js";
import { getRoomMemory, addToRoomMemory } from "./ai.memory.js";

/* --------------------------------------------------
   ENV VALIDATION
-------------------------------------------------- */
if (!env.HF_API_KEY) {
  throw new Error("❌ HF_API_KEY is missing");
}

/* --------------------------------------------------
   HF CONFIG (STABLE + FREE)
-------------------------------------------------- */
const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.2";
const HF_ENDPOINT =
  `https://router.huggingface.co/hf-inference/v1/models/${HF_MODEL}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* --------------------------------------------------
   MAIN AI FUNCTION
-------------------------------------------------- */
export const askAI = async (roomId, userPrompt) => {
  if (!roomId || !userPrompt) {
    throw new Error("askAI requires roomId and userPrompt");
  }

  const memory = getRoomMemory(roomId);

  // HF works best with plain-text conversational prompts
  const prompt = [
    "You are a friendly, helpful AI assistant.",
    ...memory.map((m) => `${m.role}: ${m.content}`),
    `user: ${userPrompt}`,
    "assistant:",
  ].join("\n");

  try {
    const callHF = async () => {
      const response = await fetch(HF_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.7,
          },
        }),
      });

      // ⚠️ HF may return plain text (e.g. "Not Found")
      const rawText = await response.text();

      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        console.error("❌ HF NON-JSON RESPONSE:", rawText);
        throw new Error("HF returned non-JSON response");
      }

      return data;
    };

    let data = await callHF();

    /* --------------------------------------------------
       HANDLE MODEL COLD START
    -------------------------------------------------- */
    if (
      typeof data?.error === "string" &&
      data.error.toLowerCase().includes("loading")
    ) {
      console.log("⏳ HF model loading, retrying in 5s...");
      await sleep(5000);
      data = await callHF();
    }

    /* --------------------------------------------------
       EXTRACT GENERATED TEXT (ALL CASES)
    -------------------------------------------------- */
    let generatedText = null;

    // Case 1: Array response
    if (Array.isArray(data) && data[0]?.generated_text) {
      generatedText = data[0].generated_text;
    }

    // Case 2: Object response
    if (data?.generated_text) {
      generatedText = data.generated_text;
    }

    if (!generatedText) {
      console.error("❌ HF RAW RESPONSE:", data);
      throw new Error("HF returned no generated text");
    }

    const aiReply = generatedText
      .split("assistant:")
      .pop()
      .trim();

    /* --------------------------------------------------
       SAVE MEMORY
    -------------------------------------------------- */
    addToRoomMemory(roomId, "user", userPrompt);
    addToRoomMemory(roomId, "assistant", aiReply);

    return aiReply;
  } catch (err) {
    console.error("❌ HF AI ERROR:", err.message);
    throw err;
  }
};
