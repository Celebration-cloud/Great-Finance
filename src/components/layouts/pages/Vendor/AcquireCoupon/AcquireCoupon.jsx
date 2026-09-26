import { Link } from 'react-router-dom';
import styles from './AcquireCoupon.module.css'
import Nav from '../../Dashboard/Nav';
import AcquireContent from './AcquireContent';
import Menu from '../../Dashboard/Menu';
function AcquireCoupon() {
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
        <AcquireContent />
      </section>
    </div>
  );
}

export default AcquireCoupon
