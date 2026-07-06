const fs = require('fs');
let code = fs.readFileSync('src/components/DuAnTab.tsx', 'utf8');

if (!code.includes('import { motion')) {
  code = code.replace(`import React, { useState, useEffect } from 'react';`, `import React, { useState, useEffect } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';`);
  
  // Replace main container of DuAnTab with a motion component
  code = code.replace(
    `<div className="space-y-6 font-sans animate-in fade-in duration-300">`,
    `<motion.div \n      initial={{ opacity: 0, y: 10 }}\n      animate={{ opacity: 1, y: 0 }}\n      transition={{ duration: 0.3 }}\n      className="space-y-6 font-sans"\n    >`
  );
  code = code.replace(/(<\/[^>]+>)\s*$/, '</motion.div>\n');
  
  // Replace buttons
  code = code.replace(/<button([^>]*)>/g, (match, p1) => {
    // Avoid replacing inside strings or if already motion
    if (p1.includes('whileTap')) return match;
    return `<motion.button whileTap={{ scale: 0.95 }} ${p1}>`;
  });
  code = code.replace(/<\/button>/g, '</motion.button>');
  
  // Replace the modal wrapper to have AnimatePresence and motion animations
  code = code.replace(
    `{showAddModal && (`,
    `<AnimatePresence>\n      {showAddModal && (`
  );
  
  code = code.replace(
    `<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">`,
    `<motion.div \n          initial={{ opacity: 0 }}\n          animate={{ opacity: 1 }}\n          exit={{ opacity: 0 }}\n          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"\n        >`
  );
  
  code = code.replace(
    `<div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100">`,
    `<motion.div \n            initial={{ scale: 0.95, opacity: 0, y: 20 }}\n            animate={{ scale: 1, opacity: 1, y: 0 }}\n            exit={{ scale: 0.95, opacity: 0, y: 20 }}\n            transition={{ duration: 0.2, ease: "easeOut" }}\n            className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800"\n          >`
  );
  
  // Fix the closing tags of the modal to wrap AnimatePresence
  // The modal ends with </form>\n          </div>\n        </div>\n      )}
  code = code.replace(
    /<\/form>\s*<\/div>\s*<\/div>\s*\)\}/,
    `</form>\n          </motion.div>\n        </motion.div>\n      )}\n      </AnimatePresence>`
  );
  
  fs.writeFileSync('src/components/DuAnTab.tsx', code);
}
