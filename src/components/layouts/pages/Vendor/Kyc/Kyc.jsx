import styles from './Kyc.module.css'
import Menu from '../../Dashboard/Menu';
import { Link } from 'react-router-dom';
import Nav from '../../Dashboard/Nav';
import KycContent from './KycContent';
function Kyc() {
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
        <KycContent/>
      </section>
    </div>
  );
}

export default Kyc
