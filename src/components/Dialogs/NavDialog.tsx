import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { MenuIcon, ArrowRight, Zap, Sparkles, User, Home } from 'lucide-react';
import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';
// import { useIsMobile } from '@/hooks/use-mobile';

export default function NavDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { user: clerkUser } = useUser();
  // const isMobile = useIsMobile();

  const handleClose = () => setIsOpen(false);

  const navigationItems = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
      description: 'Back to landing page'
    },
    {
      href: clerkUser ? '/projects' : '/sign-in',
      label: 'Dashboard',
      icon: Zap,
      description: 'Access your projects'
    },
    {
      href: '/pricing',
      label: 'Pricing',
      icon: Sparkles,
      description: 'View pricing plans'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
          name="open-mobile-menu"
        >
          <MenuIcon className="w-5 h-5 text-gray-700" />
        </Button>
      </DialogTrigger>

      <DialogContent 
        className="w-full h-full max-w-none border-0 p-0 bg-white/95 backdrop-blur-lg"
        onPointerDownOutside={handleClose}
      >
        {/* Modern mobile menu overlay */}
        <div className="flex flex-col h-full relative">
          {/* Header with close button */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <div>
                <h2 className="font-bold text-gray-900">LearnPDF</h2>
                <p className="text-xs text-gray-500">AI-Powered Learning</p>
              </div>
            </div>
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300"
            >
              <X className="w-5 h-5 text-gray-700" />
            </Button> */}
          </div>

          {/* Navigation Items */}
          <div className="flex-1 p-4 md:p-6 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleClose}
                className="group"
              >
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/60 border border-gray-200/50 hover:bg-white/80 hover:border-gray-300/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
                        {item.label}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="p-4 md:p-6 border-t border-gray-200/50 bg-gradient-to-r from-emerald-50/50 to-emerald-100/50">
            {clerkUser ? (
              <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-gray-200/50">
                <div className="flex items-center gap-3">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 rounded-full"
                      }
                    }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {clerkUser.firstName || 'User'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {clerkUser.emailAddresses?.[0]?.emailAddress}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Link href="/sign-in" onClick={handleClose}>
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-2 py-3 bg-white/60 hover:bg-white/80 border-gray-200/50 hover:border-gray-300/50 text-gray-700 hover:text-emerald-600 font-medium rounded-lg transition-all duration-300 hover:shadow-lg"
                    name="mobile-sign-in"
                  >
                    <User className="w-4 h-4" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={handleClose}>
                  <Button
                    className="w-full justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    name="mobile-get-started"
                  >
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <p className="text-xs text-center text-gray-500 px-4">
                  Join thousands of students already learning with AI
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
