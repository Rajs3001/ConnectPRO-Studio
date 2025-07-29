
"use client"; // Add "use client" if not already present, needed for useEffect/useState

import { motion } from 'framer-motion';
import Animated3DOrbs from '@/components/landing/Animated3DOrbs';
import { ArrowRight, Users, Video, Star, Briefcase, MessageSquare } from 'lucide-react';
import React from 'react';

const features = [
  {
    icon: <Video className="h-8 w-8 text-cyan-400" />,
    title: '1:1 Video Sessions',
    desc: 'Book secure, high-quality video calls with real professionals and mentors.'
  },
  {
    icon: <Users className="h-8 w-8 text-purple-400" />,
    title: 'Verified Network',
    desc: 'Connect with recent graduates, working professionals, and counselors.'
  },
  {
    icon: <Briefcase className="h-8 w-8 text-orange-400" />,
    title: 'Career Guidance',
    desc: 'Get actionable advice and plan your next steps with confidence.'
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-pink-400" />,
    title: 'AI & Community',
    desc: 'Leverage AI and a supportive community for 24/7 help and insights.'
  },
];

const testimonials = [
  {
    name: 'Sarah L.',
    role: 'Software Engineer',
    text: 'ConnectPro connected me with an amazing mentor who helped me navigate my first year in the industry. The video calls are seamless and the community is super helpful!',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Mike R.',
    role: 'Product Manager',
    text: 'The anonymous community is fantastic for asking candid questions without judgment. Found some great insights there. Video calls are smooth too.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Priya S.',
    role: 'Marketing Specialist',
    text: 'A great resource for professional development. The combination of human expertise and AI support is unique and effective.',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#18181B] via-[#6366F1] to-[#06B6D4] text-white relative overflow-x-hidden">
      {/* Animated 3D Orbs Background */}
      <Animated3DOrbs />
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[80vh] py-24 px-4 text-center z-10">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-[#6366F1] via-[#A21CAF] to-[#06B6D4] bg-clip-text text-transparent drop-shadow-xl"
        >
          Connect. Grow. Succeed.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1, ease: 'easeOut' }}
          className="text-xl md:text-2xl max-w-2xl mx-auto mb-10 text-white/90"
        >
          Book 1:1 video sessions with real professionals, get career guidance, and join a thriving, supportive community.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="bg-gradient-to-r from-[#6366F1] via-[#A21CAF] to-[#06B6D4] text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl hover:scale-105 transition-transform duration-300 flex items-center gap-2">
            Find Your Mentor <ArrowRight className="h-5 w-5" />
          </button>
          <button className="bg-white/10 border border-white/30 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-white/20 hover:scale-105 transition-all duration-300">
            Explore Community
          </button>
        </motion.div>
      </section>
      {/* Features Section */}
      <section className="relative py-20 px-4 z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: 'easeOut' }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 flex flex-col items-center text-center hover:scale-105 hover:shadow-3xl transition-all duration-300 group"
            >
              <div className="mb-4 animate-float group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-white drop-shadow-lg">{f.title}</h3>
              <p className="text-white/80 text-base">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      {/* How It Works Section */}
      <section className="relative py-20 px-4 z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Users className="h-8 w-8 text-cyan-400" />,
              title: 'Sign Up',
              desc: 'Create your free account as a student or professional.'
            },
            {
              icon: <Video className="h-8 w-8 text-purple-400" />,
              title: 'Book a Session',
              desc: 'Find the right professional and schedule a 1:1 video call.'
            },
            {
              icon: <Star className="h-8 w-8 text-yellow-400" />,
              title: 'Grow & Succeed',
              desc: 'Get answers, mentorship, and plan your next steps.'
            },
          ].map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.15, duration: 0.7, ease: 'easeOut' }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 flex flex-col items-center text-center hover:scale-105 hover:shadow-3xl transition-all duration-300 group"
            >
              <div className="mb-4 animate-float group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <h4 className="text-lg font-bold mb-2 text-white drop-shadow-lg">{step.title}</h4>
              <p className="text-white/80 text-base">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="relative py-20 px-4 z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white drop-shadow-lg">What Our Users Say</h2>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-stretch">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.2, duration: 0.7, ease: 'easeOut' }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 flex-1 flex flex-col items-center text-center hover:scale-105 hover:shadow-3xl transition-all duration-300 group"
            >
              <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full border-4 border-white/30 mb-4 shadow-lg" />
              <h4 className="text-lg font-bold mb-1 text-white drop-shadow-lg">{t.name}</h4>
              <p className="text-sm text-white/60 mb-2">{t.role}</p>
              <p className="text-white/90 italic">"{t.text}"</p>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Floating Badges Row */}
      <section className="flex justify-center items-center gap-6 py-6 mb-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg w-fit mx-auto animate-fade-in-up z-20">
        <img src="/badges/ft1000.svg" alt="FT 1000" className="h-8 opacity-80" />
        <img src="/badges/iso27001.svg" alt="ISO 27001" className="h-8 opacity-80" />
        <img src="/badges/cyber-essentials.svg" alt="Cyber Essentials" className="h-8 opacity-80" />
        <img src="/badges/eba.svg" alt="EBA" className="h-8 opacity-80" />
      </section>
      {/* Footer */}
      <footer className="w-full py-12 bg-gradient-to-t from-[#18181B]/90 via-[#6366F1]/60 to-transparent text-white/80 text-center backdrop-blur-lg border-t border-white/10 z-30">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-2 text-xl font-bold text-white">
            <span className="bg-gradient-to-r from-[#6366F1] via-[#A21CAF] to-[#06B6D4] bg-clip-text text-transparent">ConnectPro</span>
          </div>
          <div className="flex gap-4 text-lg">
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:scale-110 transition-transform"><img src="/badges/iso27001.svg" alt="ISO" className="h-8" /></a>
            <a href="#" className="hover:scale-110 transition-transform"><img src="/badges/cyber-essentials.svg" alt="Cyber" className="h-8" /></a>
          </div>
        </div>
        <div className="mt-8 text-xs text-white/50">&copy; {new Date().getFullYear()} ConnectPro. All rights reserved.</div>
      </footer>
    </div>
  );
}
