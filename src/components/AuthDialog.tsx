import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { signIn } = useAuthActions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signIn("google");
      onOpenChange(false);
    } catch {
      toast.error("Could not sign in with Google. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailAuth = async (event: { preventDefault: () => void; currentTarget: HTMLFormElement }) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    formData.set("flow", activeTab === "login" ? "signIn" : "signUp");

    try {
      await signIn("password", formData);
      onOpenChange(false);
      toast.success(activeTab === "login" ? "Welcome back!" : "Account created!");
    } catch {
      toast.error(
        activeTab === "login"
          ? "Invalid email or password."
          : "Could not create account. Check your details and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-[8px] border-2 border-black p-0 overflow-hidden">
        <div className="p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-medium text-gray-900">
              {activeTab === "login" ? "Welcome back" : "Create an account"}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Sign in to save your cart and track orders.
            </DialogDescription>
          </DialogHeader>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 gap-3 border-2 border-gray-200 bg-white hover:bg-gray-50"
            onClick={() => void handleGoogleSignIn()}
            disabled={isSubmitting}
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "login" | "signup")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Log in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form className="space-y-4" onSubmit={(e) => void handleEmailAuth(e)}>
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="h-12 bg-gray-50 border-gray-200 focus:border-[#EE101A] focus:ring-[#EE101A]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="h-12 bg-gray-50 border-gray-200 focus:border-[#EE101A] focus:ring-[#EE101A]"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 rounded-[6px] text-base"
                  style={{ backgroundColor: "#0B0B0B", color: "white" }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Log in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form className="space-y-4" onSubmit={(e) => void handleEmailAuth(e)}>
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Name</Label>
                  <Input
                    id="signup-name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    className="h-12 bg-gray-50 border-gray-200 focus:border-[#EE101A] focus:ring-[#EE101A]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="h-12 bg-gray-50 border-gray-200 focus:border-[#EE101A] focus:ring-[#EE101A]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                    className="h-12 bg-gray-50 border-gray-200 focus:border-[#EE101A] focus:ring-[#EE101A]"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 rounded-[6px] text-base"
                  style={{ backgroundColor: "#EE101A", color: "white" }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
