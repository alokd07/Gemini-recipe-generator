"use client";

import type { SuggestRecipeOutput } from "@/ai/flows/suggest-recipe";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface RecipeDisplayProps {
  recipeOutput: SuggestRecipeOutput;
}

function formatRecipeText(text: string) {
  // Basic formatting: split by newlines, treat lines starting with "Ingredients:" or "Instructions:" as headers.
  const lines = text.split('\\n').map(line => line.trim()).filter(line => line.length > 0);
  let inIngredients = false;
  let inInstructions = false;

  return lines.map((line, index) => {
    const lowerLine = line.toLowerCase();
    if (lowerLine.startsWith("ingredients:")) {
      inIngredients = true;
      inInstructions = false;
      return <h4 key={index} className="font-semibold mt-2 mb-1 text-lg">{line}</h4>;
    }
    if (lowerLine.startsWith("instructions:") || lowerLine.startsWith("steps:")) {
      inInstructions = true;
      inIngredients = false;
      return <h4 key={index} className="font-semibold mt-2 mb-1 text-lg">{line}</h4>;
    }
    if (inIngredients && (line.startsWith("-") || line.startsWith("*"))) {
      return <li key={index} className="ml-4 list-disc">{line.substring(1).trim()}</li>;
    }
    if (inInstructions && /^\d+\./.test(line)) {
       return <li key={index} className="ml-4 list-decimal">{line.substring(line.indexOf(".") + 1).trim()}</li>;
    }
    return <p key={index} className="mb-1">{line}</p>;
  });
}


export function RecipeDisplay({ recipeOutput }: RecipeDisplayProps) {
  if (!recipeOutput || recipeOutput.recipes.length === 0) {
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
            <CardTitle className="text-xl text-accent-foreground">Recipe Idea {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-accent-foreground prose-p:text-foreground prose-li:text-foreground">
             {formatRecipeText(recipe)}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
