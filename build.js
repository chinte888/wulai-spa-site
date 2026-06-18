const fs = require('fs');
const path = require('path');

const locales = ['zh', 'en', 'ja', 'ko'];
const pages = ['index.html', 'facilities.html', 'public-bath.html', 'private-room.html', 'news.html'];

console.log('Starting build process...');

// Read translations
const translations = {};
locales.forEach(lang => {
  const filePath = path.join(__dirname, 'locales', `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`Locale file missing: ${filePath}`);
    process.exit(1);
  }
  translations[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
});

// Compile pages
pages.forEach(page => {
  const templatePath = path.join(__dirname, 'src', page);
  if (!fs.existsSync(templatePath)) {
    console.warn(`Template missing: ${templatePath}`);
    return;
  }
  const template = fs.readFileSync(templatePath, 'utf8');

  locales.forEach(lang => {
    let output = template;
    const dict = translations[lang];

    // 1. Replace translation placeholders {{key}}
    Object.keys(dict).forEach(key => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      output = output.replace(regex, dict[key]);
    });

    // 2. Replace system parameters
    const rootPath = lang === 'zh' ? '' : '../';
    const isSubdir = lang !== 'zh';
    
    output = output.replace(/{{rootPath}}/g, rootPath);
    output = output.replace(/{{langCode}}/g, dict['lang_code'] || lang);

    // 3. Write compiled output
    const outDir = lang === 'zh' ? __dirname : path.join(__dirname, lang);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const outputPath = path.join(outDir, page);
    fs.writeFileSync(outputPath, output, 'utf8');
    console.log(`Generated: ${outputPath}`);
  });
});

console.log('Build completed successfully!');
