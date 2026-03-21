import React from 'react';
import Lottie from 'lottie-react';
import { motion, AnimatePresence } from 'framer-motion';
import loadingAnimation from './loading.json';

interface LoadingScreenProps {
  isVisible: boolean;
  message?: string;
}

export function LoadingScreen({ isVisible, message }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-md"
        >
          <div className="w-64 h-64 lg:w-96 lg:h-96">
            <Lottie 
              animationData={loadingAnimation} 
              loop={true} 
              autoPlay={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          {message && (
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-white font-medium text-lg tracking-wide uppercase"
            >
              {message}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
