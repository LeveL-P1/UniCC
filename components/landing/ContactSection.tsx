"use client";

import { motion } from "framer-motion";
import { Github, Twitter } from "lucide-react";

export function ContactSection() {
  return (
    <section id="contact" className="w-full relative flex items-center justify-center py-32">
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 bg-black/20 backdrop-blur-sm border border-white/5 rounded-3xl p-12 shadow-2xl">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          {/* Location Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl text-white mb-6 uppercase tracking-[0.2em] font-light">Earth</h3>
            <p className="text-neutral-400 leading-loose text-lg">
              Somewhere in India<br/>
              <span className="text-white italic">You paused here. Trust that instinct.</span>
            </p>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-2xl text-white mb-6 uppercase tracking-[0.2em] font-light">Contact Info</h3>
            <div className="text-neutral-400 leading-loose text-lg flex flex-col">
              <p>P1.dev@proton.me</p>
              <div className="flex items-center gap-6 mb-4 mt-2">
                <a href="https://www.x.com/Level-P1" target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="https://www.github.com/LeveL-P1" target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                  <Github className="w-6 h-6" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Message Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-2xl text-white mb-10 uppercase tracking-[0.2em] font-light">Message </h3>
          
          <form className="flex flex-col gap-10" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col md:flex-row gap-10">
              <input 
                type="text" 
                placeholder="Your name" 
                className="w-full bg-transparent border-b border-white/20 pb-3 text-white text-lg outline-none focus:border-white/60 transition-colors placeholder:text-neutral-600"
              />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full bg-transparent border-b border-white/20 pb-3 text-white text-lg outline-none focus:border-white/60 transition-colors placeholder:text-neutral-600"
              />
            </div>
            
            <textarea 
              placeholder="Write your message" 
              rows={4}
              className="w-full bg-transparent border-b border-white/20 pb-3 text-white text-lg outline-none focus:border-white/60 transition-colors placeholder:text-neutral-600 resize-none"
            />

            <button 
              type="submit" 
              className="mt-6 self-start bg-white text-black px-10 py-4 text-md font-bold uppercase tracking-[0.15em] hover:bg-neutral-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] rounded-sm cursor-pointer "
            >
              Send Message
            </button>
          </form>
        </motion.div>

      </div>
    </section>
  );
}
