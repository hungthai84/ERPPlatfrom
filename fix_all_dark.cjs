const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.tsx') && file !== 'Sidebar.tsx' && file !== 'Header.tsx' && file !== 'CommandPalette.tsx') {
    let code = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Quick and dirty dark mode additions for common classes
    code = code.replace(/text-gray-900/g, 'text-gray-900 dark:text-white');
    code = code.replace(/text-gray-800/g, 'text-gray-800 dark:text-gray-200');
    code = code.replace(/text-gray-700/g, 'text-gray-700 dark:text-gray-300');
    code = code.replace(/text-gray-600/g, 'text-gray-600 dark:text-gray-400');
    code = code.replace(/text-gray-500/g, 'text-gray-500 dark:text-gray-400');
    
    code = code.replace(/bg-white/g, 'bg-white dark:bg-slate-900');
    code = code.replace(/bg-gray-50/g, 'bg-gray-50 dark:bg-slate-900/50');
    code = code.replace(/bg-gray-100/g, 'bg-gray-100 dark:bg-slate-800');
    
    code = code.replace(/border-gray-200/g, 'border-gray-200 dark:border-slate-800');
    code = code.replace(/border-gray-100/g, 'border-gray-100 dark:border-slate-800/50');
    
    fs.writeFileSync(path.join(dir, file), code);
  }
});
