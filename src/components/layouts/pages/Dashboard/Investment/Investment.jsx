import { useEffect, useState } from 'react';
import Menu from '../Menu';
import styles from './Investment.module.css'
import { Link, useNavigate } from 'react-router-dom';
import Nav from '../Nav';
import {useSelector} from 'react-redux'
import InvestmentSection from './InvestmentSection';
import { collection, onSnapshot, query } from 'firebase/firestore';
import db from '../../../../../supabase/Supabase';
import { toaster } from 'evergreen-ui';
function Investment() {
    document.title = `Investments || Superpay`;
    // const user = useSelector((store) => store.user.profile);
    const navigate = useNavigate()
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
    <div className={styles.investment}>
      <Menu dashboard="user" />
      <Link to={`/dashboard/${user ? user[0]?.name : user}`}>
        <img
          src="../../../../../public/images/IMG_2593.jpg"
          width="100px"
          alt=""
        />
      </Link>
      <section className={styles.investmentSection}>
        <Nav name="Investments" status="investment" />
        <InvestmentSection />
      </section>
    </div>
  );
}

export default Investment
