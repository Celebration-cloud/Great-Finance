/* eslint-disable react/prop-types */
import { Link, useNavigate } from 'react-router-dom';
import Menu from '../Menu';
import styles from './Withdrawal.module.css'
import Nav from '../Nav';
import { useEffect, useState } from 'react';
import WithdrawHistory from './WithdrawHistory';
import { useSelector } from "react-redux";
import { collection, onSnapshot, query } from 'firebase/firestore';
import db from '../../../../../supabase/Supabase';
import { toaster } from 'evergreen-ui';
function Withdrawal() {
  document.title = `Withdrawals || Superpay`;

  // const user = useSelector((store) => store.user.profile);
  const session = useSelector((store) => store.user.session);
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  console.log(user)

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
    <div className={styles.withdrawal}>
      <Menu dashboard="user" />
      <Link to={`/dashboard/${user ? user[0]?.name : user}`}>
        <img
          src="../../../../../public/images/IMG_2593.jpg"
          width="100px"
          alt=""
        />
      </Link>
      <section className={styles.withdrawalSection}>
        <Nav name="Withdrawals" status="withdrawal" />
        <WithdrawHistory />
      </section>
    </div>
  );
}

export default Withdrawal
