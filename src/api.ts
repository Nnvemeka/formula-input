export const fetchAutocompleteSuggestions = async (query: string) => {
  const response = await fetch(
    "https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete"
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data.filter((item: any) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );
};
