"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "./AuthModal";

export function AppHeader() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Left side — Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/capireiq_logo_cr.png"
              alt="capire iQ Logo"
              height={100}
              width={100}
              className="h-12 w-auto"
              priority
            />
            <span className="text-xl font-semibold tracking-tight hover:opacity-80">
              CAPIRE <span className="text-[#f4bb19]">IQ</span>
            </span>
          </Link>
        </div>

        {/* Right side — Auth + Theme toggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Wait until user state is known */}
          {loading ? (
            <div className="h-8 w-20 bg-muted animate-pulse rounded-md" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                Hi, {user.name || user.email}
              </span>
              <Button
                variant="outline"
                className="font-medium"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <AuthModal /> 
          )}
        </div>
      </div>
    </header>
  );
}
