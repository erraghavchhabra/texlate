import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FileSearch, Landmark, Scale } from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Scanned PDF Document Translator",
    description:
      "We handle old, legacy documents and scanned files with ease.",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: Landmark,
    title: "Land & Revenue Records",
    description:
      "Our models translate 7/12 extracts, Ferfar, and Property Cards while keeping tables aligned.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Scale,
    title: "Legal Document Translation",
    description:
      "We ensure that court submissions retain their official structure for Any/Multiple Language to English translation.",
    gradient: "from-purple-500 to-pink-600",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const AboutFeature = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  return (
    <section id="about-feature" className="py-24 bg-white px-6">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
          ref={ref}
        >
          <h2 className="text-4xl font-bold mb-3">
            Specialized Scanned PDF & <br />
            <span className="text-blue-600">Layout Preserving Translator</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Texlate provides specialized AI translator services designed for complex files. Unlike standard tools, we focus on:
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid md:grid-cols-3 gap-6"
          ref={ref}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-md transition-all duration-300"
            >
              {/* Gradient Icon Background */}
              <div
                className={`mb-5 inline-flex items-center justify-center rounded-xl p-4 bg-gradient-to-r ${f.gradient} text-white shadow-lg`}
              >
                <f.icon className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>

              <p className="text-sm leading-relaxed text-gray-600">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutFeature;
