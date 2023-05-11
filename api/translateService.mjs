import { requestTranslate } from './util/googleTranslate.mjs';

export async function translateFile(key, fileContent) {
  return requestTranslate(key, fileContent);
}
