import Auth0Provider from "next-auth/providers/auth0";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { emptyUser } from "../domain/models/user";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import { User } from "../data/entities/index";
import { AuthOptions } from "next-auth";

const authOptions: AuthOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID ?? "",
      clientSecret: process.env.AUTH0_CLIENT_SECRET ?? "",
      issuer: process.env.AUTH0_ISSUER_BASE_URL ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          value: "ayeahchanser@gmail.com",
        },
        password: { label: "Password", type: "password", value: "Admin@2024" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const currentUser = await User.findOne({
          where: { email: credentials.email },
        });
        if (!currentUser) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials?.password,
          "currentUser.password"
        );
        if (!isPasswordValid) {
          return null;
        }

        const { password, ...userWithoutPassword } = currentUser.toJSON();
        return userWithoutPassword; // User must contain { id, name, email, image }.
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        const userItem = await User.findOne({
          where: { email: user?.email ?? "" },
        });
        const data = userItem?.toJSON();
        token.id = data?.id;
        token.name = data?.username;
        token.email = data?.email;
        token.provider = account?.provider;
        token.role = data?.role || "user";
      }
      return token;
    },

    async session({ session, token }) {
      // Add user info from token to session
      if (session.user) {
        session.user.id = token.id as string ?? "";
        session.user.name = token.name ?? "";
        session.user.email = token.email ?? "";
        session.user.image = token.picture ?? "";
        // session.user.provider = token.provider ?? "";
        session.user.role = (token.role as string) ?? "";
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      if (account?.provider !== "credentials") {
        try {
          // find user by email
          const existingUser = await User.findOne({
            where: { email: user?.email ?? "" },
          });
          if (!existingUser) {
            await User.create({
              ...emptyUser,
              id: nanoid(20),
              username: `${user.name}`,
              email: `${user.email}`,
              // image: `${user.image}`,
              authStrategy: account?.provider,
              role: "user",
              verified: true,
              fullname: `${user.name}`,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        } catch (error: any) {
          return false;
        }
      }
      return true;
    },
  },
  secret: process.env.AUTH0_SECRET,
  pages: {
    signIn: "/login",
    newUser: "/",
  },
};

export default authOptions;
