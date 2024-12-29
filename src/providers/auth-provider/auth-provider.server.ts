// import { TOKEN_KEY } from "@constants/constant";
// "use server";
import { AuthBindings } from "@refinedev/core";
import { cookies, } from "next/headers";

export const authProviderServer: Pick<AuthBindings, "check"> = {
  check: async () => {
    const cookieStore = cookies();
    const auth = cookieStore.get("auth");

    if (auth) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
    };
  },
  // check: async () => {
  //   const token = JSON.parse(
  //     JSON.stringify(localStorage.getItem(TOKEN_KEY)!)
  //   );
  //   if (token) {
  //     return {
  //       authenticated: true,
  //     };
  //   }

  //   return {
  //     authenticated: false,
  //     logout: true,
  //     redirectTo: "/login",
  //   };
  // },
};
