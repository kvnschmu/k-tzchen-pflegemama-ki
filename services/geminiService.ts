
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_PROMPT, GEMINI_MODEL_NAME } from '../constants';

// Assume API_KEY is set in the environment.
// The instructions strictly prohibit asking the user for the API key or providing UI for it.
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY environment variable not set. The application will not be able to connect to Gemini.");
  // Note: We are not throwing an error here that would halt the app, 
  // but chat functionality will fail. The UI should ideally reflect this.
  // However, per spec, we assume it's configured. This is a fallback console log.
}

const ai = new GoogleGenAI({ apiKey: apiKey || "MISSING_API_KEY" }); // Provide a placeholder if missing to avoid crash on init.

export const createChatSession = async (): Promise<Chat> => {
  if (!apiKey) {
    throw new Error("API Key ist nicht konfiguriert. Chat kann nicht gestartet werden.");
  }
  try {
    const chat: Chat = ai.chats.create({
      model: GEMINI_MODEL_NAME,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        // Other configs like temperature, topK can be added here if needed
        // temperature: 0.7, 
      },
    });
    return chat;
  } catch (error) {
    console.error("Error creating chat session:", error);
    throw new Error("Fehler beim Erstellen der Chat-Sitzung mit der KI.");
  }
};

export const sendMessageToChat = async (chat: Chat, messageText: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key ist nicht konfiguriert. Nachrichten können nicht gesendet werden.");
  }
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message: messageText });
    // Directly access the text property as per the new guidelines
    const text = response.text;
    if (typeof text !== 'string') {
        // This case should ideally not happen if API works as documented
        console.error("Unexpected response format from AI:", response);
        throw new Error("Unerwartetes Antwortformat von der KI.");
    }
    return text;
  } catch (error) {
    console.error("Error sending message to chat:", error);
    // Check for specific error types or messages if needed
    if (error instanceof Error && error.message.includes("API key not valid")) {
         throw new Error("Der API-Schlüssel ist ungültig. Bitte überprüfe die Konfiguration.");
    }
    throw new Error("Fehler beim Senden der Nachricht oder Empfangen der KI-Antwort.");
  }
};
