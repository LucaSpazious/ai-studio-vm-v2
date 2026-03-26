import Replicate from "replicate";

const MODEL = "black-forest-labs/flux-kontext-pro" as const;

interface GenerateParams {
  inputImageUrl: string;
  prompt: string;
}

interface GenerateResult {
  imageUrl: string;
  generationTimeMs: number;
}

function getClient(): Replicate {
  return new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
}

/** Generate a single lifestyle variation */
export async function generateLifestyleImage(
  params: GenerateParams
): Promise<GenerateResult> {
  const replicate = getClient();
  const start = Date.now();

  const output = (await replicate.run(MODEL, {
    input: {
      input_image: params.inputImageUrl,
      prompt: params.prompt,
      output_format: "jpg",
      output_quality: 90,
    },
  })) as { url: () => URL };

  const imageUrl = output.url().toString();
  const generationTimeMs = Date.now() - start;

  return { imageUrl, generationTimeMs };
}

/** Generate variations sequentially (1 at a time to avoid Replicate saturation) */
export async function generateLifestyleVariations(
  params: GenerateParams,
  _count: number = 3
): Promise<GenerateResult[]> {
  // TODO: restore parallel generation once Replicate concurrency is stable
  void _count;
  const result = await generateLifestyleImage(params);
  return [result];
}
