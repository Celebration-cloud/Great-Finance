/* eslint-disable react/prop-types */
import Nav from "./Nav"
import Records from './Records'
import styles from './Dashboard.module.css'
import { Link, useNavigate, useParams } from "react-router-dom"
import Menu from "./Menu";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { collection, onSnapshot, query } from "firebase/firestore";
import db from "../../../../supabase/Supabase";
import { profileAction } from "../../../../database/action/profileAction";
import { toaster } from "evergreen-ui";
function Dashboard({user}) {
  document.title = `Dashboard || Superpay`;
  const session = useSelector((store) => store.user.session);
  const navigate = useNavigate()
  // const user = useSelector((store) => store.user.profile);
    // const id = useSelector((store) => store.user.session && store.user.session.user.id);
  console.log(session)
  const {name} = useParams()
  const [error, setError] = useState(null)
  const [record, setRecord] = useState(null)
  const [userData, setUserData] = useState(null)
  console.log(userData, record, user)


  useEffect(
    () => {
      async function fet() {
        try {

          onSnapshot(query(collection(db, "users")), (snapshot) => {
            const shots = snapshot.docs.filter(
              (doc) => doc.data().profile.uid === session.uid
            );
            const snap = shots.map((doc) => doc.data().profile);
            snap[0]?.ban === true
              && (toaster.danger("user Banned"), navigate("/login"));

            setUserData(snap)
            const snapBoards = snapshot.docs.filter(
              (doc) => doc.data().dashboard.uid === session.uid
            );
            const snapBoard = snapBoards.map((doc) => doc.data().dashboard);
            setRecord(snapBoard)
          });
          // dispatch({ type: "SUPA_STORE", payload: record });
          // dispatch({ type: "SUPA_PROFILE", payload: userData });
          setError(null);
        } catch (error) {
          setError(error.message);
        }
      }
      fet();
    },
    [session, navigate]
  )

  return (
    <div className={styles.dashboard}>
      <Menu dashboard="user" />

      <Link to={`/dashboard/${userData ? userData[0]?.name : userData}`}>
        <img
          src="../../../../../public/images/IMG_2593.jpg"
          width="100px"
          alt=""
        />
      </Link>
      <section className={styles.dashboardSection}>
        <Nav name={name} status="dashboard" />
        <Records error={error} record={record} />
      </section>
    </div>
  );
}

export default Dashboard
