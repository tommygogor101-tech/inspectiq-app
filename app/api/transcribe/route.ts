import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('audio') as File;
  const sectionHint = formData.get('section') as string; // Optional current section

  if (!file) {
    return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
  }

  try {
    // Transcribe audio
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
    });

    const text = transcription.text;

    // Now, map to structured data using GPT
    const prompt = `
      You are an expert building inspector assistant. Given the following transcription from a voice note during an inspection, parse it into structured report data.
      Identify the relevant section (e.g., "Roof Void", "Bathroom", "Kitchen", "Electrical", etc.).
      Extract defect description, severity (Minor, Major, Safety Hazard), and recommended action.
      If the transcription mentions keywords like "roof void", map to "Roof Void" section.

      Transcription: ${text}

      Output as JSON: {
        "section": string,
        "defect": string,
        "severity": "Minor" | "Major" | "Safety Hazard",
        "description": string,
        "recommendation": string
      }
      If multiple items, output an array of such objects.
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });

    const structuredData = JSON.parse(completion.choices[0].message.content);

    return NextResponse.json({ text, structured: structuredData });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
