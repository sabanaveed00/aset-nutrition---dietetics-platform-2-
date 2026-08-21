import React, { useState } from "react";
import { Appointment, ClientProfile } from "../../types/nutrition";
import { SlidingDrawer } from "../SlidingDrawer";
import {
  Calendar,
  Clock,
  Video,
  User,
  Plus,
  CheckCircle,
  XCircle,
  FileText,
  Sparkles,
  Play,
} from "lucide-react";

interface AppointmentsManagerProps {
  appointments: Appointment[];
  clients: ClientProfile[];
  onAddAppointment: (apt: Appointment) => void;
  onUpdateStatus: (id: string, status: Appointment["status"]) => void;
}

export const AppointmentsManager: React.FC<AppointmentsManagerProps> = ({
  appointments,
  clients,
  onAddAppointment,
  onUpdateStatus,
}) => {
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [activeVideoCall, setActiveVideoCall] = useState<Appointment | null>(null);

  // New Appointment Form
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || "");
  const [aptDate, setAptDate] = useState("2026-08-27");
  const [aptTime, setAptTime] = useState("11:00");
  const [aptType, setAptType] = useState<Appointment["type"]>("Follow-up Check");
  const [aptDuration, setAptDuration] = useState("45");
  const [aptNotes, setAptNotes] = useState("");

  const handleCreateAppointment = () => {
    const targetClient = clients.find((c) => c.id === selectedClientId) || clients[0];
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      clientId: targetClient.id,
      clientName: targetClient.name,
      clientAvatar: targetClient.avatar,
      date: aptDate,
      time: aptTime,
      durationMinutes: Number(aptDuration) || 45,
      type: aptType,
      status: "Scheduled",
      notes: aptNotes || "Regular nutritional follow-up & meal plan optimization.",
      videoLink: `https://meet.google.com/aset-${targetClient.name.toLowerCase().replace(/\s+/g, "-")}`,
    };

    onAddAppointment(newApt);
    setIsBookModalOpen(false);
    setAptNotes("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#141414] border border-[#222222] shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-[#1a1a1a] text-teal-400 border border-teal-900/40">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Consultations & Appointments
            </h3>
            <p className="text-xs text-[#888888]">
              Schedule in-person & online telehealth video consultations
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsBookModalOpen(true)}
          id="book-new-appointment-btn"
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-teal-950 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Book Consultation
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {appointments.map((apt) => {
          const isScheduled = apt.status === "Scheduled";
          return (
            <div
              key={apt.id}
              className="p-5 rounded-3xl bg-[#141414] border border-[#222222] shadow-xs hover:border-[#333333] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={apt.clientAvatar}
                  alt={apt.clientName}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl object-cover ring-1 ring-teal-500/30"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white text-base">
                      {apt.clientName}
                    </h4>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                        apt.status === "Scheduled"
                          ? "bg-teal-950/60 text-teal-400 border border-teal-800/40 font-mono"
                          : apt.status === "Completed"
                          ? "bg-blue-950/60 text-blue-400 border border-blue-800/40 font-mono"
                          : "bg-[#1a1a1a] text-[#888888]"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#888888] mt-1 font-mono">
                    <span className="flex items-center gap-1 font-medium text-[#ededed]">
                      <Calendar className="w-3.5 h-3.5 text-teal-400" /> {apt.date}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-[#ededed]">
                      <Clock className="w-3.5 h-3.5 text-teal-400" /> {apt.time} ({apt.durationMinutes}m)
                    </span>
                    <span className="text-[#666666] font-sans">• {apt.type}</span>
                  </div>

                  {apt.notes && (
                    <p className="text-xs text-[#888888] mt-1.5 bg-[#1a1a1a] px-3 py-1.5 rounded-xl border border-white/5">
                      Note: {apt.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {isScheduled && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveVideoCall(apt)}
                      className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-md shadow-teal-950 cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      Launch Video Call
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(apt.id, "Completed")}
                      className="p-2 rounded-xl text-[#888888] hover:text-teal-400 hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                      title="Mark as Completed"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulated Telehealth Video Consultation Modal */}
      {activeVideoCall && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#0f0f0f] rounded-3xl overflow-hidden border border-[#222222] shadow-2xl flex flex-col">
            <div className="p-4 bg-[#141414] flex items-center justify-between border-b border-[#222222]">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-teal-400 animate-ping" />
                <div>
                  <h4 className="font-semibold text-white text-sm">
                    ASET Telehealth Consult • {activeVideoCall.clientName}
                  </h4>
                  <p className="text-[11px] text-[#888888]">
                    Encrypted Clinical Video Session (Active)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveVideoCall(null)}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                End Consultation
              </button>
            </div>

            {/* Video Canvas Simulation */}
            <div className="h-80 bg-[#050505] relative flex items-center justify-center">
              <img
                src={activeVideoCall.clientAvatar}
                alt={activeVideoCall.clientName}
                referrerPolicy="no-referrer"
                className="w-32 h-32 rounded-full object-cover ring-2 ring-teal-500 shadow-2xl"
              />
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-xl text-xs font-medium text-white border border-white/10">
                {activeVideoCall.clientName} (Client)
              </div>
              <div className="absolute bottom-4 right-4 bg-teal-600/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-xs font-semibold text-white">
                Dietitian Room (You)
              </div>
            </div>

            {/* Dietitian Notes Area inside Call */}
            <div className="p-4 bg-[#141414] border-t border-[#222222] flex items-center gap-3">
              <input
                type="text"
                placeholder="Log real-time clinical notes during consult..."
                className="flex-1 px-4 py-2.5 bg-[#0f0f0f] border border-[#222222] rounded-xl text-xs text-[#ededed] placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => {
                  onUpdateStatus(activeVideoCall.id, "Completed");
                  setActiveVideoCall(null);
                }}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Save & Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book New Consultation Slide-Over */}
      <SlidingDrawer
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Schedule Clinical Consultation"
        subtitle="Book appointment and send patient notification"
        icon={<Calendar className="w-5 h-5" />}
        width="md"
        footer={
          <button
            type="button"
            onClick={handleCreateAppointment}
            id="confirm-book-consult-btn"
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-md shadow-teal-950 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            Confirm Appointment
          </button>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#888888] mb-1">
              Select Patient
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#222222] bg-[#141414] text-sm text-[#ededed] focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.primaryGoal})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#888888] mb-1">
                Date
              </label>
              <input
                type="date"
                value={aptDate}
                onChange={(e) => setAptDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#222222] bg-[#141414] text-sm text-[#ededed] focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#888888] mb-1">
                Time
              </label>
              <input
                type="time"
                value={aptTime}
                onChange={(e) => setAptTime(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#222222] bg-[#141414] text-sm text-[#ededed] focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#888888] mb-1">
                Consultation Type
              </label>
              <select
                value={aptType}
                onChange={(e) => setAptType(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#222222] bg-[#141414] text-sm text-[#ededed] focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="Follow-up Check">Follow-up Check</option>
                <option value="Initial Assessment">Initial Assessment</option>
                <option value="Meal Plan Review">Meal Plan Review</option>
                <option value="Body Composition">Body Composition</option>
                <option value="Online Video Consult">Online Video Consult</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#888888] mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={aptDuration}
                onChange={(e) => setAptDuration(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#222222] bg-[#141414] text-sm text-[#ededed] focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#888888] mb-1">
              Consultation Goals & Preparation Notes
            </label>
            <textarea
              rows={3}
              value={aptNotes}
              onChange={(e) => setAptNotes(e.target.value)}
              placeholder="e.g. Review fasting blood glucose, adjust post-workout carbohydrates."
              className="w-full px-3.5 py-2 rounded-xl border border-[#222222] bg-[#141414] text-xs text-[#ededed] placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>
      </SlidingDrawer>
    </div>
  );
};
