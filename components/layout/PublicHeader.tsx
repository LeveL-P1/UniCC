"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

export function PublicHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const navItems = [
      {
      name: "Contact",
      link: "#contact",
    },
      {
      name: "Github",
      link: "https://github.com/LeveL-P1/UniCC",
    },
      {
      name: "Twitter",
      link: "https://twitter.com/Level_p1",
    },
  ];

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-4">
          <SignedOut>
            <NavbarButton variant="secondary" onClick={() => router.push('/sign-in')}>Sign In</NavbarButton>
            <NavbarButton variant="primary" onClick={() => router.push('/sign-up')}>Create Profile</NavbarButton>
          </SignedOut>
          <SignedIn>
            <NavbarButton variant="secondary" onClick={() => router.push('/dashboard')}>Dashboard</NavbarButton>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300"
            >
              <span className="block">{item.name}</span>
            </a>
          ))}
          <div className="flex w-full flex-col gap-4">
            <SignedOut>
              <NavbarButton
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push('/sign-in');
                }}
                variant="secondary"
                className="w-full"
              >
                Sign In
              </NavbarButton>
              <NavbarButton
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push('/sign-up');
                }}
                variant="secondary"
                className="w-full"
              >
                Create Profile
              </NavbarButton>
            </SignedOut>
            <SignedIn>
              <NavbarButton
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push('/dashboard');
                }}
                variant="secondary"
                className="w-full"
              >
                Dashboard
              </NavbarButton>
              <div className="flex justify-center py-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
