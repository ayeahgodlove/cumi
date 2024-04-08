import { TOKEN_KEY } from "@constants/constant";

export const useToken = () => {
  let token = "";
  if (typeof window !== 'undefined') {
    token = JSON.parse(
      JSON.stringify(window.localStorage.getItem(TOKEN_KEY)!)
    );
}


  return {
    token,
  };
};
