import { useEffect, useState } from 'react'
import Menu from '../Menu';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Referral.module.css'
import Nav from '../Nav';
import ReferralRecords from './ReferralRecords';
import ReferralCode from './ReferralCode';
import {useSelector} from 'react-redux'
import { collection, onSnapshot, query } from 'firebase/firestore';
import db from '../../../../../supabase/Supabase';
import { toaster } from 'evergreen-ui';
function Referral() {
    document.title = `Referrals || Superpay`;
    const navigate = useNavigate()
    // const dispatch = useDispatch()
    const [records, setRecords] = useState(null)
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
            const board = snapshot.docs.filter(
              (doc) => doc.data().referral.uid === session.uid
            );
            const refer = board.map((doc) => doc.data().referral)
            setRecords(refer)
          });
        } catch (error) {
          toaster.warning(error.message);
        }
      }
      fet();
    }, [session, navigate]);


  return (
    <div className={styles.referral}>
      <Menu dashboard="user" />
      <Link to={`/dashboard/${user ? user[0]?.name : user}`}>
        <img
          src="../../../../../public/images/IMG_2593.jpg"
          width="100px"
          alt=""
        />
      </Link>
      <section className={styles.referralSection}>
        <Nav name="Referrals" status="referral" />
        <ReferralRecords records={records} />
        <ReferralCode records={records} />
      </section>
    </div>
  );
}

export default Referral
