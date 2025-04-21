'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './BloomText.module.css';

interface BloomTextProps {
  darkMode: boolean;
}

const BloomText: React.FC<BloomTextProps> = ({ darkMode }) => {
  return (
    <motion.div 
      className={`${styles.logoContainer} ${darkMode ? styles.darkMode : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <span className={styles.logoText}>
        weather<span className={styles.bloomText}>
          <span className={styles.char1}>o</span>
          <span className={styles.char2}>o</span>
          <span className={styles.char3}>o</span>
        </span>
      </span>
    </motion.div>
  );
};

export default BloomText; 