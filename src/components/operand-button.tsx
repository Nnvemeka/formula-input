type OperandButtonProps = {
  value: string;
  onClick: () => void;
};

export const OperandButton = ({ value, onClick }: OperandButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 flex items-center justify-center border rounded hover:bg-gray-100"
    >
      {value}
    </button>
  );
};
