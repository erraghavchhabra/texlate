import { NavLink, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Shield, CreditCard, Phone } from "lucide-react";

/* ---------------- TAB CONFIG ---------------- */

const tabs = [
    { name: "Security & Privacy", path: "security", icon: Shield },
    { name: "Billing & Payments", path: "billing", icon: CreditCard },
    { name: "Contact Us", path: "contact", icon: Phone },
];

/* ---------------- MAIN PAGE ---------------- */

export default function HelpCenter() {

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
                style={{ backgroundImage: "url('/assets/img/helpcenter-bg.jpg')" }}
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
                                            to={`/help/${tab.path}`}
                                            ref={el => (linkRefs.current[i] = el)}
                                            className={({ isActive }) =>
                                                `
                                                shadow-lg
                                                relative z-10 flex items-center gap-3 px-4 py-3 rounded-xl
                                                text-sm font-semibold whitespace-nowrap
                                                transition-colors duration-200
                                                ${isActive ? "bg-blue-600 text-white md:text-white" : "text-gray-600"}
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
                                <Route index element={<Navigate to="security" />} />
                                <Route path="security" element={<Security />} />
                                <Route path="billing" element={<Billing />} />
                                <Route path="contact" element={<Contact />} />
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

/* ---------------- SECURITY ---------------- */

const Security = () => (
    <div className="animate-slideUp">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Security & Privacy</h1>

        <Block title="1. Data Protection">
            We use encryption and secure servers to protect your information.
        </Block>

        <Block title="2. Privacy Commitment">
            Your personal data is never shared with third parties without consent.
        </Block>

        <Block title="3. Account Safety">
            Enable two-factor authentication for enhanced security.
        </Block>
    </div>
);

/* ---------------- BILLING ---------------- */

const Billing = () => (
    <div className="animate-slideUp">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Billing & Payments</h1>

        <Block title="1. Payment Methods">
            We accept credit cards, debit cards, and secure online payment gateways.
        </Block>

        <Block title="2. Invoices">
            Detailed invoices are available in your account dashboard.
        </Block>

        <Block title="3. Refunds">
            Refunds are processed within 5–7 business days after approval.
        </Block>
    </div>
);

/* ---------------- CONTACT ---------------- */

const Contact = () => (
    <div className="animate-slideUp">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Contact Us</h1>

        <Block title="1. Support Channels">
            Reach us via email, live chat, or phone support.
        </Block>

        <Block title="2. Response Time">
            Our team typically responds within 24 hours.
        </Block>

        <Block title="3. Feedback">
            We welcome your suggestions to improve our services.
        </Block>
    </div>
);
