import "./globals.css";
import { Nunito } from "next/font/google";
import Navbar from "./components/navbar/navbar";
import RegisterModal from "./components/modals/RegisterModal";
import ToasterProvider from "./components/providers/ToasterProvider";

import LoginModal from "./components/modals/LoginModal";
import getCurrentUser from "./actions/getCurrentUser";
import HostModal from "./components/modals/HostModal";

export const metadata = {
  title: "Dev Nomad",
  description: "The digital Nomad Map",
};

const font = Nunito({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <LoginModal />
        <RegisterModal />
        <HostModal />
        <Navbar currentUser={currentUser} />
        {children}
      </body>
    </html>
  );
}
