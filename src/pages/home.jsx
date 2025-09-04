// src/Home.jsx
import NavbarH from "../components/HorizontalNavBar";
import NavbarV from "../components/VerticalNavBar";
import UserName from "../components/UserName";
import UserDailyActivity from "../components/UserDailyActivity";
import AverageSessionChart from "../components/UserSessionActivity";
import PerformanceChart from "../components/UserPerformanceActivity";
import Score from "../components/UserScoreActivity";
import StatCard from "../components/StatCard";
import '../styles/style.scss';
import '../styles/UserDailyActivity.scss';
import '../styles/UserSessionActivity.scss';
import '../styles/UserPerformanceActivity.scss';
import '../styles/UserScoreActivity.scss';
import energyUrl from "../assets/energy.svg";
import chickenyUrl from "../assets/chicken.svg";
import appleUrl from "../assets/apple.svg";
import cheeseburgerUrl from "../assets/cheeseburger.svg";

export default function Home() {
  return (
    <div className="parent">
      <div className="div1"><NavbarH /></div>
      <div className="div2"><NavbarV /></div>
      <div className="div3"><UserName /><p className="subtitle">Félicitation ! Vous avez explosé vos objectifs hier 👏</p></div>
      <div className="div4"><UserDailyActivity /></div>
      <div className="div5"><AverageSessionChart /></div>
      <div className="div6"><PerformanceChart /></div>
      <div className="div7"><Score /></div>
      <div className="div8">
      <StatCard
        dataKey="calorieCount"
        unit="kCal"
        label="Calories"
        icon={<img src={energyUrl} alt="" />}   // flamme remplie
        iconBg="#FBEAEA"                        // rose très pâle
      />
      <StatCard
        dataKey="proteinCount"
        unit="g"
        label="Protéines"
        icon={<img src={chickenyUrl} alt="" />} // cuisse de poulet remplie
        iconBg="#E9F4FF"                        // bleu pâle
      />
      <StatCard
        dataKey="carbohydrateCount"
        unit="g"
        label="Glucides"
        icon={<img src={appleUrl} alt="" />}   // pomme pleine
        iconBg="#FFF6DB"                        // jaune pâle
      />
      <StatCard
        dataKey="lipidCount"
        unit="g"
        label="Lipides"
        icon={<img src={cheeseburgerUrl} alt="" />}  // burger plein
        iconBg="#FEE5EF"                        // rose pâle
      />
      </div>
    </div>
  );
}
