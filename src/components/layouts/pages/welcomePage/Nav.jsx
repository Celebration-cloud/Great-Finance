import { Link } from "react-router-dom"
import styles from './Nav.module.css'
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";


function Nav() {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  return (
    <nav className={styles.nav}>
      <span>
        <Link>
          <img
            className={styles["img-1005-1"]}
            src="../../../../../public/images/IMG_2593.jpg"
          />
        </Link>
        {width < 830 && (
          <PopupState variant="popover" popupId="demo-popup-popover">
            {(popupState) => (
              <>
                  <img
                    id="menu"
                    {...bindTrigger(popupState)}
                    className={styles.menu}
                    src="../../../../public/svg/menu.svg"
                  />
                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <Typography
                    sx={{
                      p: 2,
                      backgroundColor: "white",
                      color: "black",
                      textAlign: "left",
                      padding: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "space-around",
                        gap: "10px",
                      }}
                    >
                      <span>Home</span>
                      <span>About</span>
                      <span>Register</span>
                      <span>Contact Us</span>
                    </div>
                  </Typography>
                </Popover>
              </>
            )}
          </PopupState>
        )}
      </span>
      <section>
        <div className={styles["frame-5"]}>
          <Link to="/login"><div className={styles["purchase-coupon"]}>Purchase coupon</div></Link>

        </div>
        <div className={styles["frame-4"]}>
          <Link to="/vendor/login"><div className={styles["register-as-vendor"]}>Register as vendor</div></Link>

        </div>
      </section>
      {width > 830 && (
        <PopupState variant="popover" popupId="demo-popup-popover">
          {(popupState) => (
            <>
                <img
                  id="mnu"
                  {...bindTrigger(popupState)}
                  className={styles.menu}
                  src="../../../../public/svg/menu.svg"
                />
              <Popover
                {...bindPopover(popupState)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Typography
                  sx={{
                    p: 2,
                    backgroundColor: "white",
                    color: "black",
                    textAlign: "left",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                      justifyContent: "space-around",
                      gap: "10px",
                    }}
                  >
                    <span>Home</span>
                    <span>About</span>
                    <span>Register</span>
                    <span>Contact Us</span>
                  </div>
                </Typography>
              </Popover>
            </>
          )}
        </PopupState>
      )}
    </nav>
  );
}

export default Nav
