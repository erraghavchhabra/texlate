import React from "react";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

/* ======================
   Data
====================== */

const features = [
  "Fast and instant PDF translator (Seconds)",
  "Cost-effective translator (Low fixed rates)",
  "Layout preserving translator (Keeps format)",
  "Supports Hindi, Marathi, Telugu, Bengali & more",
  "Smart PDF translator for FIRs/Records",
];

/* ======================
   Animations
====================== */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const glowFloat = {
  initial: { y: 0 },
  animate: {
    y: [-4, 4, -4],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/* ======================
   Component
====================== */

const WhyChooseUs = () => {
  return (
    <section
  className="
    relative w-full
    min-h-screen lg:h-screen
    py-20 lg:py-28
    text-white
    bg-gradient-to-b from-[#05070a] via-[#080b12] to-[#05070a]
    overflow-hidden lg:overflow-hidden
  "
>
      {/* Background Grid */}
      <div
        className="
          absolute inset-0 opacity-[0.06]
          [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)]
          [background-size:32px_32px]
          pointer-events-none
        "
      />

      {/* Ambient Glow */}
      <motion.div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-600/10 blur-[140px] rounded-full"
        variants={glowFloat}
        initial="initial"
        animate="animate"
      />

      <div className="relative max-w-7xl mx-auto px-4">

        {/* Heading */}
        <motion.div
          className="text-center mb-20"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-semibold mb-3 big-h">
            Why choose us?
          </h2>
        </motion.div>

        {/* Table */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start text-[14px]"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >

          {/* Features Column */}
          <motion.div variants={fadeUp}>
            <h3 className="text-lg text-slate-400 mb-6">Features</h3>
            <ul className="space-y-4">
              {[
                "Speed",
                "Cost",
                "Layout & Formatting",
                "Input Language",
                "Legal Precision",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  variants={fadeUp}
                  className="border-b border-white/10 pb-4 text-slate-300"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Human Translation */}
          <motion.div variants={fadeUp}>
            <h3 className="text-lg text-slate-400 mb-6">
              Human Translation
            </h3>

            <motion.ul variants={stagger} className="space-y-4">
              {features.map((item, i) => (
                <motion.li
                  key={i}
                  variants={fadeUp}
                  whileHover={{ x: 6 }}
                  className="
                    flex items-start gap-3
                    border-b border-white/10 pb-4
                    text-slate-400
                  "
                >
                  <CheckCircle className="w-4 h-4 text-slate-500 mt-0.5" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* AI Translation – Premium Card */}
          <motion.div
            variants={fadeUp}
            whileHover={{ scale: 1.02 }}
            className="
              relative rounded-2xl
              border border-blue-500/40
              bg-gradient-to-b from-blue-500/20 via-blue-500/5 to-transparent
              p-6
              backdrop-blur-sm
              shadow-[0_0_0_1px_rgba(59,130,246,0.25),0_20px_60px_-30px_rgba(59,130,246,0.7)]
            "
          >
            <div className="absolute inset-0 rounded-2xl bg-blue-500/10 blur-2xl opacity-40 pointer-events-none" />

            <h3 className="text-blue-400 text-lg mb-6 relative z-10">
              AI Powered Translation
            </h3>

            <motion.ul variants={stagger} className="space-y-4 relative z-10">
              {features.map((item, i) => (
                <motion.li
                  key={i}
                  variants={fadeUp}
                  whileHover={{ x: 6 }}
                  className="
                    flex items-start gap-3
                    border-b border-white/10 pb-4
                  "
                >
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span className="text-white">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <a
            href="#"
            className="
              hero-btn px-8 py-3 text-[15px] font-semibold rounded-xl
              bg-blue-600 text-white
              hover:bg-blue-700 transition
              shadow-lg shadow-blue-600/30
            "
          >
            Read More
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
