#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const i18nDir = path.join(__dirname, '..', 'i18n');
const ptFile = path.join(i18nDir, 'pt.yaml');
const enFile = path.join(i18nDir, 'en.yaml');

console.log('Validando chaves i18n...\n');

try {
  // Ler arquivos YAML
  const ptContent = fs.readFileSync(ptFile, 'utf-8');
  const enContent = fs.readFileSync(enFile, 'utf-8');

  const ptData = yaml.load(ptContent);
  const enData = yaml.load(enContent);

  const ptKeys = Object.keys(ptData).sort();
  const enKeys = Object.keys(enData).sort();

  console.log(`PT keys: ${ptKeys.length}`);
  console.log(`EN keys: ${enKeys.length}`);
  console.log('');

  // Verificar chaves faltantes
  let hasErrors = false;

  const missingInEN = ptKeys.filter(key => !enKeys.includes(key));
  const missingInPT = enKeys.filter(key => !ptKeys.includes(key));

  if (missingInEN.length > 0) {
    console.error(`❌ Chaves em PT mas não em EN: ${missingInEN.join(', ')}`);
    hasErrors = true;
  }

  if (missingInPT.length > 0) {
    console.error(`❌ Chaves em EN mas não em PT: ${missingInPT.join(', ')}`);
    hasErrors = true;
  }

  // Verificar chaves obrigatórias
  const requiredKeys = [
    'nav_home', 'nav_posts', 'nav_about',
    'footer_tagline', 'footer_privacy', 'footer_terms',
    'posts_title', 'posts_description', 'posts_empty',
    'month_1', 'month_2', 'month_3', 'month_4', 'month_5', 'month_6',
    'month_7', 'month_8', 'month_9', 'month_10', 'month_11', 'month_12',
    'date_format'
  ];

  const missingRequired = requiredKeys.filter(key => !ptKeys.includes(key));
  if (missingRequired.length > 0) {
    console.error(`❌ Chaves obrigatórias faltando em PT: ${missingRequired.join(', ')}`);
    hasErrors = true;
  }

  const missingRequiredEN = requiredKeys.filter(key => !enKeys.includes(key));
  if (missingRequiredEN.length > 0) {
    console.error(`❌ Chaves obrigatórias faltando em EN: ${missingRequiredEN.join(', ')}`);
    hasErrors = true;
  }

  if (!hasErrors) {
    console.log('✅ Todas as chaves estão presentes em ambos os idiomas');
    console.log('✅ Todas as chaves obrigatórias estão presentes');
    process.exit(0);
  } else {
    process.exit(1);
  }
} catch (error) {
  console.error(`❌ Erro ao validar: ${error.message}`);
  process.exit(1);
}
