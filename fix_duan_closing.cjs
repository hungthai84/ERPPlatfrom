const fs = require('fs');
let code = fs.readFileSync('src/components/DuAnTab.tsx', 'utf8');

// The last closing div before `);` should be `</motion.div>`.
code = code.replace(/<\/div>\n  \);\n\}/, '</motion.div>\n  );\n}');

fs.writeFileSync('src/components/DuAnTab.tsx', code);
