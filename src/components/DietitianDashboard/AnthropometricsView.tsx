import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
  ReferenceLine,
} from "recharts";
import { ClientProfile, AnthropometricRecord } from "../../types/nutrition";
import { SlidingDrawer } from "../SlidingDrawer";
import {
  Activity,
  TrendingDown,
  Scale,
  Percent,
  Ruler,
  Flame,
  Plus,
  Heart,
  CheckCircle,
  Calendar,
} from "lucide-react";

interface AnthropometricsViewProps {
  client: ClientProfile;
  onAddRecord: (record: AnthropometricRecord) => void;
}

export const AnthropometricsView: React.FC<AnthropometricsViewProps> = ({
  client,
  onAddRecord,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newWeight, setNewWeight] = useState(client.currentWeightKg.toString());
  const [newBodyFat, setNewBodyFat] = useState("24.0");
  const [newMuscleMass, setNewMuscleMass] = useState("25.0");
  const [newWaist, setNewWaist] = useState("73.0");
  const [newNotes, setNewNotes] = useState("");

  const records = client.records || [];

  // Mifflin-St Jeor Equation for BMR
  // Men: (10 x weight in kg) + (6.25 x height in cm) - (5 x age in years) + 5
  // Women: (10 x weight in kg) + (6.25 x height in cm) - (5 x age in years) - 161
  const heightM = client.heightCm / 100;
  const bmi = Number((client.currentWeightKg / (heightM * heightM)).toFixed(1));

  const isMale = client.gender === "Male";
  const bmr = Math.round(
    10 * client.currentWeightKg +
      6.25 * client.heightCm -
      5 * client.age +
      (isMale ? 5 : -161)
  );

  const palMultipliers: Record<string, number> = {
    Sedentary: 1.2,
    "Lightly Active": 1.375,
    "Moderately Active": 1.55,
    "Very Active": 1.725,
    "Extra Active": 1.9,
  };
  const tdee = Math.round(bmr * (palMultipliers[client.activityLevel] || 1.4));

  const totalWeightLost = Number((client.initialWeightKg - client.currentWeightKg).toFixed(1));

  const chartData = records.map((r) => ({
    date: r.date.slice(5),
    weight: r.weight,
    bodyFat: r.bodyFatPercentage || 0,
    muscleMass: r.muscleMassKg || 0,
    target: client.targetWeightKg,
  }));

  const handleSaveRecord = () => {
    const recordWeight = Number(newWeight) || client.currentWeightKg;
    const newRec: AnthropometricRecord = {
      id: `r-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      weight: recordWeight,
      bodyFatPercentage: Number(newBodyFat),
      muscleMassKg: Number(newMuscleMass),
      waistCircumferenceCm: Number(newWaist),
      bmi: Number((recordWeight / (heightM * heightM)).toFixed(1)),
      bmr,
      tdee,
      notes: newNotes,
    };
    onAddRecord(newRec);
    setIsAddModalOpen(false);
    setNewNotes("");
  };

  return (
    <div className="space-y-6">
      {/* Top Clinical Assessment Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#141414] border border-[#222222] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#888888] mb-1">
            <span className="font-semibold">Current Weight</span>
            <Scale className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {client.currentWeightKg} <span className="text-sm font-normal text-[#888888]">kg</span>
          </div>
          <div className="text-[11px] text-teal-400 font-semibold mt-1 flex items-center gap-1 font-mono">
            <TrendingDown className="w-3.5 h-3.5" />
            {totalWeightLost > 0 ? `-${totalWeightLost} kg since start` : `${Math.abs(totalWeightLost)} kg gain`}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#141414] border border-[#222222] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#888888] mb-1">
            <span className="font-semibold">BMI Classification</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {bmi} <span className="text-sm font-normal text-[#888888]">kg/m²</span>
          </div>
          <div className="text-[11px] font-semibold mt-1 text-blue-400">
            {bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal / Healthy Weight" : bmi < 30 ? "Overweight" : "Obese"}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#141414] border border-[#222222] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#888888] mb-1">
            <span className="font-semibold">Basal Metabolism (BMR)</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {bmr} <span className="text-sm font-normal text-[#888888]">kcal</span>
          </div>
          <div className="text-[11px] text-[#666666] mt-1">
            Mifflin-St Jeor standard
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#141414] border border-[#222222] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#888888] mb-1">
            <span className="font-semibold">Daily Energy (TDEE)</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {tdee} <span className="text-sm font-normal text-[#888888]">kcal</span>
          </div>
          <div className="text-[11px] text-[#666666] mt-1">
            PAL factor: {client.activityLevel}
          </div>
        </div>
      </div>

      {/* Recharts Trajectory Curves */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Evolution vs Target */}
        <div className="p-6 rounded-3xl bg-[#141414] border border-[#222222] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white text-base">
                Weight Evolution & Target
              </h4>
              <p className="text-xs text-[#888888] font-mono">
                Initial: {client.initialWeightKg}kg • Target: {client.targetWeightKg}kg
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#1a1a1a] text-teal-400 border border-teal-900/40 hover:bg-[#222222] rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Metric
            </button>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222222" opacity={0.8} />
                <XAxis dataKey="date" stroke="#666666" fontSize={11} />
                <YAxis domain={["dataMin - 2", "dataMax + 2"]} stroke="#666666" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#141414",
                    borderRadius: "12px",
                    border: "1px solid #262626",
                    color: "#ededed",
                    fontSize: "12px",
                  }}
                />
                <ReferenceLine
                  y={client.targetWeightKg}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  label={{ value: "Goal Target", fill: "#f59e0b", fontSize: 10, position: "top" }}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  name="Weight (kg)"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#weightGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Body Composition: Fat % vs Muscle Mass */}
        <div className="p-6 rounded-3xl bg-[#141414] border border-[#222222] shadow-xs space-y-4">
          <div>
            <h4 className="font-semibold text-white text-base">
              Body Composition Trajectory
            </h4>
            <p className="text-xs text-[#888888]">
              Body Fat Percentage (%) vs Lean Muscle Mass (kg)
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222222" opacity={0.8} />
                <XAxis dataKey="date" stroke="#666666" fontSize={11} />
                <YAxis stroke="#666666" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#141414",
                    borderRadius: "12px",
                    border: "1px solid #262626",
                    color: "#ededed",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Line
                  type="monotone"
                  dataKey="bodyFat"
                  name="Body Fat %"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="muscleMass"
                  name="Muscle Mass (kg)"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Historical Anthropometric Records Table */}
      <div className="p-6 rounded-3xl bg-[#141414] border border-[#222222] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-white text-base">
            Anthropometric Assessment History
          </h4>
          <span className="text-xs text-[#888888] font-mono">{records.length} total assessments</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#222222] text-[#666666] uppercase tracking-wider font-semibold">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Weight (kg)</th>
                <th className="py-3 px-3">BMI</th>
                <th className="py-3 px-3">Body Fat %</th>
                <th className="py-3 px-3">Muscle (kg)</th>
                <th className="py-3 px-3">Waist (cm)</th>
                <th className="py-3 px-3">BMR / TDEE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222] font-medium">
              {records.map((r, i) => (
                <tr key={r.id || i} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="py-3 px-3 text-white font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#666666]" />
                    {r.date}
                  </td>
                  <td className="py-3 px-3 text-teal-400 font-bold">
                    {r.weight} kg
                  </td>
                  <td className="py-3 px-3 text-[#ededed]">{r.bmi}</td>
                  <td className="py-3 px-3 text-rose-400">
                    {r.bodyFatPercentage ? `${r.bodyFatPercentage}%` : "—"}
                  </td>
                  <td className="py-3 px-3 text-blue-400">
                    {r.muscleMassKg ? `${r.muscleMassKg} kg` : "—"}
                  </td>
                  <td className="py-3 px-3 text-[#888888]">
                    {r.waistCircumferenceCm ? `${r.waistCircumferenceCm} cm` : "—"}
                  </td>
                  <td className="py-3 px-3 text-[#666666]">
                    {r.bmr} / {r.tdee} kcal
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Record Sliding Drawer */}
      <SlidingDrawer
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record New Anthropometric Assessment"
        subtitle={`Log clinical measurements for ${client.name}`}
        icon={<Scale className="w-5 h-5" />}
        width="md"
        footer={
          <button
            type="button"
            onClick={handleSaveRecord}
            id="save-anthropometric-record-btn"
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-md shadow-teal-950 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            Save Clinical Measurement
          </button>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#888888] mb-1">
              Body Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#222222] bg-[#141414] text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#888888] mb-1">
                Body Fat %
              </label>
              <input
                type="number"
                step="0.1"
                value={newBodyFat}
                onChange={(e) => setNewBodyFat(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#222222] bg-[#141414] text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#888888] mb-1">
                Muscle Mass (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={newMuscleMass}
                onChange={(e) => setNewMuscleMass(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#222222] bg-[#141414] text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#888888] mb-1">
              Waist Circumference (cm)
            </label>
            <input
              type="number"
              step="0.5"
              value={newWaist}
              onChange={(e) => setNewWaist(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#222222] bg-[#141414] text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#888888] mb-1">
              Clinical Assessment Notes
            </label>
            <textarea
              rows={3}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="e.g. Good muscle retention, noticeable reduction in abdominal circumference, high compliance."
              className="w-full px-3.5 py-2 rounded-xl border border-[#222222] bg-[#141414] text-xs text-[#ededed] placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>
      </SlidingDrawer>
    </div>
  );
};
