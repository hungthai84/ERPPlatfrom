const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

if (!code.includes('motion.button')) {
  if (!code.includes('import { motion }')) {
    code = code.replace(`import React from 'react';`, `import React from 'react';\nimport { motion } from 'motion/react';`);
  }
  code = code.replace(/<button/g, '<motion.button whileTap={{ scale: 0.95 }}');
  code = code.replace(/<\/button>/g, '</motion.button>');
  fs.writeFileSync('src/components/Header.tsx', code);
}
