import axios from "axios";

// Play message sound
export function playMessageSound(type, soundEnabled) {
  if (!soundEnabled) return;
}

export const generateAIResponse = async (
  messages, // full conversation array
  setIsLoading,
  setMessages,
  soundEnabled
) => {
  setIsLoading(true);

  try {
    const API_URL = import.meta.env.VITE_API_ALIXIA_BACKEND;

    // Remove initial bot greeting if present
    const filteredMessages = messages.filter((msg, idx) => {
      // Skip first message if it's the bot greeting
      if (idx === 0 && msg.sender === "bot") return false;
      return true;
    });

    // Prepare payload in { sender, text } format
    const payload = {
      message: JSON.stringify(
        filteredMessages.map((msg) => ({
          sender: msg.sender,
          text: msg.content,
        }))
      ),
    };

    const res = await axios.post(API_URL, payload);

    const botMessage = {
      content: res.data.message || res.data.response || "No response",
      sender: "bot",
      ai: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);

    if (soundEnabled) playMessageSound("received", soundEnabled);
  } catch (error) {
    console.error(error);
    setMessages((prev) => [
      ...prev,
      {
        content:
          "Something went wrong while fetching AI response. Please try again!",
        sender: "bot",
        ai: true,
        timestamp: new Date(),
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};
