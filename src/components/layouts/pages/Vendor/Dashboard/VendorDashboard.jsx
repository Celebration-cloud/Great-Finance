import styles from './VendorDashboard.module.css'
import { Link, useNavigate } from 'react-router-dom';
import Nav from '../../Dashboard/Nav';
import CouponTable from '../CouponTable/CouponTable';
import Menu from '../../Dashboard/Menu';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import db from '../../../../../supabase/Supabase';
import { Dialog, Pane, Spinner, toaster } from 'evergreen-ui';
function VendorDashboard() {
  const session = useSelector((store) => store.user.session);
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [isShown, setIsShown] = useState(false);
  const name = data && data[0].first_name
  console.log(data, name)
  useEffect(() => {
    async function fet() {
      try {
        onSnapshot(query(collection(db, "vendor")), (snapshot) => {
          const shots = snapshot.docs.filter(
            (doc) => doc.data().profile.uid === session.uid
          );
          const snap = shots.map((doc) => doc.data().profile);
          setData(snap);
        });
      } catch (error) {
        toaster.danger(error.message);
      }
    }
    fet();
  }, [session]);
  useEffect(() => {
  if(data && data[0].status === "start"){
    setIsShown(true);
   }
  }, [data])



  return (
    <>
      {data && data[0].status === "start" && (
        <Pane>
          <Dialog
            isShown={isShown}
            hasHeader={false}
            onCloseComplete={() => setIsShown(false)}
            cancelLabel='Not now'
            preventBodyScrolling
            onConfirm={() => navigate("/vendor/kyc")}
            confirmLabel="processed"
          >
            Carryout your KYC Verification
          </Dialog>
        </Pane>
      )}
      {data ? (
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
            <Nav name={name} status="vendor" />
            <CouponTable data={data} />
          </section>
        </div>
      ) : (
        <Pane>
          <Spinner marginX="auto" marginY={120} />
        </Pane>
      )}
    </>
  );
}

export default VendorDashboard
