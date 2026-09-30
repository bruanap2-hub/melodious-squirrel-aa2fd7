import { GoogleGenAI } from "@google/genai";
import { writeFile, mkdir } from "node:fs/promises";

const ai = new GoogleGenAI({
  apiKey: process.env.NETLIFY_AI_GATEWAY_KEY,
  httpOptions: {
    baseUrl: process.env.NETLIFY_AI_GATEWAY_BASE_URL?.replace(/\/$/, ""),
  },
});
const scenes = {
  school: `An exquisitely detailed cinematic film still, wide 16:9, photorealistic historic magical academy cloister, no people, no text, no lettering. An enormous intricate gothic stone archway at the right third of the image, looking through open carved ancient oak doors into a warmly glowing amber great hall, countless lit candles and soft god rays and fine dust suspended in air. A long weathered medieval stone corridor occupies left half, deep olive charcoal shadows, aged carved pillars, green ivy delicately climbing the stone, old brass lanterns. Foreground rough stone floor reflecting pale amber candlelight. Monumental high vaulted ceilings partially lost in darkness. Light mist drifting at floor level. Restrained antique gold and dark forest green palette, enchanting, emotionally welcoming, old European craftsmanship, atmospheric perspective, film grain, ultra realistic textures. Left 55 percent of image must be dark, atmospheric quiet negative space suitable for overlaying cream typography. The doorway on right is the strong focal point. Camera at human eye level, 28mm lens. A beautiful expensive fantasy film production set, timeless and grounded, no neon, no game aesthetic, no floating props.`,
  academy: `Cinematic widescreen 16:9 photorealistic interior of an ancient magical school's portrait gallery, no people, no text, no paintings or existing picture frames. Warm aged stone walls with many large unadorned expanses where paintings could later be hung. Dark carved oak wainscoting, rich medieval materials, huge ribbed vaulted ceiling, deep corridor and a tall arched window toward the right with dusty amber sunlight. Six brass wall candle sconces casting gentle pools of warm golden light. A wood bench, small antique globes and old books in corners. Front facing broad wall composition across most of the image, depth and vanishing perspective visible at right edge. Muted umber, dark olive, aged golden bronze color palette. Subtle haze, very detailed natural textures, intimate warm inviting emotionally nostalgic mood. No graphics no text no human figures, no neon. Gentle cinematic contrast with visible midtones on wall, fine film grain.`,
};
await mkdir("public/img", { recursive: true });
for (const [name, prompt] of Object.entries(scenes)) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image",
      contents: prompt,
      config: {
        responseModalities: ["IMAGE"],
        imageConfig: { aspectRatio: "16:9" },
      },
    });
    const part = response.candidates?.[0]?.content?.parts?.find(
      (p) => p.inlineData,
    );
    if (!part) throw new Error("No image returned");
    await writeFile(
      `public/img/${name}.png`,
      Buffer.from(part.inlineData.data, "base64"),
    );
    console.log(`Saved ${name}.png`);
  } catch {
    console.error(`Scene generation failed: ${name}`);
    process.exitCode = 1;
  }
}
