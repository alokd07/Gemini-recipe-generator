
'use server';

/**
 * @fileOverview Recipe suggestion flow.
 *
 * suggestRecipe - A function that takes a list of ingredients and suggests recipes.
 * SuggestRecipeInput - The input type for the suggestRecipe function.
 * SuggestRecipeOutput - The return type for the suggestRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRecipeInputSchema = z.object({
  ingredients: z
    .array(z.string())
    .describe('A list of ingredients the user has on hand.'),
});
export type SuggestRecipeInput = z.infer<typeof SuggestRecipeInputSchema>;

const RecipeDetailSchema = z.object({
  title: z.string().describe('The name or title of the suggested recipe.'),
  ingredients: z.array(z.string()).describe('A comprehensive list of all ingredients needed for this recipe, including quantities if appropriate (e.g., "1 cup of flour", "2 chicken breasts").'),
  instructions: z.array(z.string()).describe('A list of clear, step-by-step cooking instructions for preparing the recipe. Each step should be a separate string in the array.'),
});

const SuggestRecipeOutputSchema = z.object({
  recipes: z
    .array(RecipeDetailSchema)
    .describe('A list of suggested recipes. Each recipe must include a title, a list of ingredients, and a list of detailed cooking instructions.'),
});
export type SuggestRecipeOutput = z.infer<typeof SuggestRecipeOutputSchema>;

const canSubstituteIngredient = ai.defineTool({
  name: 'canSubstituteIngredient',
  description: 'Determines if an ingredient in a recipe can be substituted with another ingredient the user has on hand.',
  inputSchema: z.object({
    recipeIngredient: z.string().describe('The ingredient in the recipe.'),
    availableIngredients: z
      .array(z.string())
      .describe('The ingredients the user has on hand.'),
  }),
  outputSchema: z.boolean(),
}, async input => {
  // Dummy implementation that always returns false.
  // In a real scenario, this could involve more complex logic or another AI call.
  return false;
});

export async function suggestRecipe(input: SuggestRecipeInput): Promise<SuggestRecipeOutput> {
  return suggestRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRecipePrompt',
  input: {schema: SuggestRecipeInputSchema},
  output: {schema: SuggestRecipeOutputSchema},
  prompt: `You are a helpful chef that suggests recipes based on the ingredients a user has on hand.
Your goal is to provide clear, structured recipe information.

For each recipe suggestion, you MUST provide:
1.  \`title\`: A concise and appealing name for the recipe.
2.  \`ingredients\`: A list of all necessary ingredients. Include quantities if natural (e.g., "1 cup of flour", "2 chicken breasts"). Each ingredient should be a separate string in the array.
3.  \`instructions\`: A list of step-by-step cooking instructions. Each step should be a separate string in the array, detailing a clear and actionable part of the cooking process.

The user has the following ingredients:
{{#each ingredients}}
- {{{this}}}
{{/each}}

Please suggest one or more recipes using these ingredients. Ensure your output strictly adheres to the \`SuggestRecipeOutputSchema\` format, particularly the \`recipes\` array with \`title\`, \`ingredients\`, and \`instructions\` fields for each recipe.

If relevant, you can use the \`canSubstituteIngredient\` tool to check for ingredient substitutions, but prioritize providing complete recipes as described.`,
  tools: [canSubstituteIngredient],
});

const suggestRecipeFlow = ai.defineFlow(
  {
    name: 'suggestRecipeFlow',
    inputSchema: SuggestRecipeInputSchema,
    outputSchema: SuggestRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Ensure output is not null and conforms to the schema, especially for the 'recipes' array.
    // If output is null or recipes array is missing/empty, return a valid empty structure.
    if (!output || !output.recipes) {
        return { recipes: [] };
    }
    return output;
  }
);

