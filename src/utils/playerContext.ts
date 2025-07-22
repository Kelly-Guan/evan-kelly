const PLAYER_KEY = "evansweeper-player";

export const setCurrentPlayer = (name: "Kelly" | "Evan") => {
  localStorage.setItem(PLAYER_KEY, name);
};

export const getCurrentPlayer = (): "Kelly" | "Evan" | null => {
  return localStorage.getItem(PLAYER_KEY) as "Kelly" | "Evan" | null;
};

export const clearCurrentPlayer = () => {
  localStorage.removeItem(PLAYER_KEY);
};
