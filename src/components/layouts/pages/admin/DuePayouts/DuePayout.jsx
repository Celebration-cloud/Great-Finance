import { Link } from 'react-router-dom';
import Menu from '../../Dashboard/Menu';
import styles from './DuePayout.module.css'
import Nav from '../../Dashboard/Nav';
import DueData from './DueData';
function DuePayout() {
  return (
    <div className={styles.dashboard}>
      <Menu dashboard="admin" />
      <Link to={`/admin/dashboard`}>
        <img
          src="../../../../../public/images/IMG_2593.jpg"
          width="100px"
          alt=""
        />
      </Link>
      <section className={styles.dashboardSection}>
        <Nav name="Welcome to Admin" status="vendor" />
        <p>Due payouts</p>
        <div>
          <DueData />
        </div>
      </section>
    </div>
  );
}

export default DuePayout
