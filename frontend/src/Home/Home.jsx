import './Home.css'
import people_img from '../../public/chamada-em-conferência-100.png'
import date_img from '../../public/hora-extra-100.png'
import methodology_img from '../../public/metodologia-100.png'
import test_img from '../../public/teste-passado-100.png'
import Card from './Card.jsx'
import {Link} from 'react-router-dom'

export default function Home() {

    const cards = [
        [date_img, 'Optimize your time', 'a'], 
        [methodology_img, 'Manage your projects', 'a'], 
        [test_img, 'Create daily tasks', 'a'],
        [people_img, 'Collaborate with people', 'a']
    ]

    return(
        <div>
            <h1 className='space-grotesk-bold'>Trust Agenda to manage your time</h1>
            <div class="container">
                <Link to="/dashboard">
                <button id="dashboard" className="montserrat-regular">Open Dashboard</button>
                </Link>
            </div>
            <div id="cards">
                {cards.map(card => <Card img={card[0]} title={card[1]} text={card[2]}/>)}
            </div>
        </div>
    );
}