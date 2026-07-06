const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

code = code.replace(/text-gray-900/g, 'text-gray-900 dark:text-white');
code = code.replace(/text-gray-500/g, 'text-gray-500 dark:text-gray-400');
code = code.replace(/text-gray-600/g, 'text-gray-600 dark:text-gray-300');
code = code.replace(/bg-white/g, 'bg-white dark:bg-slate-900');
code = code.replace(/hover:bg-gray-100\/50/g, 'hover:bg-gray-100/50 dark:hover:bg-slate-800/50');
code = code.replace(/bg-blue-50\/50/g, 'bg-blue-50/50 dark:bg-blue-900/30');

fs.writeFileSync('src/components/Sidebar.tsx', code);
