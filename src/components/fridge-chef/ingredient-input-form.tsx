"use client";

import type * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, X, ChefHat, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface IngredientInputFormProps {
  onSubmit: (ingredients: string[]) => Promise<void>;
  isLoading: boolean;
}

export function IngredientInputForm({ onSubmit, isLoading }: IngredientInputFormProps) {
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [addedIngredients, setAddedIngredients] = useState<string[]>([]);
  const { toast } = useToast();

  const handleAddIngredient = () => {
    const trimmedIngredient = currentIngredient.trim();
    if (trimmedIngredient && !addedIngredients.includes(trimmedIngredient.toLowerCase())) {
      setAddedIngredients([...addedIngredients, trimmedIngredient.toLowerCase()]);
      setCurrentIngredient("");
    } else if (addedIngredients.includes(trimmedIngredient.toLowerCase())) {
      toast({
        title: "Duplicate Ingredient",
        description: `${trimmedIngredient} is already in your list.`,
        variant: "destructive",
      });
    } else {
       toast({
        title: "Empty Ingredient",
        description: "Please enter an ingredient name.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveIngredient = (ingredientToRemove: string) => {
    setAddedIngredients(addedIngredients.filter(ingredient => ingredient !== ingredientToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addedIngredients.length === 0) {
      toast({
        title: "No Ingredients",
        description: "Please add some ingredients first.",
        variant: "destructive",
      });
      return;
    }
    onSubmit(addedIngredients);
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-primary">What's in Your Fridge?</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex space-x-2">
            <Input
              type="text"
              value={currentIngredient}
              onChange={(e) => setCurrentIngredient(e.target.value)}
              placeholder="e.g., Chicken, Tomatoes, Onion"
              className="flex-grow"
              aria-label="Enter an ingredient"
            />
            <Button type="button" onClick={handleAddIngredient} variant="outline" size="icon" aria-label="Add ingredient">
              <PlusCircle className="h-5 w-5" />
            </Button>
          </div>

          {addedIngredients.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Your Ingredients:</h3>
              <div className="flex flex-wrap gap-2">
                {addedIngredients.map(ingredient => (
                  <Badge key={ingredient} variant="secondary" className="py-1 px-3 text-sm capitalize">
                    {ingredient}
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(ingredient)}
                      className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5"
                      aria-label={`Remove ${ingredient}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading || addedIngredients.length === 0}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finding Recipes...
              </>
            ) : (
              <>
                <ChefHat className="mr-2 h-5 w-5" />
                Get Recipe Suggestions
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
