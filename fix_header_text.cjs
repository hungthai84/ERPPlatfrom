const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace(/text-gray-900/g, 'text-gray-900 dark:text-white');
code = code.replace(/text-gray-500/g, 'text-gray-500 dark:text-gray-400');
code = code.replace(/text-gray-600/g, 'text-gray-600 dark:text-gray-300');
code = code.replace(/text-gray-800/g, 'text-gray-800 dark:text-gray-200');
code = code.replace(/bg-white/g, 'bg-white dark:bg-slate-900');
code = code.replace(/hover:bg-gray-100/g, 'hover:bg-gray-100 dark:hover:bg-slate-800');
code = code.replace(/border-gray-200/g, 'border-gray-200 dark:border-slate-800');
code = code.replace(/bg-gray-100/g, 'bg-gray-100 dark:bg-slate-800');

fs.writeFileSync('src/components/Header.tsx', code);
