/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'
import styles from './Nav.module.css'
function Nav({name, status}) {

  return (
    <nav className={styles.nav}>
      <div
        style={status !== "dashboard" ? { gap: "30px" } : {}}
        className={styles.menuName}
      >
        <img
          className={styles.menu}
          src="../../../../../public/svg/dashboard-menu.svg"
          alt=""
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasWithBothOptions"
          aria-controls="offcanvasWithBothOptions"
        />
        <span>
          {status === "dashboard" && (
            <img
              src="../../../../../public/images/bxs_user-circle.svg"
              alt=""
            />
          )}
          {status === "vendor" && (
            <img
              src="../../../../../public/images/bxs_user-circle.svg"
              alt=""
            />
          )}
          {status !== "vendor" ? (
            <span
              style={
                status !== "dashboard"
                  ? { fontSize: "x-large", fontWeight: "bold" }
                  : {}
              }
            >
              {name}
            </span>
          ) : (
            <span
              style={
                status !== "vendor"
                  ? { fontSize: "x-large", fontWeight: "bold" }
                  : {}
              }
            >
              {name}
            </span>
          )}
        </span>
      </div>
      {status === "dashboard" && (
        <Link to="/dashboard/purchase">
          <button className={styles.purchase}>Purchase coupon</button>
        </Link>
      )}
    </nav>
  );
}

export default Nav
