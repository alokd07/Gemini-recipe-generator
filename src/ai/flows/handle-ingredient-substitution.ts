'use server';
/**
 * @fileOverview Handles ingredient substitutions using an AI agent.
 *
 * - handleIngredientSubstitution - A function that suggests ingredient substitutions and explains the reasoning.
 * - HandleIngredientSubstitutionInput - The input type for the handleIngredientSubstitution function.
 * - HandleIngredientSubstitutionOutput - The return type for the handleIngredientSubstitution function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HandleIngredientSubstitutionInputSchema = z.object({
  recipe: z.string().describe('The recipe for which to suggest ingredient substitutions.'),
  availableIngredients: z.array(z.string()).describe('A list of ingredients currently available.'),
});
export type HandleIngredientSubstitutionInput = z.infer<typeof HandleIngredientSubstitutionInputSchema>;

const HandleIngredientSubstitutionOutputSchema = z.object({
  substitutedRecipe: z.string().describe('The recipe with suggested ingredient substitutions.'),
  explanation: z.string().describe('An explanation of why the substitutions were made.'),
});
export type HandleIngredientSubstitutionOutput = z.infer<typeof HandleIngredientSubstitutionOutputSchema>;

export async function handleIngredientSubstitution(input: HandleIngredientSubstitutionInput): Promise<HandleIngredientSubstitutionOutput> {
  return handleIngredientSubstitutionFlow(input);
}

const canSubstituteIngredient = ai.defineTool({
  name: 'canSubstituteIngredient',
  description: 'Determines if an ingredient in a recipe can be substituted based on available ingredients.',
  inputSchema: z.object({
    recipe: z.string().describe('The recipe to evaluate.'),
    ingredientToSubstitute: z.string().describe('The ingredient in the recipe to consider substituting.'),
    availableIngredients: z.array(z.string()).describe('A list of ingredients currently available.'),
  }),
  outputSchema: z.object({
    canSubstitute: z.boolean().describe('Whether the ingredient can be substituted.'),
    substitutionSuggestion: z.string().describe('If substitutable, provide a suggestion for what to use instead, otherwise leave blank.'),
    reason: z.string().describe('The reason why the substitution is possible or not possible.'),
  }),
},
async (input) => {
    // This is a placeholder implementation.  A real implementation would use a database
    // or an LLM to determine if a substitution is possible.
    if (input.ingredientToSubstitute === 'some-specific-ingredient') {
      return {
        canSubstitute: true,
        substitutionSuggestion: 'alternative-ingredient',
        reason: 'Because it is similar.',
      };
    }

    return {
      canSubstitute: false,
      substitutionSuggestion: '',
      reason: 'No suitable alternative found in available ingredients.',
    };
  }
);


const prompt = ai.definePrompt({
  name: 'handleIngredientSubstitutionPrompt',
  input: {schema: HandleIngredientSubstitutionInputSchema},
  output: {schema: HandleIngredientSubstitutionOutputSchema},
  tools: [canSubstituteIngredient],
  prompt: `You are a recipe assistant. Given a recipe and a list of available ingredients, determine if any ingredients in the recipe can be substituted based on the available ingredients. Use the canSubstituteIngredient tool to determine if a substitution can be made.

Recipe: {{{recipe}}}
Available Ingredients: {{#each availableIngredients}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Output the recipe with substitutions made, and explain why those substitutions were made. If no substitutions were necessary, output the original recipe and explain that no substitutions were needed.`,
});

const handleIngredientSubstitutionFlow = ai.defineFlow(
  {
    name: 'handleIngredientSubstitutionFlow',
    inputSchema: HandleIngredientSubstitutionInputSchema,
    outputSchema: HandleIngredientSubstitutionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
