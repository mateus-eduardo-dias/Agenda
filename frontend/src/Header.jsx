import { NavLink } from "react-router-dom";

export default function Header() {
    return(
    <header>
        <h1 className="header">Agenda</h1>
        <nav>
            <ul>
                <NavLink to="/dashboard">
                <li>Dashboard</li>
                </NavLink>
                <NavLink to="/about">
                <li>About</li>
                </NavLink>
                <NavLink to="/contact">
                <li>Contact</li>
                </NavLink>
            </ul>
        </nav>
    </header>
    );
}