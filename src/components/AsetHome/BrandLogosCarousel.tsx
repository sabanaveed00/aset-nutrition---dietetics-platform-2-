import React from "react";

export function BrandLogosCarousel() {
  const brandLogos = [
    {
      name: "randstad",
      render: (
        <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
          <svg className="w-6 h-6 text-slate-700 dark:text-slate-200" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 18V8a4 4 0 0 1 8 0v10h-2V8a2 2 0 0 0-4 0v10H4zm10 0V8a4 4 0 0 1 8 0v10h-2V8a2 2 0 0 0-4 0v10h-2z" />
          </svg>
          <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-slate-100 lowercase font-sans">
            randstad
          </span>
        </div>
      ),
    },
    {
      name: "sodexo",
      render: (
        <div className="flex items-center gap-0.5 opacity-80 hover:opacity-100 transition-opacity">
          <span className="font-extrabold text-xl tracking-tight text-slate-800 dark:text-slate-100 font-sans lowercase">
            sodexo
          </span>
          <span className="text-amber-500 font-black text-xl -mt-1.5">*</span>
        </div>
      ),
    },
    {
      name: "aon",
      render: (
        <div className="flex items-center opacity-80 hover:opacity-100 transition-opacity">
          <span className="font-black text-2xl tracking-tighter text-slate-800 dark:text-slate-100 font-sans">
            AON
          </span>
        </div>
      ),
    },
    {
      name: "edenred",
      render: (
        <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
          <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white text-[10px] font-black">
            e
          </div>
          <span className="font-bold text-base tracking-tight text-slate-800 dark:text-slate-100 font-sans">
            Edenred
          </span>
        </div>
      ),
    },
    {
      name: "walgreens",
      render: (
        <div className="flex items-center opacity-80 hover:opacity-100 transition-opacity">
          <span className="font-serif italic font-bold text-2xl text-slate-800 dark:text-slate-100">
            W
          </span>
        </div>
      ),
    },
    {
      name: "danone",
      render: (
        <div className="flex items-center opacity-80 hover:opacity-100 transition-opacity">
          <span className="font-black text-lg tracking-widest text-slate-800 dark:text-slate-100 uppercase font-sans">
            DANONE
          </span>
        </div>
      ),
    },
    {
      name: "nestle",
      render: (
        <div className="flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
          <span className="font-extrabold text-base text-slate-800 dark:text-slate-100 font-sans">
            Nestlé
          </span>
          <span className="text-[11px] font-semibold text-slate-500 uppercase">
            Health
          </span>
        </div>
      ),
    },
  ];

  // Infinite duplicate list for smooth seamless ticker
  const duplicatedLogos = [...brandLogos, ...brandLogos, ...brandLogos, ...brandLogos];

  return (
    <section
      id="brand-carousel"
      className="w-full bg-[#eef8fa] dark:bg-[#0b1416] py-5 sm:py-7 border-b border-teal-900/10 dark:border-teal-900/20 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left Title matching screenshot exactly */}
          <div className="shrink-0 max-w-xs sm:max-w-sm">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug tracking-tight">
              The choice of companies and
              <span className="block">institutions worldwide</span>
            </h2>
          </div>

          {/* Right Scrolling Carousel Container */}
          <div className="flex-1 overflow-hidden relative mask-gradient">
            {/* Left and Right Edge Soft Gradient Fades */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#eef8fa] dark:from-[#0b1416] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#eef8fa] dark:from-[#0b1416] to-transparent z-10 pointer-events-none" />

            <div className="flex items-center gap-10 sm:gap-14 animate-marquee py-2 whitespace-nowrap">
              {duplicatedLogos.map((item, idx) => (
                <div
                  key={`${item.name}-${idx}`}
                  className="shrink-0 flex items-center justify-center cursor-pointer select-none"
                >
                  {item.render}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
