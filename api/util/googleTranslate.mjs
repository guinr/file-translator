import dotenv from 'dotenv';
import pLimit from 'p-limit';
import { v2 } from '@google-cloud/translate';

dotenv.config();

const { Translate } = v2;

// Defina o idioma de origem e destino
const sourceLang = 'en'; // Inglês
const targetLang = 'pt'; // Português Brasileiro
let translatedCharCount = 0;

// Defina a função para traduzir uma linha
async function translateLine(key, line) {
  // Verifique se a linha começa com um número ou está vazia
  if (/^\d/.test(line) || !line.trim()) {
    return line;
  }

  const translate = new Translate({
    key,
  });

  // Traduza a linha
  translatedCharCount += line.length;
  const [translation] = await translate.translate(line, {
    from: sourceLang,
    to: targetLang,
  });

  // Retorne a linha traduzida
  return translation;
}

export async function requestTranslate(key, fileContent) {
  translatedCharCount = 0;
  // Divida o conteúdo do arquivo em linhas
  const lines = fileContent.split('\n');

  // Crie um array para armazenar as linhas traduzidas
  const translatedLines = [];

  // Defina o número máximo de chamadas simultâneas
  const limit = pLimit(1000);

  // Traduza cada linha com concorrência
  await Promise.all(lines.map((line, i) =>
    limit(async () => {
      const translatedLine = await translateLine(key, line);

      // Adicione a linha traduzida ao array
      translatedLines[i] = translatedLine;

      // Exiba o progresso a cada 1000 linhas
      if (i % 1000 === 0) {
        console.log(`Translating line ${i + 1} de ${lines.length}...`);
      }
    })
  ));

  // Junte as linhas traduzidas de volta em um texto
  console.log('Joining Lines...');
  console.log(`Total characters translated ${translatedCharCount}`);
  return translatedLines.join('\n');
}

