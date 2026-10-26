import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

const PasswordProvider = Password({
  profile(params) {
    const email = params.email as string;
    const name = params.name as string | undefined;
    if (name) {
      return { email, name };
    }
    return { email };
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [PasswordProvider],
});
