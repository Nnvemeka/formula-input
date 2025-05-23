type AutocompleteProps = {
  suggestions: Array<{
    id: string;
    name: string;
    category: string;
    value: string | number;
  }>;
  selectedIndex: number;
  onSelect: (suggestion: {
    id: string;
    name: string;
    value: string | number;
  }) => void;
};

export const Autocomplete = ({
  suggestions,
  selectedIndex,
  onSelect,
}: AutocompleteProps) => {
  // Don't show anything if no suggestions
  if (suggestions.length === 0) {
    return null;
  }
  return (
    <div className="absolute z-10 mt-1 w-full max-w-md bg-white border border-gray-300 rounded shadow-lg">
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          onClick={() => {
            requestAnimationFrame(() => onSelect(suggestion));
          }}
          className={`p-2 cursor-pointer ${
            index === selectedIndex
              ? "bg-blue-50 text-[blue.500]"
              : "hover:bg-gray-50"
          }`}
        >
          <div className="font-medium">{suggestion.name}</div>
        </div>
      ))}
    </div>
  );
};
