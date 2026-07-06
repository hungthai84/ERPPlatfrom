const fs = require('fs');
let code = fs.readFileSync('src/components/CauHinhTab.tsx', 'utf8');

if (!code.includes('import { motion }')) {
  code = code.replace(`import React from 'react';`, `import React from 'react';\nimport { motion } from 'motion/react';`);
  code = code.replace(/<button/g, '<motion.button whileTap={{ scale: 0.95 }}');
  code = code.replace(/<\/button>/g, '</motion.button>');
  
  // also the wallpaper items could have a small hover scale
  code = code.replace(/hover:border-gray-200/g, 'hover:border-gray-200 hover:scale-[1.02]');
  
  fs.writeFileSync('src/components/CauHinhTab.tsx', code);
}
