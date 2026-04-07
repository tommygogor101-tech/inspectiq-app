import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  manifest: '/manifest.json',
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
      <body>
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js');
              });
            }
            let deferredPrompt;
            window.addEventListener('beforeinstallprompt', (e) => {
              deferredPrompt = e;
              // Show install button
              const btn = document.querySelector('#install-btn');
              if (btn) btn.style.display = 'block';
            });
            window.addEventListener('appinstalled', () => {
              deferredPrompt = null;
            });
          `
        }} />
        {children}
      </body>
    </html>
  );
}
