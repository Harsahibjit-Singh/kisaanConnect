'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaSeedling, FaHandshake, FaLightbulb, FaRocket, FaLinkedin, FaTwitter } from 'react-icons/fa';

// --- ANIMATION VARIANTS ---

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function About() {
  const router = useRouter();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-950 text-white overflow-hidden font-sans pt-20">
      
      {/* 1. CINEMATIC HERO */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div style={{ y: yParallax }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-gray-950 z-10"></div>
          <img 
            src="/about/bg_img.png" 
            alt="Vast Green Fields" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="container mx-auto px-6 relative z-20 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.span variants={fadeInUp} className="inline-block py-1 px-3 rounded-full bg-green-500/20 border border-green-500/50 text-green-400 text-sm font-bold tracking-widest mb-6 backdrop-blur-md">
              EST. 2026
            </motion.span>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-8xl font-extrabold mb-6 leading-tight">
              We Are <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Kisaan Connect.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Bridging the gap between traditional Mandi wisdom and modern digital efficiency.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 2. OUR STORY (Split Layout) */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">From <span className="text-green-500 underline decoration-wavy underline-offset-8">Bahi-Khata</span> to Blockchain</h2>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              For decades, the Indian agriculture market (Mandi) ran on paper slips, manual calculations, and trust. While the trust remains, the paper had to go.
            </p>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              We realized that Arthiyas (Commission Agents) were spending 40% of their time on manual accounting instead of growing their business. Kisaan Connect was born out of a need to simplify this chaos—bringing transparency to every kilogram sold.
            </p>
            {/* <div className="flex gap-8">
              <div>
                <h3 className="text-4xl font-bold text-white">10K+</h3>
                <p className="text-sm text-green-500 uppercase tracking-widest">Farmers Impacted</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-white">₹500Cr</h3>
                <p className="text-sm text-green-500 uppercase tracking-widest">Trade Volume</p>
              </div>
            </div> */}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-green-500 to-transparent rounded-3xl opacity-20 blur-2xl"></div>
            <img 
              src="/about/mandi._tech.png" 
              alt="Mandi Tech" 
              className="relative rounded-3xl border border-white/10 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
            />
          </motion.div>
        </div>
      </section>

      {/* 3. CORE VALUES (Cards) */}
      <section className="py-24 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <div className="w-20 h-1 bg-green-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FaHandshake, title: "Transparency", desc: "No hidden charges. No confusing calculations. Just clear, honest business." },
              { icon: FaLightbulb, title: "Innovation", desc: "We don't just follow trends; we build the tools that define the future of Agri-tech." },
              { icon: FaSeedling, title: "Empowerment", desc: "Helping farmers and Arthiyas make data-driven decisions to maximize profits." }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-gray-800 p-10 rounded-3xl border border-white/5 shadow-lg group hover:bg-gray-800/80 transition-all"
              >
                <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-3xl text-green-400 mb-6 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <value.icon />
                </div>
                <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE JOURNEY (Timeline) */}
      <section className="py-24 overflow-hidden relative">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Our Journey</h2>
          <div className="relative border-l-2 border-green-500/30 ml-4 md:ml-1/2 md:translate-x-[-1px] space-y-12">
            {[
              { year: "2025", title: "The Idea", desc: "Concept formulated during a visit to the Jalandhar Mandi." },
              { year: "2026", title: "Beta Launch", desc: "Launched in 5 Mandis in Punjab." },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative pl-12 md:pl-0"
              >
                {/* Dot */}
                <div className="absolute left-[-5px] md:left-1/2 md:-translate-x-1/2 top-0 w-4 h-4 bg-green-500 rounded-full border-4 border-gray-950 shadow-[0_0_10px_#22c55e]"></div>
                
                {/* Content */}
                <div className={`md:flex items-center justify-between ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="md:w-1/2"></div>
                  <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 text-right' : 'md:pl-12 text-left'}`}>
                    <span className="text-green-400 font-bold text-lg">{item.year}</span>
                    <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TEAM SECTION
      <section className="py-24 bg-gray-900/30">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-16">Meet the Visionaries</h2>
          <div className="flex flex-wrap justify-center gap-10">
            {[
              { name: "Arjun Singh", role: "Founder & CEO", img: "https://randomuser.me/api/portraits/men/32.jpg" },
              { name: "Priya Sharma", role: "Chief Tech Officer", img: "https://randomuser.me/api/portraits/women/44.jpg" },
              { name: "Dev Patel", role: "Head of Operations", img: "https://randomuser.me/api/portraits/men/86.jpg" },
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-white/5 p-6 rounded-2xl border border-white/5 backdrop-blur-sm w-72 group"
              >
                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full p-1 bg-gradient-to-tr from-green-400 to-emerald-600">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover rounded-full border-4 border-gray-900" />
                </div>
                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                <p className="text-green-400 text-sm mb-4">{member.role}</p>
                <div className="flex justify-center gap-4 text-gray-400">
                  <FaLinkedin className="hover:text-white cursor-pointer transition-colors" />
                  <FaTwitter className="hover:text-white cursor-pointer transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* 6. CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-green-600 to-emerald-800 rounded-3xl p-12 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
             
             <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Join the Revolution Today</h2>
             <p className="text-green-100 text-xl mb-8 max-w-2xl mx-auto relative z-10">
               Be a part of India's fastest growing network of digital Mandis.
             </p>
       <motion.button 
      onClick={() => router.push('/register')} // Add this line
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white text-green-900 px-10 py-4 rounded-full font-bold text-lg shadow-xl relative z-10 hover:bg-gray-100 transition-colors"
    >
      Get Started Now
    </motion.button>
          </div>
        </div>
      </section>

    </div>
  );
}