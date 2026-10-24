import { Button } from "./ui/button";
import SteakOutFlame from "../imports/SteakOutFlame-8-153";
import { motion, AnimatePresence } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { ShoppingCart, Menu, X, LogOut, User } from "lucide-react";
import { useConvexAuth } from "convex/react";
import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { AuthDialog } from "./AuthDialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useCart } from "../contexts/CartContext";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.currentUser);
  const { totalQuantity } = useCart();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const pages = [
    { id: 'menu', label: 'Menu' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' }
  ];

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const buttonsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const activeButton = buttonsRef.current[currentPage];
    if (activeButton) {
      const rect = activeButton.getBoundingClientRect();
      const containerRect = activeButton.parentElement?.getBoundingClientRect();
      if (containerRect) {
        setIndicatorStyle({
          left: rect.left - containerRect.left,
          width: rect.width
        });
      }
    } else {
      // Hide indicator if currentPage is not in the pages list (e.g., cart page)
      setIndicatorStyle({
        left: 0,
        width: 0
      });
    }
  }, [currentPage]);

  const handleNavClick = (page: string) => {
    onPageChange(page);
    setIsMobileMenuOpen(false);
  };

  const openAuthDialog = () => {
    setAuthDialogOpen(true);
    setIsMobileMenuOpen(false);
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "Account";
  const userInitials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const renderAuthButton = (className?: string) => {
    if (isLoading) {
      return (
        <Button
          variant="ghost"
          disabled
          className={className ?? "text-white hover:text-white hover:bg-white/10 rounded-full px-6 text-[15px]"}
        >
          ...
        </Button>
      );
    }

    if (isAuthenticated) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full p-1 hover:bg-white/10 transition-colors">
              <Avatar className="h-9 w-9 border border-white/20">
                <AvatarImage src={user?.image} alt={displayName} />
                <AvatarFallback className="bg-[#EE101A] text-white text-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{displayName}</span>
                {user?.email && (
                  <span className="text-xs font-normal text-gray-500 truncate">
                    {user.email}
                  </span>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <User className="mr-2 h-4 w-4" />
              My account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => void signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Button
        variant="ghost"
        onClick={openAuthDialog}
        className={className ?? "text-white hover:text-white hover:bg-white/10 rounded-full px-6 text-[15px]"}
      >
        Login
      </Button>
    );
  };

  return (
    <>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/25 backdrop-blur-sm border-b border-white/10">
        <div className="px-4 md:px-[72px] py-[14px]">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-6 h-8">
                <SteakOutFlame />
              </div>
              <h1 className="text-[rgb(255,255,255)] text-2xl font-medium">Steak-Out</h1>
            </button>

            {/* Desktop Navigation - Aligned to left next to logo */}
            <div className="hidden md:flex items-center flex-1 justify-between ml-12">
              <div className="relative flex gap-6">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundColor: '#EE101A',
                    left: indicatorStyle.left,
                    width: indicatorStyle.width,
                    height: '100%'
                  }}
                  initial={false}
                  animate={{
                    left: indicatorStyle.left,
                    width: indicatorStyle.width
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                />
                {pages.map((page) => (
                  <div
                    key={page.id}
                    ref={(el) => (buttonsRef.current[page.id] = el)}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => onPageChange(page.id)}
                      className="text-white hover:text-white hover:bg-white/10 rounded-full relative z-10 text-[15px]"
                    >
                      {page.label}
                    </Button>
                  </div>
                ))}
              </div>
              
              {/* Cart Icon & Login - Desktop */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onPageChange('cart')}
                  className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6 text-white" />
                  {totalQuantity > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full text-white text-xs flex items-center justify-center font-medium" style={{ backgroundColor: '#EE101A' }}>
                      {totalQuantity > 99 ? "99+" : totalQuantity}
                    </span>
                  )}
                </button>
                
                {renderAuthButton()}
              </div>
            </div>

            {/* Mobile Menu Button & Cart */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => onPageChange('cart')}
                className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-white" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full text-white text-xs flex items-center justify-center font-medium" style={{ backgroundColor: '#EE101A' }}>
                    {totalQuantity > 99 ? "99+" : totalQuantity}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Outside nav for proper stacking */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed top-0 left-0 right-0 bottom-0 bg-black/80 backdrop-blur-sm md:hidden z-[40]"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-[73px] bottom-0 w-[280px] backdrop-blur-md border-l border-white/10 md:hidden z-[70]"
            >
              <div className="flex flex-col p-6 gap-2">
                {pages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => handleNavClick(page.id)}
                    className={`text-left px-4 py-3 rounded-lg text-white text-[15px] transition-colors ${
                      currentPage === page.id 
                        ? 'bg-[#EE101A]' 
                        : 'hover:bg-white/10'
                    }`}
                  >
                    {page.label}
                  </button>
                ))}
                
                <div className="border-t border-white/10 my-4" />
                
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 text-white/80 text-sm">
                      Signed in as {displayName}
                    </div>
                    <button
                      onClick={() => void signOut()}
                      className="text-left px-4 py-3 rounded-lg text-white text-[15px] hover:bg-white/10 transition-colors w-full"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={openAuthDialog}
                    className="text-left px-4 py-3 rounded-lg text-white text-[15px] hover:bg-white/10 transition-colors w-full"
                  >
                    Login
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}