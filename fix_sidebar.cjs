const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

// Replace button with motion.button
code = code.replace(/<button/g, '<motion.button whileTap={{ scale: 0.95 }}');
code = code.replace(/<\/button>/g, '</motion.button>');

// Ensure transition for width uses motion
code = code.replace(
  /<div \n\s*className=\{\`relative h-full transition-all duration-300 ease-in-out border-r border-gray-200\/50 flex flex-col font-sans \$\{isCollapsed \? 'w-\[72px\]' : 'w-\[250px\]'\}\`\}\n\s*style=\{\{ backgroundColor: \`rgba\(255, 255, 255, \$\{opacity \/ 100\}\)\` \}\}\n\s*>/,
  `<motion.div 
      initial={false}
      animate={{ width: isCollapsed ? 72 : 250 }}
      transition={{ duration: 0.3, ease: 'circOut' }}
      className="relative h-full border-r border-gray-200/50 dark:border-slate-800/50 flex flex-col font-sans bg-white/95 dark:bg-slate-900/95"
      style={{ backgroundColor: \`rgba(var(--bg-rgb, 255, 255, 255), \${opacity / 100})\` }}
    >`
);

code = code.replace(/<\/div>\n  \);\n\}/, '</motion.div>\n  );\n}');

fs.writeFileSync('src/components/Sidebar.tsx', code);
