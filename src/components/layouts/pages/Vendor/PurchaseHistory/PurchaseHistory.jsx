import { Link } from 'react-router-dom';
import styles from './PurchaseHistory.module.css'
import Menu from '../../Dashboard/Menu';
import Nav from '../../Dashboard/Nav';
import CouponTable from '../CouponTable/CouponTable';
function PurchaseHistory() {
  return (
    <div className={styles.dashboard}>
      <Menu dashboard="vendor" />
      <Link to={`/vendor/dashboard`}>
        <img
          src="../../../../../public/images/IMG_2593.jpg"
          width="100px"
          alt=""
        />
      </Link>
      <section className={styles.dashboardSection}>
        <Nav name="Celebration" status="vendor" />
        <CouponTable dashboard="vendor"/>
      </section>
    </div>
  );
}

export default PurchaseHistory
