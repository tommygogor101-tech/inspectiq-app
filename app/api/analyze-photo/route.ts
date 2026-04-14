import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: Request) {
  const formData = await request.formData();
  const photo = formData.get('photo') as File;

  if (!photo) {
    return new Response(JSON.stringify({ error: 'No photo provided' }), { status: 400 });
  }

  const buffer = await photo.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const mediaType = photo.type || 'image/jpeg';

  const prompt = `Analyze this building inspection photo for defects. Provide:
- defects: array of objects with:
  - description: string
  - severity: "Minor" | "Major" | "Safety Hazard"
  - as_code: relevant Australian Standard code if applicable, else ""
  - recommendation: string
Output only valid JSON.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
          { type: 'text', text: prompt }
        ]
      }]
    });

    const analysisText = response.content[0].type === 'text' ? response.content[0].text : '';
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (e) {
      analysis = { error: 'Failed to parse AI response', raw: analysisText };
    }

    return new Response(JSON.stringify(analysis), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Analysis failed' }), { status: 500 });
  }
}