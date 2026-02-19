import { NavLink, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Shield, FileText, RotateCcw, AlertTriangle } from "lucide-react";

/* ---------------- TAB CONFIG ---------------- */

const tabs = [
    { name: "Privacy Policy", path: "privacy", icon: Shield },
    { name: "Terms & Conditions", path: "terms", icon: FileText },
    { name: "Refund Policy", path: "refund", icon: RotateCcw },
    { name: "Disclaimer", path: "disclaimer", icon: AlertTriangle },
];

/* ---------------- MAIN PAGE ---------------- */

export default function Legal() {

    const location = useLocation();
    const indicatorRef = useRef(null);
    const linkRefs = useRef([]);
    const containerRef = useRef(null);

    /* ---- MOVE INDICATOR (DESKTOP ONLY) ---- */
    const moveIndicator = () => {
        const activeIndex = tabs.findIndex(tab =>
            location.pathname.includes(tab.path)
        );

        const activeEl = linkRefs.current[activeIndex];
        const indicator = indicatorRef.current;

        if (!activeEl || !indicator) return;

        const isMobile = window.innerWidth < 768;

        if (!isMobile) {
            /* Vertical pill highlight (desktop only) */
            indicator.style.width = `calc(100% - 2rem)`;
            indicator.style.height = `${activeEl.offsetHeight}px`;
            indicator.style.transform = `translateY(${activeEl.offsetTop}px)`;
        } else {
            /* Hide indicator on mobile */
            indicator.style.width = `0px`;
            indicator.style.height = `0px`;
            indicator.style.transform = `none`;
        }
    };

    useEffect(() => {
        moveIndicator();
        window.addEventListener("resize", moveIndicator);
        return () => window.removeEventListener("resize", moveIndicator);
    }, [location]);

    return (
        <div className="relative min-h-screen mt-16 mb-16 py-16 px-4 overflow-hidden">

            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/assets/img/legal-bg.jpg')" }}
            />
            <div className="max-w-7xl mx-auto">

                <div className="flex flex-col md:flex-row gap-8">

                    {/* ================= LEFT SIDEBAR ================= */}
                    <div className="md:w-1/4">
                        <div
                            ref={containerRef}
                            className="relative bg-white/60 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-4"
                        >

                            {/* Sliding Background (desktop only) */}
                            <span
                                ref={indicatorRef}
                                className="
                                    hidden md:block
                                    absolute left-4 top-0
                                    rounded-xl bg-blue-600
                                    transition-all duration-300 ease-out
                                    z-0
                                "
                            />

                            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible no-scrollbar">

                                {tabs.map((tab, i) => {
                                    const Icon = tab.icon;

                                    return (
                                        <NavLink
                                            key={tab.path}
                                            to={`/legal/${tab.path}`}
                                            ref={el => (linkRefs.current[i] = el)}
                                            className={({ isActive }) =>
                                                `
                                                shadow-lg
                                                relative z-10 flex items-center gap-3 px-4 py-3 rounded-xl
                                                text-sm font-semibold whitespace-nowrap
                                                transition-colors duration-200
                                                ${isActive ? "bg-blue-600 shadow-lg text-white md:text-white" : "text-gray-600"}
                                                `
                                            }
                                        >
                                            <Icon size={18} />
                                            {tab.name}
                                        </NavLink>
                                    );
                                })}

                            </div>
                        </div>
                    </div>

                    {/* ================= RIGHT CONTENT ================= */}
                    <div className="flex-1">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 md:p-10">

                            <Routes>
                                <Route index element={<Navigate to="privacy" />} />
                                <Route path="privacy" element={<Privacy />} />
                                <Route path="terms" element={<Terms />} />
                                <Route path="refund" element={<Refund />} />
                                <Route path="disclaimer" element={<Disclaimer />} />
                            </Routes>

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}


/* ---------------- REUSABLE BLOCK ---------------- */

const Block = ({ title, children }) => (
    <div className="rounded-2xl border border-gray-200 bg-white/60 backdrop-blur-md p-6 md:p-7 shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
        <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
    </div>
);

/* ---------------- PRIVACY ---------------- */

const Privacy = () => (
    <div className="animate-slideUp">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Privacy Policy</h1>

        <Block title="1. Introduction">
            Texlate is committed to protecting your privacy and document confidentiality.
        </Block>

        <Block title="2. Information We Collect">
            Documents uploaded, payment confirmations, and anonymous usage analytics.
        </Block>

        <Block title="3. Data Retention">
            Files are automatically deleted after the 4-hour download window.
        </Block>
    </div>
);

/* ---------------- OTHER PAGES ---------------- */

const Terms = () => <div className="animate-slideUp"><h1 className="text-2xl font-semibold">Terms & Conditions</h1></div>;
const Refund = () => <div className="animate-slideUp"><h1 className="text-2xl font-semibold">Refund Policy</h1></div>;
const Disclaimer = () => <div className="animate-slideUp"><h1 className="text-2xl font-semibold">Disclaimer</h1></div>;
