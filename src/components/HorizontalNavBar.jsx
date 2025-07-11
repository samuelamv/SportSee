import logo from '../medias/logo.png'
import { NavLink } from 'react-router-dom'
import '../styles/NavbarH.scss'
const Navbar = () => {
  return (
    <nav className="navbar">
        <img src={logo} alt="Logo" className="navbar_logo"></img>
        <div className="navbar_links">
            <NavLink to="/home" className="navbar__link">Accueil</NavLink>
            <NavLink to="/profil" className="navbar_link">Profil</NavLink>
            <NavLink to="/reglages" className="navbar__link">Réglages</NavLink>
            <NavLink to="/communaute" className="navbar_link">Communauté</NavLink>
        </div>
    </nav>
  )
}

export default Navbar