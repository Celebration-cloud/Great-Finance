import { Link } from 'react-router-dom';
import Menu from '../../Dashboard/Menu';
import styles from './Payment.module.css'
import Nav from '../../Dashboard/Nav';
import PaymentContent from './PaymentContent';
function Payment() {
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
        <PaymentContent/>
      </section>
    </div>
  );
}

export default Payment
