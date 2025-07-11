// src/Home.jsx
import NavbarH from "../components/HorizontalNavBar";
import NavbarV from "../components/VerticalNavBar";
import UserName from "../components/UserName";
import UserDailyActivity from "../components/UserDailyActivity";
import AverageSessionChart from "../components/UserSessionActivity";
import PerformanceChart from "../components/UserPerformanceActivity";
import Score from "../components/UserScoreActivity";
import '../styles/UserDailyActivity.scss';
import '../styles/UserSessionActivity.scss';
import '../styles/UserPerformanceActivity.scss';
import '../styles/UserScoreActivity.scss';

export default function Home() {
  return (
    <div>
        <NavbarH />
        <NavbarV />
        <div className="body">
          <div>
            <UserName />
            <p>Félicitation ! Vous avez explosé vos objectifs hier</p>;
          </div>
          <div className="UserDailyActivity">
            <UserDailyActivity />
          </div>
          <div className="UserSessionActivity">
            <AverageSessionChart />
          </div>
          <div className="UserPerformanceActivity">
            <PerformanceChart />
          </div>
          <div className="UserScoreActivity">
            <Score />
          </div>
        </div>
    </div>
  );
}
