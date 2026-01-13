import { NavLink, Link } from "react-router-dom";

export default function Header() {
    return(
    <header>
        <Link to="/" className="no-decoration">
        <h1>Agenda</h1>
        </Link>
        <nav>
            <ul>
                
                <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                
                
                <li><NavLink to="/about">About</NavLink></li>
                
                
                <li><NavLink to="/contact">Contact</NavLink></li>
                
            </ul>
        </nav>
    </header>
    );
}