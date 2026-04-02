import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InspectIQ — AI-Powered Building Inspection Software",
  description: "Australian building inspection report software with AI photo analysis, voice-to-report, and AS4349 compliance. Finish your report before you leave the job site.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
