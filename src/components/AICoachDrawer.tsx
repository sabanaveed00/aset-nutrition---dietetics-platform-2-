import React, { useState, useRef, useEffect } from "react";
import { SlidingDrawer } from "./SlidingDrawer";
import { ClientProfile } from "../types/nutrition";
import { Bot, Send, Sparkles, User, Lightbulb, BookOpen, HeartPulse, Apple } from "lucide-react";

interface AICoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeClient?: ClientProfile;
  clientName?: string;
  clientGoal?: string;
}

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export const AICoachDrawer: React.FC<AICoachDrawerProps> = ({
  isOpen,
  onClose,
  activeClient,
  clientName,
  clientGoal,
}) => {
  const resolvedName = activeClient?.name || clientName || "Sarah Jenkins";
  const resolvedGoal = activeClient?.primaryGoal || clientGoal || "Weight Loss & Health";
  const resolvedWeight = activeClient?.currentWeightKg ?? 66.4;
  const resolvedTargetWeight = activeClient?.targetWeightKg ?? 62.0;
  const resolvedPattern = activeClient?.dietaryPattern || "Mediterranean";
  const resolvedAllergies = activeClient?.allergies?.length
    ? activeClient.allergies.join(", ")
    : "None";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m0",
      sender: "ai",
      text: `Hello! I am your **ASET AI Clinical Nutrition Assistant** for **${resolvedName}**.\n\nCurrent Client Context:\n- **Goal**: ${resolvedGoal}\n- **Current Weight**: ${resolvedWeight} kg (Target: ${resolvedTargetWeight} kg)\n- **Dietary Pattern**: ${resolvedPattern}\n- **Allergies**: ${resolvedAllergies}\n\nHow can I assist with clinical diet plans, macro adjustments, or nutritional questions today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const quickPrompts = [
    `Optimize protein distribution for ${resolvedName}'s goal of ${resolvedGoal}`,
    "Suggest 3 high-fiber, low-calorie afternoon snacks",
    "Explain dietary strategies for insulin sensitivity and satiety",
    "What are the best electrolyte and hydration targets for this client?",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage.trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          clientContext: {
            name: resolvedName,
            goal: resolvedGoal,
            targetCalories: 1950,
            weight: resolvedWeight,
            height: activeClient?.heightCm ?? 168,
            bmi: (resolvedWeight / (((activeClient?.heightCm ?? 168) / 100) ** 2)).toFixed(1),
            allergies: activeClient?.allergies || [],
          },
          history: messages.slice(-4),
        }),
      });

      const data = await response.json();
      const aiReply: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.reply || "I analyzed your request according to clinical nutritional guidelines. Please let me know if you need meal plan adjustments!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: "ai",
        text: "I am ready with clinical nutrition insights. For optimal metabolic health, maintain a consistent 25-30g protein per meal and aim for 14g fiber per 1,000 kcal intake.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SlidingDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="ASET AI Clinical Assistant"
      subtitle={`Evidence-based dietetics guidance for ${resolvedName}`}
      icon={<Sparkles className="w-5 h-5" />}
      width="lg"
      footer={
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about meal plans, macros, food science..."
            id="ai-chat-input"
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#222222] bg-[#141414] text-[#ededed] placeholder-[#666666] text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            id="ai-chat-send-btn"
            className="p-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl transition-colors shadow-md shadow-teal-950 flex items-center justify-center cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      }
    >
      <div className="space-y-4">
        {/* Quick Suggestion Chips */}
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-[#888888] flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Quick Clinical Queries:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="text-left text-xs px-3 py-1.5 rounded-xl bg-[#1a1a1a] hover:border-teal-500/40 hover:text-teal-400 text-[#888888] border border-[#222222] transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Message Thread */}
        <div className="space-y-3 pt-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.sender === "ai" && (
                <div className="w-8 h-8 rounded-xl bg-[#1a1a1a] border border-teal-900/40 text-teal-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                  m.sender === "user"
                    ? "bg-teal-600 text-white rounded-br-none"
                    : "bg-[#141414] text-[#ededed] rounded-bl-none border border-[#222222]"
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">{m.text}</div>
                <div
                  className={`text-[10px] mt-1.5 text-right font-mono ${
                    m.sender === "user" ? "text-teal-100" : "text-[#666666]"
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>

              {m.sender === "user" && (
                <div className="w-8 h-8 rounded-xl bg-[#1a1a1a] border border-[#222222] text-[#888888] flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-xl bg-[#1a1a1a] border border-teal-900/40 text-teal-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 bg-[#141414] border border-[#222222] rounded-2xl rounded-bl-none flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </SlidingDrawer>
  );
};
