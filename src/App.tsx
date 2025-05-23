import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FormulaInput } from "./components/formula-input";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Formula Input</h1>
        <FormulaInput />
      </div>
    </QueryClientProvider>
  );
}

export default App;
