"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, BarChart3, Database, FileText, MapPin, TrendingUp, Globe } from "lucide-react"

export function Navbar() {
  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Analytics", href: "/analytics", icon: Database },
    { name: "Comparisons", href: "/comparisons", icon: Globe },
    { name: "Trends", href: "/trends", icon: TrendingUp },
    { name: "Geography", href: "/geography", icon: MapPin },
    { name: "Export", href: "/export", icon: FileText },
  ]

  return (
    <nav className="w-full" style={{ backgroundColor: '#4DA11D' }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-full">
              <img src="/favlogo.png" alt="OECS Logo" className="h-8 w-8" />
            </div>
            <div className="text-white">
              <h1 className="text-lg font-bold">OECS Education Dashboard</h1>
              <p className="text-xs opacity-90">Interactive Statistical Digest</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 hover:text-white"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex flex-col space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-white hover:bg-white/20"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
} 