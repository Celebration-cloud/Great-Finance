import { Link, useNavigate } from 'react-router-dom';
import Menu from '../Menu';
import styles from './PurchaseCoupon.module.css'
import Nav from '../Nav';
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import PurchaseSection from './PurchaseSection';
import { collection, onSnapshot, query } from 'firebase/firestore';
import db from '../../../../../supabase/Supabase';
import { toaster } from 'evergreen-ui';
function PurchaseCoupon() {
    document.title = `Purchase Coupon || Superpay`;
    const navigate = useNavigate()
    // const user = useSelector((store) => store.user.profile);
    const session = useSelector((store) => store.user.session);
    const [user, setUser] = useState(null);
    console.log(user);

    useEffect(() => {
      async function fet() {
        try {
          onSnapshot(query(collection(db, "users")), (snapshot) => {
            const shots = snapshot.docs.filter(
              (doc) => doc.data().profile.uid === session.uid
            );
            const snap = shots.map((doc) => doc.data().profile);
            snap[0]?.ban === true
              && (toaster.danger("user Banned"), navigate("/login"));
            setUser(snap);
            // profileAction(snap)
          });
        } catch (error) {
          toaster.warning(error.message);
        }
      }
      fet();
    }, [session, navigate]);
  return (
    <div className={styles.purchaseCoupon}>
      <Menu dashboard="user" />
      <Link to={`/dashboard/${user ? user[0]?.name : user}`}>
        <img
          src="../../../../../public/images/IMG_2593.jpg"
          width="100px"
          alt=""
        />
      </Link>
      <section className={styles.purchaseCouponSection}>
        <Nav
          name="Purchase Coupon"
          status="purchase coupon"
        />
        <h6 className={styles.info}>
          Contact any vendor on our list to purchase
        </h6>
        <div className={styles.section}>
          <PurchaseSection />
        </div>
      </section>
    </div>
  );
}

export default PurchaseCoupon
