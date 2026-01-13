import { Outlet } from "react-router-dom";
import Header from "./global/Header.jsx";
import Footer from "./global/Footer.jsx";

export default function RootLayout() {
    return (
        <>
        <Header />
        <main>
            <Outlet />
        </main>
        <Footer />
        </>
    );
}