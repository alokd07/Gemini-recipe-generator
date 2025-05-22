import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-recipe.ts';
import '@/ai/flows/handle-ingredient-substitution.ts';