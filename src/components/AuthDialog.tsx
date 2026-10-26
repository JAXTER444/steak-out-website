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

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { signIn } = useAuthActions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  const handleEmailAuth = async (event: { preventDefault: () => void; currentTarget: HTMLFormElement }) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    formData.set("flow", activeTab === "login" ? "signIn" : "signUp");

    try {
      await signIn("password", formData);
      onOpenChange(false);
      toast.success(activeTab === "login" ? "Welcome back!" : "Account created!");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error ?? "");
      if (activeTab === "signup" && /already exists/i.test(message)) {
        toast.error("An account with this email already exists. Log in instead.");
        setActiveTab("login");
      } else if (activeTab === "login") {
        toast.error("Invalid email or password.");
      } else {
        toast.error("Could not create account. Check your details and try again.");
      }
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
