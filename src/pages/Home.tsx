import React from 'react';
import Hero from '../components/sections/Hero';
import Ritual from '../components/sections/Ritual';
import Suites from '../components/sections/Suites';
import FAQ from '../components/sections/FAQ';
import Contact from '../components/sections/Contact';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative"
    >
      <Hero />

      <div className="bg-page">
        <Suites />
        
        <Ritual />

        <FAQ />

        <Contact />
      </div>
    </motion.div>
  );
}
