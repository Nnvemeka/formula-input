import { useState } from "react";
import { useFormulaStore } from "../store";

type TagProps = {
  token: {
    id: string;
    type: "variable" | "number" | "operator";
    name?: string;
    value: string | number;
  };
};

export const Tag = ({ token }: TagProps) => {
  const { setActiveTagId, activeTagId } = useFormulaStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleTagClick = () => {
    if (token.type === "variable") {
      setIsDropdownOpen(!isDropdownOpen);
      setActiveTagId(token.id);
    }
  };

  return (
    <div className="relative">
      <div
        onClick={handleTagClick}
        className={`flex items-center gap-1  py-1 rounded-xl cursor-pointer ${
          token.type === "variable" ? "px-2 bg-blue-100 text-blue-800" : "px-1"
        }`}
      >
        {token.name}
      </div>
      {isDropdownOpen && activeTagId === token.id && (
        <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-300 rounded shadow-lg">
          <div className="p-2">
            <div className="font-medium">{token.value}</div>
            <div className="text-sm text-gray-500">Variable details</div>
          </div>
        </div>
      )}
    </div>
  );
};
