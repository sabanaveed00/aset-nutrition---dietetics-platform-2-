import React, { useState } from "react";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Calendar,
  Search,
  CheckCircle2,
  Navigation,
  Globe2,
  Stethoscope,
  ArrowRight,
} from "lucide-react";

interface ClinicLocationsProps {
  onOpenAuth: (mode?: "login" | "signup") => void;
}

export function ClinicLocations({ onOpenAuth }: ClinicLocationsProps) {
  const [selectedLocationId, setSelectedLocationId] = useState("loc-1");
  const [searchFilter, setSearchFilter] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const locations = [
    {
      id: "loc-1",
      city: "New York",
      name: "ASET Manhattan Clinical Center",
      address: "645 5th Ave, Suite 1200, New York, NY 10022",
      leadDietitian: "Dr. Elena Rostova, PhD, RD",
      phone: "+1 (212) 555-0198",
      email: "ny-clinic@aset-nutrition.com",
      hours: "Mon - Fri: 8:00 AM - 7:00 PM • Sat: 9:00 AM - 2:00 PM",
      services: ["Clinical Anthropometrics", "Metabolic Cart Testing", "Pediatric & Prenatal Nutrition", "Sports Dietetics"],
      lat: "40.758896",
      lng: "-73.976451",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "loc-2",
      city: "San Francisco",
      name: "ASET Bay Area Metabolic Institute",
      address: "450 Sutter St, Suite 840, San Francisco, CA 94108",
      leadDietitian: "Amy Smith, RD, CDN",
      phone: "+1 (415) 555-0144",
      email: "sf-clinic@aset-nutrition.com",
      hours: "Mon - Fri: 8:30 AM - 6:30 PM",
      services: ["Continuous Glucose Monitoring (CGM)", "Lipid & Insulin Protocols", "Plant-Based Transition", "Executive Wellness"],
      lat: "37.7898",
      lng: "-122.4080",
      image: "https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "loc-3",
      city: "London",
      name: "ASET Harley Street Health Pavilion",
      address: "10 Harley Street, Marylebone, London W1G 9PF",
      leadDietitian: "Marcus Sterling, MSc, RD",
      phone: "+44 20 7946 0912",
      email: "london-clinic@aset-nutrition.com",
      hours: "Mon - Fri: 9:00 AM - 6:00 PM",
      services: ["IBS & Microbiome Sequencing", "Nutrigenomics", "Longevity Protocols", "Eating Disorder Recovery"],
      lat: "51.5173",
      lng: "-0.1472",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "loc-4",
      city: "Sydney",
      name: "ASET Sydney Dietetics & Vitality Center",
      address: "200 George St, Level 14, Sydney NSW 2000",
      leadDietitian: "Dr. Chloe Martin, APD",
      phone: "+61 2 9374 4000",
      email: "sydney-clinic@aset-nutrition.com",
      hours: "Mon - Fri: 8:00 AM - 5:30 PM",
      services: ["Endurance Sports Fueling", "Body Composition DEXA", "Bariatric Nutrition", "Anti-Inflammatory Care"],
      lat: "-33.8634",
      lng: "151.2084",
      image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "loc-5",
      city: "Global Telehealth",
      name: "ASET Virtual Tele-Nutrition Network",
      address: "100% Online HD Encrypted Consultations across 40+ countries",
      leadDietitian: "Multilingual Certified Dietitian Panel (24/7)",
      phone: "+1 (800) 555-ASET",
      email: "telehealth@aset-nutrition.com",
      hours: "Available 24 hours / 7 days a week",
      services: ["Instant Video Consultations", "Real-Time Food Diary Review", "Digital Prescription Sync", "At-Home Blood Biomarkers"],
      lat: "0.0",
      lng: "0.0",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const filteredLocations = locations.filter(
    (loc) =>
      loc.city.toLowerCase().includes(searchFilter.toLowerCase()) ||
      loc.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const activeLoc =
    locations.find((l) => l.id === selectedLocationId) || locations[0];

  const handleBook = () => {
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 3000);
  };

  return (
    <section
      id="locations-section"
      className="py-8 sm:py-12 bg-white dark:bg-[#0d0d0d] border-t border-slate-200/80 dark:border-[#1e1e1e] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 text-xs font-bold mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Global Dietetics Network</span>
          </div>
          <h2 className="text-2.5xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Find an ASET Clinic or Connect via Telehealth
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-[#888888]">
            Visit one of our state-of-the-art physical facilities or schedule a digital consultation from the comfort of home.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Location List & Search */}
          <div className="lg:col-span-5 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search city, clinic name, or address..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#262626] bg-slate-50 dark:bg-[#141414] text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Location Cards */}
            <div className="space-y-3 max-h-[520px] overflow-y-auto custom-scrollbar pr-1">
              {filteredLocations.map((loc) => {
                const isSelected = loc.id === activeLoc.id;
                return (
                  <div
                    key={loc.id}
                    onClick={() => setSelectedLocationId(loc.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-teal-50/80 dark:bg-teal-950/40 border-teal-500 ring-2 ring-teal-500/20 shadow-md"
                        : "bg-slate-50 dark:bg-[#141414] border-slate-200 dark:border-[#222222] hover:border-teal-400 dark:hover:border-teal-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 font-mono">
                          {loc.city}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                          {loc.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-[#888888] mt-1 line-clamp-1">
                          {loc.address}
                        </p>
                      </div>

                      <div
                        className={`p-2 rounded-xl shrink-0 ${
                          isSelected
                            ? "bg-teal-600 text-white"
                            : "bg-slate-200 dark:bg-[#222222] text-slate-600 dark:text-[#888888]"
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Location Detailed View & Interactive Visual Map */}
          <div className="lg:col-span-7 rounded-3xl bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#222222] overflow-hidden shadow-xl flex flex-col justify-between">
            {/* Visual Simulated Map / Clinic Banner */}
            <div className="relative aspect-16/8 sm:aspect-16/7 w-full overflow-hidden bg-slate-800">
              <img
                src={activeLoc.image}
                alt={activeLoc.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6">
                <div>
                  <span className="text-xs font-bold text-teal-300 uppercase tracking-widest font-mono">
                    {activeLoc.city} Facility
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-1">
                    {activeLoc.name}
                  </h3>
                </div>
              </div>
            </div>

            {/* Details Content */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#888888] font-semibold">
                    <Navigation className="w-3.5 h-3.5 text-teal-500" />
                    <span>Physical Address</span>
                  </div>
                  <p className="text-slate-900 dark:text-[#ededed] font-medium leading-relaxed">
                    {activeLoc.address}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#888888] font-semibold">
                    <Clock className="w-3.5 h-3.5 text-teal-500" />
                    <span>Operating Hours</span>
                  </div>
                  <p className="text-slate-900 dark:text-[#ededed] font-medium leading-relaxed">
                    {activeLoc.hours}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#888888] font-semibold">
                    <Stethoscope className="w-3.5 h-3.5 text-teal-500" />
                    <span>Clinical Lead</span>
                  </div>
                  <p className="text-slate-900 dark:text-[#ededed] font-medium">
                    {activeLoc.leadDietitian}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#888888] font-semibold">
                    <Phone className="w-3.5 h-3.5 text-teal-500" />
                    <span>Direct Inquiries</span>
                  </div>
                  <p className="text-slate-900 dark:text-[#ededed] font-mono font-medium">
                    {activeLoc.phone}
                  </p>
                </div>
              </div>

              {/* Clinical Services Provided */}
              <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-[#222222]">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Available Clinical Services
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeLoc.services.map((srv, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking CTA Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleBook}
                  className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm transition-all shadow-md shadow-teal-950 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book In-Person or Telehealth Appointment at {activeLoc.city}</span>
                </button>

                {bookingSuccess && (
                  <div className="mt-3 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-800 text-teal-900 dark:text-teal-200 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-500" />
                    Appointment requested! An ASET clinical coordinator will confirm via email.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
