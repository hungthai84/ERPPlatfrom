const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `
        <div 
          className="flex w-full h-full rounded-[10px] overflow-hidden border backdrop-blur-md shadow-2xl transition-all duration-500 hc:backdrop-blur-none"
          style={{ 
            animation: theme === 'hc' ? 'none' : 'colorChange 60s infinite',
            backgroundColor: theme === 'dark' 
              ? \`rgba(15, 23, 42, \${opacity / 100})\` 
              : theme === 'hc' 
                ? 'var(--color-slate-950, #020617)' 
                : \`rgba(250, 250, 250, \${opacity / 100})\`
          }}
        >
`;

code = code.replace(
  /<div \s*className="flex w-full h-full rounded-\[10px\] overflow-hidden border backdrop-blur-md shadow-2xl transition-all duration-500"\s*style=\{\{ \s*animation: 'colorChange 60s infinite',\s*backgroundColor: `rgba\(250, 250, 250, \$\{opacity \/ 100\}\)`\s*\}\}\s*>/m,
  replacement
);

fs.writeFileSync('src/App.tsx', code);
