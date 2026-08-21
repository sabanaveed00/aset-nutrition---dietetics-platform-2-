import React, { useState } from "react";
import { FoodDiaryItem, ClientProfile } from "../../types/nutrition";
import {
  BookOpen,
  CheckCircle,
  ThumbsUp,
  MessageSquare,
  Clock,
  Flame,
  Camera,
  Heart,
  Send,
} from "lucide-react";

interface FoodDiaryReviewProps {
  client: ClientProfile;
  diaryEntries: FoodDiaryItem[];
  onAddFeedback: (entryId: string, feedback: string) => void;
  onToggleLike: (entryId: string) => void;
}

export const FoodDiaryReview: React.FC<FoodDiaryReviewProps> = ({
  client,
  diaryEntries,
  onAddFeedback,
  onToggleLike,
}) => {
  const [feedbackInput, setFeedbackInput] = useState<Record<string, string>>({});

  const handleSendFeedback = (id: string) => {
    const text = feedbackInput[id]?.trim();
    if (text) {
      onAddFeedback(id, text);
      setFeedbackInput((prev) => ({ ...prev, [id]: "" }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#141414] border border-[#222222] shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-[#1a1a1a] text-teal-400 border border-teal-900/40">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Patient Food Diary & Photo Log Review
            </h3>
            <p className="text-xs text-[#888888]">
              Review daily meal compliance, photo logs, and send dietitian feedback for {client.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-teal-950/60 text-teal-400 border border-teal-800/40 font-semibold text-xs font-mono">
            {client.adherenceRate}% Plan Compliance
          </span>
        </div>
      </div>

      {/* Diary Entries Feed */}
      <div className="space-y-4">
        {diaryEntries.map((entry) => {
          return (
            <div
              key={entry.id}
              className="p-6 rounded-3xl bg-[#141414] border border-[#222222] shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#222222]">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#1a1a1a] border border-teal-900/40 text-teal-400 flex items-center justify-center font-bold text-sm">
                    {entry.mealType.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white text-base">
                        {entry.mealType}
                      </h4>
                      <span className="text-xs text-[#666666] flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-teal-400" /> {entry.timeLogged}
                      </span>
                    </div>
                    <span className="text-xs text-teal-400 font-medium flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Logged & Confirmed by Patient
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-sm text-white flex items-center justify-end gap-1 font-mono">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    {entry.caloriesEstimate} kcal
                  </span>
                  <div className="text-[10px] text-[#888888] font-mono">
                    P: {entry.macros.protein}g | C: {entry.macros.carbs}g | F: {entry.macros.fat}g
                  </div>
                </div>
              </div>

              {/* Photo & Description */}
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {entry.photoUrl && (
                  <div className="relative rounded-2xl overflow-hidden group shrink-0 w-full sm:w-44 h-32 bg-[#111111] border border-[#222222]">
                    <img
                      src={entry.photoUrl}
                      alt="Meal confirmation photo"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1 font-medium border border-white/10">
                      <Camera className="w-3 h-3 text-teal-400" /> Photo Verified
                    </div>
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium text-[#ededed]">
                    {entry.foodDescription}
                  </p>

                  {entry.clientNotes && (
                    <div className="p-3 rounded-xl bg-[#1a1a1a] text-xs text-[#888888] italic border border-white/5">
                      "{entry.clientNotes}"
                    </div>
                  )}

                  {/* Satiety & Hunger Ratings */}
                  <div className="flex items-center gap-4 text-xs text-[#888888] pt-1">
                    {entry.hungerLevel && (
                      <span>
                        Hunger before: <strong className="text-white font-mono">{entry.hungerLevel}/5</strong>
                      </span>
                    )}
                    {entry.satisfactionLevel && (
                      <span>
                        Satiety after: <strong className="text-teal-400 font-mono">{entry.satisfactionLevel}/5</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Dietitian Feedback Box */}
              <div className="pt-2 border-t border-[#222222] space-y-2">
                {entry.dietitianFeedback && (
                  <div className="p-3.5 rounded-2xl bg-[#111111] border border-teal-900/40 flex items-start gap-2.5">
                    <MessageSquare className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-teal-300">
                        Dietitian Clinical Feedback:
                      </div>
                      <p className="text-xs text-[#ededed] mt-0.5">
                        {entry.dietitianFeedback}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleLike(entry.id)}
                    className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      entry.dietitianLiked
                        ? "bg-teal-950/60 border-teal-800/40 text-teal-300"
                        : "bg-[#1a1a1a] border-[#222222] hover:bg-[#222222] text-[#888888] hover:text-[#ededed]"
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${entry.dietitianLiked ? "fill-teal-400 text-teal-400" : ""}`} />
                    {entry.dietitianLiked ? "Dietitian Approved" : "Approve & Like"}
                  </button>

                  <input
                    type="text"
                    value={feedbackInput[entry.id] || ""}
                    onChange={(e) =>
                      setFeedbackInput({ ...feedbackInput, [entry.id]: e.target.value })
                    }
                    placeholder="Write clinical feedback or encouragement..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-[#222222] bg-[#141414] text-xs text-[#ededed] placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />

                  <button
                    type="button"
                    onClick={() => handleSendFeedback(entry.id)}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3 h-3" /> Send
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
