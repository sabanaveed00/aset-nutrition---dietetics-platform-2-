import React, { useState } from "react";
import confetti from "canvas-confetti";
import { ClientProfile, AnthropometricRecord } from "../../types/nutrition";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import {
  TrendingDown,
  Award,
  Flame,
  Scale,
  Calendar,
  CheckCircle,
  Plus,
  Zap,
} from "lucide-react";

interface ProgressJournalProps {
  client: ClientProfile;
  onLogWeight: (newWeight: number) => void;
}

export const ProgressJournal: React.FC<ProgressJournalProps> = ({
  client,
  onLogWeight,
}) => {
  const [weightSlider, setWeightSlider] = useState(client.currentWeightKg);
  const [loggedNotification, setLoggedNotification] = useState(false);

  const totalLost = Number((client.initialWeightKg - client.currentWeightKg).toFixed(1));
  const remainingToTarget = Math.max(0, Number((client.currentWeightKg - client.targetWeightKg).toFixed(1)));
  const progressPercent = Math.min(
    100,
    Math.round(
      ((client.initialWeightKg - client.currentWeightKg) /
        (client.initialWeightKg - client.targetWeightKg || 1)) *
        100
    )
  );

  const chartData = (client.records || []).map((r) => ({
    date: r.date.slice(5),
    weight: r.weight,
    target: client.targetWeightKg,
  }));

  const handleSaveWeight = () => {
    onLogWeight(weightSlider);
    setLoggedNotification(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#14b8a6", "#2dd4bf"],
    });
    setTimeout(() => setLoggedNotification(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Milestone Banner */}
      <div className="p-6 rounded-3xl bg-[#141414] border border-[#222222] text-white shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-teal-400 font-mono">
              Personal Transformation Journey
            </span>
            <h3 className="text-xl font-bold mt-0.5">
              {totalLost > 0 ? `${totalLost} kg Dropped!` : "Getting Started"}
            </h3>
          </div>
          <div className="p-3 rounded-2xl bg-[#1a1a1a] border border-teal-900/40 text-teal-400">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Progress Bar towards Target */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-[#888888] font-mono">
            <span>Start: {client.initialWeightKg} kg</span>
            <span className="text-teal-400 font-semibold">{progressPercent}% Journey Complete</span>
            <span>Target: {client.targetWeightKg} kg</span>
          </div>
          <div className="w-full bg-[#111111] h-3 rounded-full overflow-hidden p-0.5 border border-[#222222]">
            <div
              className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-[#888888] text-right font-mono">
            {remainingToTarget > 0 ? `${remainingToTarget} kg left to target weight` : "Goal Achieved!"}
          </div>
        </div>
      </div>

      {/* Interactive Sliding Weight Logger */}
      <div className="p-6 rounded-3xl bg-[#141414] border border-[#222222] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#1a1a1a] text-teal-400 border border-teal-900/40">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-base">
                Log Today's Weight
              </h4>
              <p className="text-xs text-[#888888]">
                Slide to select your morning weigh-in
              </p>
            </div>
          </div>

          <span className="text-2xl font-bold text-teal-400 font-mono">
            {weightSlider.toFixed(1)}{" "}
            <span className="text-xs font-normal text-[#888888]">kg</span>
          </span>
        </div>

        <input
          type="range"
          min={(client.targetWeightKg - 5).toString()}
          max={(client.initialWeightKg + 5).toString()}
          step="0.1"
          value={weightSlider}
          onChange={(e) => setWeightSlider(Number(e.target.value))}
          className="w-full h-2 bg-[#222222] rounded-lg appearance-none cursor-pointer accent-teal-500"
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-[#888888] font-mono">
            Current Record: {client.currentWeightKg} kg
          </span>
          <button
            type="button"
            onClick={handleSaveWeight}
            id="log-patient-weight-btn"
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-teal-950 flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            Save Weigh-in
          </button>
        </div>

        {loggedNotification && (
          <div className="p-3 rounded-xl bg-teal-950/60 text-teal-300 text-xs font-medium flex items-center gap-2 border border-teal-800/40">
            <CheckCircle className="w-4 h-4 text-teal-400" />
            Weight logged and synchronized with your dietitian!
          </div>
        )}
      </div>

      {/* Progress Chart */}
      <div className="p-6 rounded-3xl bg-[#141414] border border-[#222222] shadow-xs space-y-4">
        <div>
          <h4 className="font-semibold text-white text-base">
            Weight Evolution Trend
          </h4>
          <p className="text-xs text-[#888888]">
            Historical measurements recorded with your dietitian
          </p>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="patientWeightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222222" opacity={0.8} />
              <XAxis dataKey="date" stroke="#666666" fontSize={11} />
              <YAxis domain={["dataMin - 2", "dataMax + 2"]} stroke="#666666" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#141414",
                  borderRadius: "12px",
                  border: "1px solid #333333",
                  color: "#ededed",
                  fontSize: "12px",
                }}
              />
              <ReferenceLine
                y={client.targetWeightKg}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                label={{ value: "Target Goal", fill: "#f59e0b", fontSize: 10 }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                name="Weight (kg)"
                stroke="#14b8a6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#patientWeightGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Badges and Streaks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#141414] border border-[#222222] text-center space-y-1">
          <div className="w-9 h-9 mx-auto rounded-xl bg-[#1a1a1a] border border-amber-900/40 text-amber-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div className="text-lg font-bold text-white font-mono">
            {client.streakDays} Days
          </div>
          <div className="text-[10px] text-[#888888] font-medium">
            Daily Diet Streak
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#141414] border border-[#222222] text-center space-y-1">
          <div className="w-9 h-9 mx-auto rounded-xl bg-[#1a1a1a] border border-teal-900/40 text-teal-400 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="text-lg font-bold text-teal-400 font-mono">
            {client.adherenceRate}%
          </div>
          <div className="text-[10px] text-[#888888] font-medium">
            Plan Adherence
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#141414] border border-[#222222] text-center space-y-1">
          <div className="w-9 h-9 mx-auto rounded-xl bg-[#1a1a1a] border border-blue-900/40 text-blue-400 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <div className="text-lg font-bold text-blue-400 font-mono">
            -{totalLost} kg
          </div>
          <div className="text-[10px] text-[#888888] font-medium">
            Total Weight Cut
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#141414] border border-[#222222] text-center space-y-1">
          <div className="w-9 h-9 mx-auto rounded-xl bg-[#1a1a1a] border border-purple-900/40 text-purple-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-lg font-bold text-white">
            Level 3
          </div>
          <div className="text-[10px] text-[#888888] font-medium">
            Vitality Champion
          </div>
        </div>
      </div>
    </div>
  );
};
