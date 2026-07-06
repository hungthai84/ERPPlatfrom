const fs = require('fs');

let code = fs.readFileSync('src/components/CauHinhTab.tsx', 'utf8');

if (!code.includes('theme?:')) {
  code = code.replace(
    `export interface CauHinhTabProps {`,
    `export interface CauHinhTabProps {\n  theme?: 'light' | 'dark' | 'hc';\n  setTheme?: (theme: 'light' | 'dark' | 'hc') => void;`
  );
}

if (!code.includes('theme = \'light\',')) {
  code = code.replace(
    `export default function CauHinhTab({ \n  businessProfile, \n  onUpdateBusinessProfile, \n  bgType, \n  setBgType, \n  bgValue, \n  setBgValue, \n  opacity, \n  setOpacity \n}: CauHinhTabProps) {`,
    `export default function CauHinhTab({ \n  theme = 'light', \n  setTheme, \n  businessProfile, \n  onUpdateBusinessProfile, \n  bgType, \n  setBgType, \n  bgValue, \n  setBgValue, \n  opacity, \n  setOpacity \n}: CauHinhTabProps) {`
  );
}

// Add the theme switcher UI in the first column
const themeUI = `
          {/* Theme Settings */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-500 rounded-full inline-block"></span> Giao diện (Theme)
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'light', name: 'Sáng (Light)', icon: '☀️' },
                { id: 'dark', name: 'Tối (Dark)', icon: '🌙' },
                { id: 'hc', name: 'Tương phản cao', icon: '⚡' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme && setTheme(t.id as any)}
                  className={\`flex flex-col items-center justify-center py-4 px-2 rounded-xl border-2 transition-all \${theme === t.id ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'}\`}
                >
                  <span className="text-2xl mb-2">{t.icon}</span>
                  <span className={\`text-[10px] font-bold uppercase tracking-widest \${theme === t.id ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}\`}>{t.name}</span>
                </button>
              ))}
            </div>
          </div>
`;

code = code.replace(
  `<div className="lg:col-span-2 space-y-5">`,
  `<div className="lg:col-span-2 space-y-5">\n${themeUI}`
);

fs.writeFileSync('src/components/CauHinhTab.tsx', code);
