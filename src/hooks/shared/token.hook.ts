import { TOKEN_KEY } from "@constants/constant";

export const useToken = () => {
  let token = "";
  if (typeof window !== "undefined") {
    token = JSON.parse(window.localStorage.getItem(TOKEN_KEY)!);
  }

  return {
    token,
  };
};

