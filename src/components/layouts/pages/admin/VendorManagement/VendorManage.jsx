import { Link } from 'react-router-dom';
import Menu from '../../Dashboard/Menu';
import styles from './VendorManage.module.css'
import Nav from '../../Dashboard/Nav';
import VendorsData from './VendorsData';
function VendorManage() {
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
        <section>
          <Nav name="Welcome to Admin" status="vendor" />
        </section>

        <p>Vendor Management</p>
        <section className={styles.content}>
          <div className={styles.group}>
            <svg className={styles.icon} aria-hidden="true" viewBox="0 0 24 24">
              <g>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
              </g>
            </svg>
            <input
              placeholder="Search for a user"
              type="search"
              className={styles.input}
            />
          </div>
          <div>
            <VendorsData/>
          </div>
        </section>
      </section>
    </div>
  );
}

export default VendorManage
