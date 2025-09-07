import { Outlet } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export default function RootLayout() {
  return (
    <div className="app">
      <Header />
      <main className="container container-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
