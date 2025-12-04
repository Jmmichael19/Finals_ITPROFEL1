import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

// Initialize chat session with restaurant context
export async function initializeChat() {
  return ai.chats.create({
    model: "gemini-2.5-flash",
    systemPrompt:
      "You are a helpful restaurant AI assistant. Help customers with:\n1. Menu recommendations based on dietary preferences\n2. Ingredient information\n3. Nutritional details\n4. Food ordering assistance\n5. Restaurant policies and hours\nBe friendly, concise, and helpful.",
    history: [],
  });
}

// Send a message to the AI
export async function sendChatMessage(chat, message) {
  try {
    const response = await chat.sendMessage({
      message: message,
    });
    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Chat error:", error);
    throw new Error("Failed to send message to AI");
  }
}

// Main chat function for API endpoint
export async function chat(userMessage, history = []) {
  try {
    const conversation = ai.chats.create({
      model: "gemini-2.5-flash",
      systemPrompt:
        "You are a helpful restaurant AI assistant. Help customers with menu recommendations, dietary preferences, nutritional information, and ordering. Be friendly and concise.",
      history: history,
    });

    const response = await conversation.sendMessage({
      message: userMessage,
    });

    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini AI error:", error);
    throw error;
  }
}

export function respondToUser(userMessage, menuItems = []) {
  if (!userMessage) return "How can I help you today?";

  const text = userMessage.toLowerCase();

  // Recognize category requests
  const categories = [
    "appetizers",
    "main course",
    "main",
    "desserts",
    "dessert",
    "beverages",
    "drinks",
    "drink",
  ];
  for (const cat of categories) {
    if (text.includes(cat)) {
      // Map synonyms
      let normalized = cat;
      if (cat === "main") normalized = "Main Course";
      if (cat === "main course") normalized = "Main Course";
      if (cat === "dessert") normalized = "Desserts";
      if (cat === "drinks" || cat === "drink") normalized = "Beverages";

      // Filter menuItems by category (case-insensitive)
      const matched = (menuItems || []).filter((item) => {
        if (!item || !item.category) return false;
        return item.category.toLowerCase().includes(normalized.toLowerCase());
      });

      if (matched.length === 0) {
        return `I couldn't find any items under "${normalized}". Would you like to see the full menu?`;
      }

      // Build a readable list (limit to 10 items)
      const list = matched
        .slice(0, 10)
        .map((i) => `• ${i.name} — ₱${i.price}`)
        .join("\n");
      return `Here are the ${normalized} items I found:\n${list}${
        matched.length > 10 ? "\n...and more" : ""
      }`;
    }
  }

  // If user asked for full menu or "show menu"
  if (text.includes("menu") || text.includes("show menu")) {
    if (!menuItems || menuItems.length === 0)
      return "The menu is currently empty.";
    const grouped = menuItems.reduce((acc, item) => {
      const key = item.category || "Uncategorized";
      acc[key] = acc[key] || [];
      acc[key].push(item);
      return acc;
    }, {});

    let reply = "Here's our menu by category:\n";
    for (const [cat, items] of Object.entries(grouped)) {
      reply += `\n${cat}:\n`;
      reply += items
        .slice(0, 8)
        .map((it) => `• ${it.name} — ₱${it.price}`)
        .join("\n");
      if (items.length > 8) reply += "\n...";
      reply += "\n";
    }
    return reply;
  }

  // Default fallback -- suggest categories
  return "I can show you our menu (try: 'show appetizers', 'show beverages', 'show desserts', or 'show main course'). What would you like?";
}
