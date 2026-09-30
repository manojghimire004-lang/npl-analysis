import './season-three.css';
import type { Metadata } from "next";
import "./globals.css";
import "./story.css";
import "./publication.css";
import "./responsive.css";
import "./clarity.css";
import "./editorial.css";
import "./nepal.css";

export const metadata: Metadata = {
  title: "Nepal Premier League Analysis | Performance, Price & Evidence",
  description: "Explore Nepal Premier League player performance, consistency and documented auction economics across two seasons.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

