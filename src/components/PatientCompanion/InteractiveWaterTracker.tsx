import React, { useState } from "react";
import confetti from "canvas-confetti";
import { DailyWaterLog } from "../../types/nutrition";
import { Droplet, Plus, Minus, Flame, Sparkles, Award } from "lucide-react";

interface InteractiveWaterTrackerProps {
  waterLog: DailyWaterLog;
  onUpdateWater: (newAmount: number) => void;
}

export const InteractiveWaterTracker: React.FC<InteractiveWaterTrackerProps> = ({
  waterLog,
  onUpdateWater,
}) => {
  const [currentMl, setCurrentMl] = useState(waterLog.currentMl);
  const targetMl = waterLog.targetMl || 2500;

  const percentage = Math.min(100, Math.round((currentMl / targetMl) * 100));

  const handleAdjust = (amountDelta: number) => {
    const updated = Math.max(0, Math.min(5000, currentMl + amountDelta));
    setCurrentMl(updated);
    onUpdateWater(updated);

    if (updated >= targetMl && currentMl < targetMl) {
      // Trigger celebration confetti
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#14b8a6", "#2dd4bf", "#0d9488"],
      });
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentMl(val);
    onUpdateWater(val);

    if (val >= targetMl && currentMl < targetMl) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#14b8a6", "#2dd4bf", "#0d9488"],
      });
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-[#141414] border border-[#222222] shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#1a1a1a] text-teal-400 border border-teal-900/40 shadow-xs">
            <Droplet className="w-5 h-5 fill-teal-400" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-base">
              Daily Hydration Tracker
            </h4>
            <p className="text-xs text-[#888888]">
              Target: {targetMl} ml / day ({Math.round(targetMl / 250)} glasses)
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-lg font-bold text-white font-mono">
            {currentMl}{" "}
            <span className="text-xs font-normal text-[#888888]">
              / {targetMl} ml
            </span>
          </span>
          <div className="text-[11px] font-semibold text-teal-400 font-mono">
            {percentage}% Achieved
          </div>
        </div>
      </div>

      {/* Fluid Wave Animation Bar */}
      <div className="relative w-full h-7 bg-[#111111] rounded-2xl overflow-hidden border border-[#222222] shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-teal-600 to-teal-400 transition-all duration-300 relative flex items-center justify-end pr-3"
          style={{ width: `${percentage}%` }}
        >
          {percentage > 20 && (
            <span className="text-black text-[11px] font-bold font-mono">
              {currentMl} ml
            </span>
          )}
        </div>
      </div>

      {/* Interactive Sliding Adjuster */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-[#888888] font-medium font-mono">
          <span>0 ml</span>
          <span className="text-teal-400 font-sans text-xs">Slide to adjust intake</span>
          <span>4,000 ml</span>
        </div>
        <input
          type="range"
          min="0"
          max="4000"
          step="50"
          value={currentMl}
          onChange={handleSliderChange}
          className="w-full h-2 bg-[#222222] rounded-lg appearance-none cursor-pointer accent-teal-500"
        />
      </div>

      {/* Quick Increment Buttons */}
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => handleAdjust(250)}
          className="py-2.5 px-3 rounded-xl bg-[#1a1a1a] border border-[#222222] hover:border-teal-500/40 hover:text-teal-400 text-[#ededed] font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-teal-400" /> +250ml Glass
        </button>

        <button
          type="button"
          onClick={() => handleAdjust(500)}
          className="py-2.5 px-3 rounded-xl bg-[#1a1a1a] border border-[#222222] hover:border-teal-500/40 hover:text-teal-400 text-[#ededed] font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-teal-400" /> +500ml Bottle
        </button>

        <button
          type="button"
          onClick={() => handleAdjust(-250)}
          className="py-2.5 px-3 rounded-xl bg-[#1a1a1a] border border-[#222222] hover:border-[#333333] hover:text-white text-[#888888] font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Minus className="w-3.5 h-3.5" /> -250ml
        </button>
      </div>

      {percentage >= 100 && (
        <div className="p-3 rounded-xl bg-teal-950/60 text-teal-300 text-xs font-medium flex items-center gap-2 border border-teal-800/40">
          <Award className="w-4 h-4 text-teal-400 shrink-0" />
          Hydration target achieved today! Excellent cellular vitality!
        </div>
      )}
    </div>
  );
};
