import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VAYUSETU: AI-Powered Climate Digital Twin of India",
  description: "Fusing INSAT satellite observations and IMD weather datasets for real-time forecasting, scenario simulation, and decision support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const removeBisSkinChecked = (node) => {
                  if (node && node.nodeType === 1) {
                    if (node.hasAttribute('bis_skin_checked')) {
                      node.removeAttribute('bis_skin_checked');
                    }
                    node.querySelectorAll('[bis_skin_checked]').forEach(el => {
                      el.removeAttribute('bis_skin_checked');
                    });
                  }
                };
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
                      mutation.target.removeAttribute('bis_skin_checked');
                    }
                    mutation.addedNodes.forEach(removeBisSkinChecked);
                  });
                });
                // Run an initial sweep once DOM content is loaded
                document.addEventListener('DOMContentLoaded', () => {
                  removeBisSkinChecked(document.documentElement);
                });
                observer.observe(document.documentElement, {
                  attributes: true,
                  childList: true,
                  subtree: true,
                  attributeFilter: ['bis_skin_checked']
                });
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased">{children}</body>
    </html>
  );
}
