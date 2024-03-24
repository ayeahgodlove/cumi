import { TOKEN_KEY } from "@constants/constant";

export const useToken = () => {
  const token = JSON.parse(
    JSON.stringify(window.localStorage.getItem(TOKEN_KEY)!)
  );
  return {
    token,
  };
};
