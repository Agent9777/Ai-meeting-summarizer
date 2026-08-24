import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MeetBrief — Meeting Intelligence",
  description: "AI-powered meeting transcription, intent analysis and action items."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
