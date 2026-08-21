import React, { useState } from "react";
import { ClientProfile } from "../../types/nutrition";
import { SlidingDrawer } from "../SlidingDrawer";
import {
  Users,
  Search,
  Plus,
  ArrowRight,
  Flame,
  Award,
  Calendar,
  Heart,
  CheckCircle,
  Activity,
  AlertCircle,
  Mail,
  Phone,
} from "lucide-react";

interface ClientDirectoryProps {
  clients: ClientProfile[];
  activeClient: ClientProfile;
  onSelectClient: (client: ClientProfile) => void;
  onAddClient: (client: ClientProfile) => void;
}

export const ClientDirectory: React.FC<ClientDirectoryProps> = ({
  clients,
  activeClient,
  onSelectClient,
  onAddClient,
}) => {
  const [search, setSearch] = useState("");
  const [filterGoal, setFilterGoal] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inspectClient, setInspectClient] = useState<ClientProfile | null>(null);

  // New Client Form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAge, setNewAge] = useState("28");
  const [newGender, setNewGender] = useState<"Female" | "Male" | "Other">("Female");
  const [newHeight, setNewHeight] = useState("165");
  const [newWeight, setNewWeight] = useState("65");
  const [newTargetWeight, setNewTargetWeight] = useState("60");
  const [newGoal, setNewGoal] = useState<ClientProfile["primaryGoal"]>("Weight Loss");
  const [newPattern, setNewPattern] = useState<ClientProfile["dietaryPattern"]>("Mediterranean");

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesGoal = filterGoal === "All" || c.primaryGoal === filterGoal;
    return matchesSearch && matchesGoal;
  });

  const handleCreateClient = () => {
    if (!newName.trim()) return;
    const weightNum = Number(newWeight) || 65;
    const heightNum = Number(newHeight) || 165;
    const heightM = heightNum / 100;
    const bmi = Number((weightNum / (heightM * heightM)).toFixed(1));

    const newClient: ClientProfile = {
      id: `c-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      phone: newPhone.trim() || "+1 (555) 000-1122",
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
      age: Number(newAge) || 28,
      gender: newGender,
      heightCm: heightNum,
      currentWeightKg: weightNum,
      targetWeightKg: Number(newTargetWeight) || 60,
      initialWeightKg: weightNum,
      activityLevel: "Moderately Active",
      primaryGoal: newGoal,
      allergies: [],
      foodDislikes: [],
      medicalConditions: [],
      dietaryPattern: newPattern,
      adherenceRate: 100,
      streakDays: 1,
      joinDate: new Date().toISOString().split("T")[0],
      activeMealPlanId: "mp-1",
      waterTargetMl: 2500,
      records: [
        {
          id: `r-${Date.now()}`,
          date: new Date().toISOString().split("T")[0],
          weight: weightNum,
          bodyFatPercentage: 26.0,
          muscleMassKg: 24.0,
          bmi,
          bmr: 1420,
          tdee: 2050,
        },
      ],
    };

    onAddClient(newClient);
    onSelectClient(newClient);
    setIsAddModalOpen(false);
    setNewName("");
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#141414] border border-[#222222] shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-[#1a1a1a] text-teal-400 border border-teal-900/40">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Patient & Client Directory
            </h3>
            <p className="text-xs text-[#888888]">
              Manage clinical records, nutritional adherence & appointments
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          id="add-new-client-btn"
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-teal-950 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Register New Patient
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient name, email, dietary goal..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#222222] bg-[#141414] text-[#ededed] placeholder-[#666666] text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <select
          value={filterGoal}
          onChange={(e) => setFilterGoal(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl border border-[#222222] bg-[#141414] text-sm text-[#ededed] focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="All">All Health Goals</option>
          <option value="Weight Loss">Weight Loss</option>
          <option value="Muscle Hypertrophy">Muscle Hypertrophy</option>
          <option value="PCOS Management">PCOS Management</option>
          <option value="Heart Health">Heart Health</option>
        </select>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClients.map((c) => {
          const isSelected = activeClient.id === c.id;

          return (
            <div
              key={c.id}
              onClick={() => onSelectClient(c)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer select-none space-y-4 ${
                isSelected
                  ? "border-teal-500/80 bg-[#141414] shadow-lg shadow-teal-950/40 ring-1 ring-teal-500/30"
                  : "border-[#222222] bg-[#141414] hover:border-[#333333] shadow-xs"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    referrerPolicy="no-referrer"
                    className="w-13 h-13 rounded-2xl object-cover ring-1 ring-teal-500/30"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white text-base">
                        {c.name}
                      </h4>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-md bg-teal-500 text-black text-[10px] font-bold">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#888888]">
                      {c.age} yrs • {c.gender} • {c.dietaryPattern}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInspectClient(c);
                  }}
                  className="p-2 rounded-xl text-[#888888] hover:text-teal-400 hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                  title="View full clinical details"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Badges & Metrics Row */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-[#222222]">
                <div className="p-2.5 rounded-xl bg-[#1a1a1a] border border-white/5">
                  <div className="text-[10px] text-[#888888]">Weight</div>
                  <div className="text-xs font-bold text-white font-mono">
                    {c.currentWeightKg} kg
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#1a1a1a] border border-white/5">
                  <div className="text-[10px] text-[#888888]">Plan Adherence</div>
                  <div className="text-xs font-bold text-teal-400 font-mono">
                    {c.adherenceRate}%
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#1a1a1a] border border-white/5">
                  <div className="text-[10px] text-[#888888]">Goal Target</div>
                  <div className="text-xs font-bold text-blue-400 font-mono">
                    {c.targetWeightKg} kg
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#888888] pt-1">
                <span className="inline-flex items-center gap-1 text-[#ededed] font-medium">
                  <Heart className="w-3 h-3 text-rose-500" /> {c.primaryGoal}
                </span>
                <span className="flex items-center gap-1 font-semibold text-teal-400 font-mono">
                  <Award className="w-3.5 h-3.5" /> {c.streakDays} Day Streak
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Client Full Profile Slide-Over */}
      <SlidingDrawer
        isOpen={!!inspectClient}
        onClose={() => setInspectClient(null)}
        title={inspectClient?.name || "Client Clinical Record"}
        subtitle="Comprehensive Nutritional & Anthropometric Assessment"
        icon={<Activity className="w-5 h-5" />}
        width="lg"
      >
        {inspectClient && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#141414] border border-[#222222]">
              <img
                src={inspectClient.avatar}
                alt={inspectClient.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover ring-1 ring-teal-500/30"
              />
              <div className="space-y-1">
                <h4 className="font-semibold text-lg text-white">
                  {inspectClient.name}
                </h4>
                <div className="text-xs text-[#888888] flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-teal-400" /> {inspectClient.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-teal-400" /> {inspectClient.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-950/60 text-teal-400 border border-teal-800/40 text-xs font-semibold">
                    {inspectClient.primaryGoal}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-950/60 text-blue-400 border border-blue-800/40 text-xs font-semibold">
                    {inspectClient.dietaryPattern}
                  </span>
                </div>
              </div>
            </div>

            {/* Allergies & Conditions */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#141414] border border-rose-900/40">
                <div className="text-xs font-semibold text-rose-400 flex items-center gap-1 mb-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Food Allergies & Intolerances
                </div>
                <div className="text-xs text-[#ededed]">
                  {inspectClient.allergies.length ? inspectClient.allergies.join(", ") : "No allergies recorded"}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#141414] border border-amber-900/40">
                <div className="text-xs font-semibold text-amber-400 flex items-center gap-1 mb-1">
                  <Activity className="w-3.5 h-3.5" /> Medical Conditions
                </div>
                <div className="text-xs text-[#ededed]">
                  {inspectClient.medicalConditions.length ? inspectClient.medicalConditions.join(", ") : "None reported"}
                </div>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="p-4 rounded-2xl bg-[#141414] border border-[#222222] space-y-3">
              <h5 className="font-semibold text-white text-sm">
                Anthropometric Baseline
              </h5>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-[#1a1a1a] border border-white/5">
                  <div className="text-[10px] text-[#888888]">Height</div>
                  <div className="text-sm font-bold text-white font-mono">
                    {inspectClient.heightCm} cm
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#1a1a1a] border border-white/5">
                  <div className="text-[10px] text-[#888888]">Current Weight</div>
                  <div className="text-sm font-bold text-teal-400 font-mono">
                    {inspectClient.currentWeightKg} kg
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#1a1a1a] border border-white/5">
                  <div className="text-[10px] text-[#888888]">Target Weight</div>
                  <div className="text-sm font-bold text-blue-400 font-mono">
                    {inspectClient.targetWeightKg} kg
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </SlidingDrawer>

      {/* Add New Client Slide-Over */}
      <SlidingDrawer
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Patient / Client"
        subtitle="Create clinical profile and baseline anthropometrics"
        icon={<Plus className="w-5 h-5" />}
        width="md"
        footer={
          <button
            type="button"
            onClick={handleCreateClient}
            id="save-new-patient-btn"
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-md shadow-teal-950 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            Complete Registration
          </button>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#888888] mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Jessica Taylor"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#222222] bg-[#141414] text-sm text-[#ededed] placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#888888] mb-1">
                Age
              </label>
              <input
                type="number"
                value={newAge}
                onChange={(e) => setNewAge(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#222222] bg-[#141414] text-sm text-[#ededed] focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#888888] mb-1">
                Gender
              </label>
              <select
                value={newGender}
                onChange={(e) => setNewGender(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#222222] bg-[#141414] text-sm text-[#ededed] focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-[#888888] mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                value={newHeight}
                onChange={(e) => setNewHeight(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#222222] bg-[#141414] text-sm text-[#ededed] focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#888888] mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#222222] bg-[#141414] text-sm text-[#ededed] focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#888888] mb-1">
                Target (kg)
              </label>
              <input
                type="number"
                value={newTargetWeight}
                onChange={(e) => setNewTargetWeight(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#222222] bg-[#141414] text-sm text-[#ededed] focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#888888] mb-1">
              Primary Goal
            </label>
            <select
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value as any)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#222222] bg-[#141414] text-sm text-[#ededed] focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="Weight Loss">Weight Loss & Fat Reduction</option>
              <option value="Muscle Hypertrophy">Muscle Hypertrophy & Athletic</option>
              <option value="PCOS Management">PCOS & Insulin Management</option>
              <option value="Heart Health">Heart Health & Low Sodium</option>
            </select>
          </div>
        </div>
      </SlidingDrawer>
    </div>
  );
};
