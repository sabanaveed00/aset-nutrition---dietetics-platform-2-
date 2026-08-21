import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  Award,
} from "lucide-react";

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: "t1",
      name: "Marcus Vance",
      role: "Corporate Executive & Marathon Runner",
      result: "Lost 14.5 kg & Halved Visceral Fat",
      metric: "-14.5 kg in 16 weeks",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      quote: "ASET completely transformed how I fuel my body. Instead of crashing on extreme calorie deficits, my dietitian set up progressive carbohydrate cycling that gave me endless energy while melting body fat.",
      dietitianName: "Dr. Elena Rostova, PhD, RD",
      rating: 5,
    },
    {
      id: "t2",
      name: "Sophia Chen",
      role: "Software Architect",
      result: "Reversed Pre-Diabetes & Normalized Insulin",
      metric: "HbA1c down from 6.8% to 5.3%",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      quote: "The AI meal scanner and interactive water tracker kept me honest every single day. I could message my dietitian inside the app, and she swapped my inflammatory ingredients in seconds.",
      dietitianName: "Amy Smith, RD, CDN",
      rating: 5,
    },
    {
      id: "t3",
      name: "David Miller",
      role: "CrossFit Athlete",
      result: "Gained 6.2 kg Lean Muscle",
      metric: "+6.2 kg Lean Mass",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      quote: "Having the Mifflin-St Jeor TDEE engine and precise clinical macro breakdowns made progressive muscle hypertrophy foolproof. The recipe book is filled with genuinely delicious meals.",
      dietitianName: "Dr. Michael Sterling, CSSD",
      rating: 5,
    },
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0));
  };

  const activeTestimonial = testimonials[currentIndex];

  return (
    <section
      id="testimonials-section"
      className="py-8 sm:py-12 bg-slate-50 dark:bg-[#0a0a0a] border-t border-slate-200/80 dark:border-[#222222] transition-colors overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real Patient Transformations</span>
          </div>
          <h2 className="text-2.5xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Loved by patients, trusted by registered dietitians.
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-[#888888]">
            See how individuals achieved sustained health results using ASET’s clinical tools.
          </p>
        </div>

        {/* Carousel Card */}
        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#222222] shadow-xl p-8 sm:p-12 relative overflow-hidden"
            >
              <Quote className="w-20 h-20 text-teal-500/10 dark:text-teal-400/5 absolute right-6 bottom-6 pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-[#222222]">
                <div className="flex items-center gap-4">
                  <img
                    src={activeTestimonial.avatar}
                    alt={activeTestimonial.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                      {activeTestimonial.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#888888]">
                      {activeTestimonial.role}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-amber-400">
                      {[...Array(activeTestimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Metric Badge */}
                <div className="px-4 py-2 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-right">
                  <span className="text-[10px] uppercase tracking-wider font-bold block text-teal-600 dark:text-teal-400">
                    Verified Outcome
                  </span>
                  <span className="text-sm font-extrabold font-mono">
                    {activeTestimonial.metric}
                  </span>
                </div>
              </div>

              {/* Quote */}
              <p className="mt-6 text-base sm:text-lg text-slate-700 dark:text-[#d4d4d8] leading-relaxed italic font-normal">
                "{activeTestimonial.quote}"
              </p>

              {/* Endorsement Footnote */}
              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-[#222222] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-[#888888]">
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-teal-500" />
                  <span>Clinical Dietitian Supervisor: <strong className="text-slate-900 dark:text-white">{activeTestimonial.dietitianName}</strong></span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[11px]">
                  <span>{currentIndex + 1} of {testimonials.length} Stories</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Testimonial"
              className="p-3 rounded-2xl bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#262626] text-slate-700 dark:text-white shadow-md hover:border-teal-500 hover:scale-105 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx
                      ? "w-8 bg-teal-500"
                      : "w-2.5 bg-slate-300 dark:bg-[#333333]"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Testimonial"
              className="p-3 rounded-2xl bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#262626] text-slate-700 dark:text-white shadow-md hover:border-teal-500 hover:scale-105 transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
