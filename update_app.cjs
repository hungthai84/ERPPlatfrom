const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add imports for motion, CommandPalette, and Theme
if (!code.includes('import CommandPalette')) {
  code = code.replace(
    `import { useState } from 'react';`,
    `import { useState, useEffect } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';\nimport CommandPalette from './components/CommandPalette';`
  );
}

// Add state for theme and Command Palette
const stateInjection = `
  const [theme, setTheme] = useState<'light' | 'dark' | 'hc'>(() => (localStorage.getItem('fintab_theme') as any) || 'light');
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'hc');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'hc') {
      root.classList.add('hc');
    }
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
`;

// Insert the state right after currentTab
code = code.replace(
  `const [currentTab, setCurrentTab] = useState<string>('duan');`,
  `const [currentTab, setCurrentTab] = useState<string>('duan');${stateInjection}`
);

// Pass theme state to CauHinhTab
code = code.replace(
  `<CauHinhTab \n            businessProfile={businessProfile}`,
  `<CauHinhTab \n            theme={theme}\n            setTheme={(t) => { setTheme(t); localStorage.setItem('fintab_theme', t); }}\n            businessProfile={businessProfile}`
);

// Add CommandPalette to return and wrap tabs with AnimatePresence
// Replace the main tag contents
code = code.replace(
  `<main className="flex-1 overflow-y-auto px-6 pb-6">\n              <div className="bg-white rounded-[10px] shadow-sm border border-gray-100 min-h-full p-6">\n                {renderTabContent()}\n              </div>\n            </main>`,
  `<main className="flex-1 overflow-y-auto px-6 pb-6 relative">\n              <div className="bg-white dark:bg-slate-900 rounded-[10px] shadow-sm border border-gray-100 dark:border-slate-800 min-h-full p-6 transition-colors">\n                <AnimatePresence mode="wait">\n                  <motion.div\n                    key={currentTab}\n                    initial={{ opacity: 0, y: 10 }}\n                    animate={{ opacity: 1, y: 0 }}\n                    exit={{ opacity: 0, y: -10 }}\n                    transition={{ duration: 0.2 }}\n                    className="w-full h-full"\n                  >\n                    {renderTabContent()}\n                  </motion.div>\n                </AnimatePresence>\n              </div>\n            </main>\n            <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} onNavigate={setCurrentTab} />`
);

fs.writeFileSync('src/App.tsx', code);
