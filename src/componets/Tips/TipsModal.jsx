import React from "react";
import tips from "./Tips.json";
import { BsLightbulbFill } from "react-icons/bs";

const TipsModal = ({ id, onClose }) => {
  const tip = React.useMemo(() => tips.find((t) => t.id === id), [id]);

  const sections = React.useMemo(() => {
    if (!tip) return [];
    const byIndex = new Map();

    Object.keys(tip).forEach((k) => {
      let m = k.match(/^title(\d*)$/i);
      if (m) {
        const idx = m[1] || "";
        byIndex.set(idx, { ...(byIndex.get(idx) || {}), title: tip[k] });
        return;
      }
      m = k.match(/^description(\d*)$/i);
      if (m) {
        const idx = m[1] || "";
        byIndex.set(idx, { ...(byIndex.get(idx) || {}), description: tip[k] });
      }
    });

    const ordered = Array.from(byIndex.entries()).sort((a, b) => {
      const ai = a[0] === "" ? 1 : Number(a[0]);
      const bi = b[0] === "" ? 1 : Number(b[0]);
      return ai - bi;
    });

    return ordered.map(([, v]) => v).filter((s) => s.title || s.description);
  }, [tip]);

  return (
    <div
      id="modal"
      className="fixed inset-0 z-[1000] overflow-y-auto px-4 sm:px-6 lg:px-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tips-modal-title"
    >
      {/* Enhanced Backdrop with improved opacity */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />

      {/* Modal container with proper spacing and centering */}
      <div className="relative min-h-full flex items-center justify-center py-8">
        <div className="relative w-full max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95">
          {/* Enhanced Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-lg hover:shadow-xl border border-gray-200/50 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105 backdrop-blur-sm"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Content with improved scrolling */}
          <div className="max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {!tip ? (
              <div className="flex items-center justify-center min-h-[400px] p-8">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center text-4xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner border border-gray-200">
                    📝
                  </div>
                  <h3 className="text-gray-800 text-2xl font-semibold mb-3">
                    No tips found
                  </h3>
                  <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
                    The requested tip could not be found. Please check the tip
                    ID and try again.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-0">
                {/* Enhanced YouTube video section with increased height */}
                {tip.youtube_url && (
                  <div className="relative group">
                    <div className="relative w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
                      {/* Video container with significantly increased height */}
                      <div className="flex flex-col lg:flex-row min-h-[600px] lg:min-h-[700px]">
                        {/* Video iframe */}
                        <div className="w-full lg:w-3/5 relative">
                          <iframe
                            width="100%"
                            height="100%"
                            src={tip.youtube_url}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>

                        {/* Enhanced content panel */}
                        <div className="w-full lg:w-2/5 secondary-bg relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30" />
                          <div className="relative h-full flex flex-col justify-center p-8 lg:p-12 text-white">
                            <div className="space-y-6">
                              {/* Icon and title section */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-full bg-[var(--color2)]/20 flex items-center justify-center backdrop-blur-sm border border-[var(--color2)]/30">
                                    <BsLightbulbFill className="w-6 h-6 text-[var(--color2)]" />
                                  </div>
                                  <span className="text-sm font-medium opacity-80 tracking-wider uppercase">
                                    Pro Tip
                                  </span>
                                </div>

                                {tip?.header && (
                                  <h1
                                    id="tips-modal-title"
                                    className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white drop-shadow-lg"
                                  >
                                    {tip.header}
                                  </h1>
                                )}
                              </div>

                              {/* Decorative elements */}
                              <div className="flex items-center gap-2 opacity-60">
                                <div className="w-8 h-0.5 bg-[var(--color2)]" />
                                <div className="w-2 h-2 rounded-full bg-[var(--color2)]" />
                                <div className="w-4 h-0.5 bg-[var(--color2)]" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Content sections */}
                {sections.length > 0 && (
                  <div className="bg-gradient-to-b from-gray-50/50 to-white">
                    <div className="px-6 sm:px-8 lg:px-12 py-8 lg:py-12 space-y-6">
                      {sections.map((s, i) => (
                        <div
                          key={i}
                          className="relative group animate-in slide-in-from-bottom-4 duration-700"
                          style={{ animationDelay: `${i * 100}ms` }}
                        >
                          {/* Enhanced section card */}
                          <div className="relative bg-white rounded-2xl lg:rounded-3xl border border-gray-200/60 hover:border-gray-300/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-gray-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Section number - fixed size and positioning */}

                            {/* Left accent border - enhanced */}
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 secondary-bg opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Content with improved spacing and typography */}
                            <div className="relative pl-16 pr-8 py-8">
                              {s.title && (
                                <div className="flex items-start gap-4 mb-4">
                                  <div className=" w-6 h-6 secondary-bg rounded-full flex items-center justify-center text-white text-lg font-bold z-10 group-hover:scale-105 transition-all duration-300 shadow-lg border-4 border-white">
                                    {i + 1}
                                  </div>
                                  <h3 className="text-xl lg:text-2xl font-bold text-gray-800 leading-tight flex-1 break-words">
                                    {s.title}
                                  </h3>
                                  <div className="w-3 h-3 secondary-bg rounded-full flex-shrink-0 mt-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                              )}
                              {s.description && (
                                <div className="prose prose-gray max-w-none">
                                  <p className="text-gray-700 leading-relaxed text-base lg:text-lg break-words m-0 group-hover:text-gray-800 transition-colors duration-300">
                                    {s.description}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Subtle hover effect border */}
                            <div className="absolute inset-0 rounded-2xl lg:rounded-3xl border-2 border-transparent group-hover:border-[var(--color2)]/10 transition-colors duration-300 pointer-events-none" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipsModal;
