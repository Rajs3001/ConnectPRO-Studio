'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Environment, PresentationControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useRef, useEffect, useState } from 'react';
import { Group } from 'three';

function CharacterModel({ animation, minimized, isEntrance }: { animation: string, minimized: boolean, isEntrance: boolean }) {
  const group = useRef<Group | null>(null);
  const { scene, animations } = useGLTF('/models/clonex_with_animset.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && animation && actions[animation]) {
      actions[animation].reset().fadeIn(0.8).play();
    }
    return () => {
      if (actions && animation && actions[animation]) {
        actions[animation].fadeOut(0.8);
      }
    };
  }, [animation, actions]);

  return (
    <group ref={group} dispose={null}>
      <primitive 
        object={scene} 
        scale={minimized ? 3.5 : 8.0} 
        position-y={minimized ? -3.5 : -8.0}
        position-z={minimized ? 0 : isEntrance ? -10 : -5}
        rotation-y={isEntrance ? Math.PI * 2 : 0}
      />
    </group>
  );
}

export default function Chat3DCharacter() {
  const [onboarding, setOnboarding] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [animation, setAnimation] = useState('Idle');
  const [entranceComplete, setEntranceComplete] = useState(false);
  const [isEntrance, setIsEntrance] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    { from: 'ai', text: 'Welcome to ConnectPro! I am your cyber guide. Ready to explore?' }
  ]);

  // Dramatic entrance effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setEntranceComplete(true);
      setTimeout(() => setIsEntrance(false), 2000);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Enhanced animation sequence
  useEffect(() => {
    if (onboarding && !isEntrance) {
      const animationSequence = ['Idle', 'Wave', 'Idle_2', 'LookAround', 'Idle_3'];
      let currentIndex = 0;
      
      const interval = setInterval(() => {
        setAnimation(animationSequence[currentIndex]);
        currentIndex = (currentIndex + 1) % animationSequence.length;
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [onboarding, isEntrance]);

  // Idle/random animation logic for minimized
  useEffect(() => {
    if (minimized && !chatOpen) {
      const idleAnims = ['Idle', 'Idle_2', 'Idle_3', 'Wave', 'LookAround'];
      const interval = setInterval(() => {
        setAnimation(idleAnims[Math.floor(Math.random() * idleAnims.length)]);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [minimized, chatOpen]);

  // Onboarding complete handler
  const handleOnboardingComplete = () => {
    setOnboarding(false);
    setMinimized(true);
  };

  // Chat open/close
  const handleAvatarClick = () => setChatOpen(true);
  const handleCloseChat = () => setChatOpen(false);

  // Send message (simulate AI response)
  const sendMessage = (msg: string) => {
    setChatMessages((msgs) => [...msgs, { from: 'user', text: msg }]);
    setTimeout(() => {
      setChatMessages((msgs) => [...msgs, { from: 'ai', text: 'How can I help you next?' }]);
    }, 1200);
  };

  // Render full-screen onboarding
  if (onboarding) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] text-white overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15),transparent_60%)]"></div>
          <div className="absolute top-10 left-10 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-[700px] h-[700px] bg-purple-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-500/15 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Enhanced grid pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23ffffff' stroke-width='0.8' opacity='0.4'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='120' height='120' fill='url(%23grid)'/%3E%3C/svg%3E")`
        }}></div>

        {/* Enhanced floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/50 rounded-full"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${4 + Math.random() * 6}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 8}s`
              }}
            ></div>
          ))}
        </div>

        {/* Main character container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.1, y: 200 }} 
          animate={{ 
            opacity: entranceComplete ? 1 : 0, 
            scale: entranceComplete ? 1 : 0.1, 
            y: entranceComplete ? 0 : 200 
          }} 
          transition={{ duration: 2.5, ease: "easeOut" }} 
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Massive glow effect behind character */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 3, delay: 0.5 }}
            className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-full blur-3xl scale-200"
          ></motion.div>
          
          {/* 3D Character Container */}
          <motion.div
            initial={{ scale: 0.5, rotateY: -30, rotateX: 10 }}
            animate={{ 
              scale: isEntrance ? 1.2 : 1, 
              rotateY: isEntrance ? 360 : 0, 
              rotateX: isEntrance ? 0 : 0 
            }}
            transition={{ 
              duration: isEntrance ? 3 : 1, 
              delay: isEntrance ? 0.5 : 0,
              ease: isEntrance ? "easeOut" : "easeInOut"
            }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <Canvas 
              camera={{ position: [0, 3, 12], fov: 35 }} 
              shadows
              className="w-full h-full"
            >
              <ambientLight intensity={1.2} />
              <directionalLight position={[15, 15, 8]} intensity={2.0} castShadow />
              <pointLight position={[-15, -15, -8]} intensity={1.0} color="#6366f1" />
              <pointLight position={[15, -15, -8]} intensity={1.0} color="#06b6d4" />
              <pointLight position={[0, 20, 0]} intensity={0.8} color="#ffffff" />
              
              <Environment preset="city" />
              <CharacterModel animation={animation} minimized={false} isEntrance={isEntrance} />
              
              <PresentationControls
                global
                rotation={[0, 0, 0]}
                polar={[-Math.PI / 4, Math.PI / 4]}
                azimuth={[-Math.PI / 4, Math.PI / 4]}
                config={{ mass: 2, tension: 400 }}
                snap={{ mass: 4, tension: 400 }}
              >
                <OrbitControls 
                  enablePan={false} 
                  enableZoom={false} 
                  enableRotate={true}
                  maxPolarAngle={Math.PI / 2}
                  minPolarAngle={Math.PI / 3}
                  autoRotate={!isEntrance}
                  autoRotateSpeed={0.3}
                />
              </PresentationControls>
            </Canvas>
          </motion.div>

          {/* Enhanced chat bubble */}
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.5 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            transition={{ delay: 2.5, duration: 1.2 }} 
            className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full flex flex-col items-center"
          >
            <div className="bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-2xl border border-white/30 rounded-3xl px-10 py-8 text-2xl text-white shadow-2xl max-w-2xl relative overflow-hidden">
              {/* Animated border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 opacity-60"></div>
              <div className="relative z-10 font-medium">{chatMessages[0].text}</div>
            </div>
            
            <motion.button 
              onClick={handleOnboardingComplete} 
              className="mt-10 bg-gradient-to-r from-[#6366F1] via-[#A21CAF] to-[#06B6D4] text-white px-12 py-5 rounded-full text-2xl font-bold shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Let&apos;s Go!</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Enhanced minimized floating avatar
  return (
    <>
      <div className="fixed bottom-10 right-10 z-[90] cursor-pointer group">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0, y: 100 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          transition={{ duration: 1.5, ease: "easeOut" }} 
          onClick={handleAvatarClick} 
          className="w-48 h-48 rounded-full bg-gradient-to-br from-[#18181B] via-[#6366F1] to-[#06B6D4] shadow-2xl border-4 border-white/20 flex items-center justify-center overflow-hidden hover:scale-110 transition-all duration-300 relative"
          whileHover={{ scale: 1.15, rotateY: 10, y: -5 }}
        >
          {/* Enhanced glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/40 via-purple-500/40 to-pink-500/40 rounded-full blur-2xl"></div>
          
          <Canvas camera={{ position: [0, 1.5, 4] }} className="relative z-10">
            <ambientLight intensity={1.0} />
            <directionalLight position={[5, 10, 7]} intensity={1.5} />
            <CharacterModel animation={animation} minimized={true} isEntrance={false} />
          </Canvas>
        </motion.div>
      </div>

      {/* Enhanced Chat Bubble UI */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 60, scale: 0.7 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 60, scale: 0.7 }} 
            transition={{ duration: 0.6 }} 
            className="fixed bottom-64 right-14 z-[100] w-[450px] max-w-full"
          >
            <div className="bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-2xl border border-white/30 rounded-3xl px-8 py-6 text-lg text-white shadow-2xl mb-6 max-h-96 overflow-y-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 via-purple-500/15 to-pink-500/15 rounded-3xl"></div>
              <div className="relative z-10">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`mb-4 flex ${msg.from === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`px-5 py-4 rounded-2xl ${msg.from === 'ai' ? 'bg-gradient-to-r from-cyan-600/90 to-cyan-500/90' : 'bg-gradient-to-r from-purple-600/90 to-purple-500/90'} text-white max-w-[85%] shadow-xl`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <form onSubmit={e => { e.preventDefault(); const val = (e.target as any).elements.msg.value; if (val) { sendMessage(val); (e.target as any).reset(); } }} className="flex gap-4">
              <input 
                name="msg" 
                autoComplete="off" 
                className="flex-1 rounded-xl px-5 py-4 bg-white/25 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 backdrop-blur-sm text-lg" 
                placeholder="Type your question..." 
              />
              <button type="submit" className="bg-gradient-to-r from-[#6366F1] via-[#A21CAF] to-[#06B6D4] text-white px-6 py-4 rounded-xl font-bold shadow-xl hover:scale-105 transition-transform">Send</button>
              <button type="button" onClick={handleCloseChat} className="ml-2 text-white/60 hover:text-white text-2xl hover:scale-110 transition-transform">×</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 