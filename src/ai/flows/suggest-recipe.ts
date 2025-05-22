// This file is machine-generated - edit with caution!

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

const SuggestRecipeOutputSchema = z.object({
  recipes: z
    .array(z.string())
    .describe('A list of suggested recipes based on the ingredients.'),
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

  Suggest recipes that primarily use the following ingredients:
  {{#each ingredients}}- {{{this}}}
  {{/each}}

  If possible, use the tool to determine when substitutions can be made.
  Recipes: `,
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
    return output!;
  }
);
