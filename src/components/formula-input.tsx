import { useState, useRef, type KeyboardEvent } from "react";
import { useFormulaStore, type Token } from "../store";
import { useQuery } from "@tanstack/react-query";
import { fetchAutocompleteSuggestions } from "../api";
import { Tag } from "./tag";
import { Autocomplete } from "./auto-complete";

// Add this utility function
const calculateFormula = (tokens: Token[]): number | null => {
  try {
    // Convert tokens to a calculable string
    const expression = tokens
      .map((token) => {
        return token.value;
      })
      .join(" ");

    // Use Function constructor for safe evaluation
    return new Function(`return ${expression}`)();
  } catch (error) {
    console.error("Calculation error:", error);
    return null;
  }
};

export const FormulaInput = () => {
  const {
    tokens,
    inputValue,
    showAutocomplete,
    setInputValue,
    setShowAutocomplete,
    addToken,
    // setActiveTagId,
  } = useFormulaStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

  const result = calculateFormula(tokens);

  // Check if input is number or operator
  const isNumberOrOperator = (value: string) => {
    return /^[\d+\-*/^()]+$/.test(value);
  };

  const { data: suggestions = [] } = useQuery({
    queryKey: ["autocomplete", inputValue],
    queryFn: () => fetchAutocompleteSuggestions(inputValue),
    enabled: showAutocomplete && !isNumberOrOperator(inputValue),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowAutocomplete(!isNumberOrOperator(value));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " && inputValue.trim() !== "") {
      // Space key pressed
      e.preventDefault();

      // Determine token type
      const type = isNumberOrOperator(inputValue)
        ? /\d/.test(inputValue)
          ? "number"
          : "operator"
        : "variable";

      addToken({
        id: `token-${Date.now()}`,
        type,
        name: inputValue.trim(),
        value: inputValue.trim(),
      });

      setInputValue("");
      setShowAutocomplete(false);
    }

    if (e.key === "Enter" && showAutocomplete && suggestions.length > 0) {
      const selectedSuggestion = suggestions[selectedSuggestionIndex];
      addToken({
        id: selectedSuggestion.id,
        type: "variable",
        name: selectedSuggestion.name,
        value: selectedSuggestion.value,
      });
      setInputValue("");
      setShowAutocomplete(false);
    } else if (e.key === "Backspace" && inputValue === "") {
      if (tokens.length > 0) {
        const lastToken = tokens[tokens.length - 1];
        useFormulaStore.getState().removeToken(lastToken.id);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        Math.min(prev + 1, suggestions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleSelectSuggestion = (suggestion: {
    id: string;
    name: string;
    value: string | number;
  }) => {
    if (!suggestion.name) {
      console.error("Suggestion missing name", suggestion);
      return;
    }

    const numericValue =
      typeof suggestion.value === "string"
        ? parseFloat(suggestion.value) || 0
        : suggestion.value;

    const newToken = {
      id: suggestion.id,
      type: "variable" as const,
      name: suggestion?.name,
      value: numericValue,
    };

    addToken(newToken);

    setInputValue("");
    setShowAutocomplete(false);
    inputRef.current?.focus();
  };

  return (
    <div className="p-4 max-w-2xl mx-auto relative">
      <div className="flex flex-wrap items-center gap-2 p-2 border rounded min-h-12 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
        {tokens.map((token, index) => (
          <Tag key={index} token={token} />
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-20 outline-none"
          placeholder={tokens.length === 0 ? "Enter a formula" : ""}
        />

        {showAutocomplete && inputValue && !isNumberOrOperator(inputValue) && (
          <div className="absolute left-0 right-0 mt-1 z-50">
            <Autocomplete
              suggestions={suggestions}
              selectedIndex={selectedSuggestionIndex}
              onSelect={handleSelectSuggestion}
            />
          </div>
        )}
      </div>
      <div className=" flex gap-2 items-center mt-4 p-2 bg-gray-50 rounded w-full">
        <div className="text-sm text-gray-500">Result:</div>
        <div className="text-md font-mono">
          {result !== null ? result : "Invalid formula"}
        </div>
      </div>
    </div>
  );
};
