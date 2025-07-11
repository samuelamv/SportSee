import '../styles/NavbarV.scss'
import img1 from '../medias/yoga.png'
import img2 from '../medias/natation.png'
import img3 from '../medias/velo.png'
import img4 from '../medias/force.png'

const NavbarV = () => {
  return (
    <nav className="navbarV">
        <div className="navbarV_links">
            <div className="navbarV_box">
                <img src={img1} alt="Yoga" className="navbarV_img"></img>
            </div>
            <div className="navbarV_box">
                <img src={img2} alt="Yoga" className="navbarV_img"></img>
            </div>
            <div className="navbarV_box">
                <img src={img3} alt="Yoga" className="navbarV_img"></img>
            </div>
            <div className="navbarV_box">
                <img src={img4} alt="Yoga" className="navbarV_img"></img>
            </div>
        </div>
        <p className="navbarV_copyright">Copiryght, SportSee 2020</p>
    </nav>
  )
}

export default NavbarV