"use client";

import { useState } from "react";
import Image from "next/image";
import { IngredientInputForm } from "@/components/fridge-chef/ingredient-input-form";
import { RecipeDisplay } from "@/components/fridge-chef/recipe-display";
import type { SuggestRecipeOutput, SuggestRecipeInput } from "@/ai/flows/suggest-recipe";
import { suggestRecipe } from "@/ai/flows/suggest-recipe";
import { useToast } from "@/hooks/use-toast";
import { Utensils } from "lucide-react";

export default function FridgeChefPage() {
  const [suggestedRecipeOutput, setSuggestedRecipeOutput] = useState<SuggestRecipeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGetRecipe = async (ingredients: string[]) => {
    setIsLoading(true);
    setError(null);
    setSuggestedRecipeOutput(null);

    const input: SuggestRecipeInput = { ingredients };

    try {
      const output = await suggestRecipe(input);
      setSuggestedRecipeOutput(output);
      if (!output || output.recipes.length === 0) {
        toast({
          title: "No Recipes Found",
          description: "Try adding more or different ingredients.",
        });
      }
    } catch (e) {
      console.error("Error fetching recipe:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to get recipe suggestions. ${errorMessage}`);
      toast({
        title: "Error",
        description: `Failed to get recipes: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-background to-secondary/30">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-primary rounded-full mb-4 shadow-md">
          <Utensils className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-primary">
          Fridge Chef
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-md mx-auto">
          Enter your ingredients and let our AI chef whip up some delicious recipe ideas for you!
        </p>
      </header>

      <main className="w-full max-w-2xl space-y-8">
        <IngredientInputForm onSubmit={handleGetRecipe} isLoading={isLoading} />

        {error && (
          <div className="text-center p-4 bg-destructive/10 text-destructive rounded-md shadow">
            <p>{error}</p>
          </div>
        )}

        {suggestedRecipeOutput && (
          <RecipeDisplay recipeOutput={suggestedRecipeOutput} />
        )}
        
        {!isLoading && !suggestedRecipeOutput && !error && (
          <div className="text-center py-10 opacity-70">
            <Image
              src="https://placehold.co/300x200.png"
              alt="Empty plate waiting for recipe ideas"
              data-ai-hint="food cooking"
              width={300}
              height={200}
              className="mx-auto rounded-lg shadow-md mb-4"
            />
            <p className="text-muted-foreground">Your recipe suggestions will appear here.</p>
          </div>
        )}
      </main>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Fridge Chef. Cook with what you have!</p>
      </footer>
    </div>
  );
}
