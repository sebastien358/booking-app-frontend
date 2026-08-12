import styles from './layout.module.scss'
import "./globals.scss";
import React from "react";
import Header from "@/templates/header/Header";
import Footer from "@/templates/footer/Footer";

export default function RootLayout({ children }: {children: React.ReactNode}) {
  return (
    <html lang="fr">
      <body className={styles['app']}>
        <Header className={styles['header']} />
        <main className={styles['main']}>
          {children}
        </main>
       <Footer className={styles['footer']} />
      </body>
    </html>
  );
}
