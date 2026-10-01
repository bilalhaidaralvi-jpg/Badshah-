import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI();
const audioDir = path.resolve('public/audio');

if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

const clips = [
  // Kitty
  { id: 'kitty_1', text: 'مہدیہ! کیسی ہو؟ میاؤں!', style: 'Cute kitten sweet baby voice with playful tone' },
  { id: 'kitty_2', text: 'مہدیہ! کیا کر رہی ہو؟', style: 'Cute sweet baby voice curious and happy' },
  { id: 'kitty_3', text: 'مہدیہ! تمہارا بابا کدھر ہے؟', style: 'Sweet cute child voice asking affectionately' },
  { id: 'kitty_4', text: 'مہدیہ! تمہاری ماما کدھر ہے؟', style: 'Sweet playful child voice asking lovingly' },
  { id: 'kitty_5', text: 'مہدیہ! السلام علیکم!', style: 'Sweet cheerful baby greeting' },

  // Bunny
  { id: 'bunny_1', text: 'مہدیہ! تمہاری ماما کدھر ہے؟', style: 'Cute friendly bunny toddler voice' },
  { id: 'bunny_2', text: 'مہدیہ! کیسی ہو؟ ہاپ ہاپ!', style: 'Playful bouncy sweet baby voice' },
  { id: 'bunny_3', text: 'مہدیہ! السلام علیکم!', style: 'Cheerful sweet toddler greeting' },

  // Bear
  { id: 'bear_1', text: 'مہدیہ! تمہارا بابا کدھر ہے؟', style: 'Gentle warm cuddly teddy bear voice' },
  { id: 'bear_2', text: 'مہدیہ! پیاری مہدیہ، السلام علیکم!', style: 'Warm affectionate sweet greeting for little Mahdiya' },
  { id: 'bear_3', text: 'مہدیہ! کیا کر رہی ہو؟ بگ ہَگ!', style: 'Gentle joyful child voice' },

  // Duck
  { id: 'duck_1', text: 'مہدیہ! کیا کر رہی ہو؟ کویک کویک!', style: 'Playful cute duckling baby voice' },
  { id: 'duck_2', text: 'مہدیہ! کیسی ہو؟ السلام علیکم!', style: 'Bright happy cheerful baby voice' },
  { id: 'duck_3', text: 'مہدیہ! تمہارا بابا کدھر ہے؟', style: 'Cute bouncy child voice' },

  // Mahdiya Special Button
  { id: 'mahdiya_1', text: 'مہدیہ! کیسی ہو، پیاری گڑیا؟', style: 'Very sweet loving cute baby voice calling Mahdiya' },
  { id: 'mahdiya_2', text: 'مہدیہ! کیا کر رہی ہو؟', style: 'Playful affectionate toddler voice' },
  { id: 'mahdiya_3', text: 'مہدیہ! تمہارا بابا کدھر ہے؟', style: 'Sweet friendly child voice asking about Baba' },
  { id: 'mahdiya_4', text: 'مہدیہ! تمہاری ماما کدھر ہے؟', style: 'Sweet friendly child voice asking about Mama' },
  { id: 'mahdiya_5', text: 'مہدیہ! السلام علیکم! آئی لو یو!', style: 'Cheerful enthusiastic cute greeting with lots of love' },
  { id: 'mahdiya_6', text: 'مہدیہ! شاباش، پیاری بچی!', style: 'Warm encouraging sweet praising voice' },
];

async function generateAll() {
  console.log(`Starting generation of ${clips.length} audio clips...`);
  for (const clip of clips) {
    const filePath = path.join(audioDir, `${clip.id}.wav`);
    if (fs.existsSync(filePath)) {
      console.log(`Already exists: ${clip.id}.wav`);
      continue;
    }

    console.log(`Generating ${clip.id}: "${clip.text}"...`);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: clip.text,
                speechMetadata: {
                  style: clip.style,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        fs.writeFileSync(filePath, Buffer.from(base64Audio, 'base64'));
        console.log(`✓ Saved ${clip.id}.wav (${base64Audio.length} bytes)`);
      } else {
        console.warn(`✗ No audio data returned for ${clip.id}`);
      }
    } catch (err) {
      console.error(`✗ Error generating ${clip.id}:`, err);
    }
    // Small delay to be polite with rate limits
    await new Promise((r) => setTimeout(r, 600));
  }
  console.log('Finished audio generation!');
}

generateAll();
