
"use client";

import type { SuggestRecipeOutput } from "@/ai/flows/suggest-recipe";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface RecipeDisplayProps {
  recipeOutput: SuggestRecipeOutput;
}

export function RecipeDisplay({ recipeOutput }: RecipeDisplayProps) {
  if (!recipeOutput || !recipeOutput.recipes || recipeOutput.recipes.length === 0) {
    return (
      <div className="text-center py-10">
        <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No recipes found for the given ingredients.</p>
        <p className="text-sm text-muted-foreground">Try adding more or different ingredients!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-3xl font-bold text-center text-primary">Recipe Suggestions</h2>
      {recipeOutput.recipes.map((recipe, index) => (
        <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl text-accent-foreground">{recipe.title || `Recipe Idea ${index + 1}`}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-primary">Ingredients:</h3>
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-foreground">
                  {recipe.ingredients.map((ingredient, i) => (
                    <li key={`ingredient-${index}-${i}`}>{ingredient}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No ingredients listed.</p>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-primary">Instructions:</h3>
              {recipe.instructions && recipe.instructions.length > 0 ? (
                <ol className="list-decimal pl-5 space-y-2 text-foreground">
                  {recipe.instructions.map((step, i) => (
                    <li key={`instruction-${index}-${i}`}>{step}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted-foreground">No instructions provided.</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
