import "./globals.css";
import { Nunito } from "next/font/google";
import Navbar from "./components/navbar/navbar";
import RegisterModal from "./components/modals/RegisterModal";
import ToasterProvider from "./components/providers/ToasterProvider";

import LoginModal from "./components/modals/LoginModal";
import getCurrentUser from "./actions/getCurrentUser";
import HostModal from "./components/modals/HostModal";
import ShareModal from "./components/modals/ShareModal";
import SearchModal from "./components/modals/SearchModal";

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
        <SearchModal />
        <RegisterModal />
        <HostModal />
        <ShareModal />
        <Navbar currentUser={currentUser} />

        <div className="pb-20 pt-28">{children}</div>
      </body>
    </html>
  );
}
