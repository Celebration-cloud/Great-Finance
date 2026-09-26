import { Link } from "react-router-dom";
import Menu from "../Dashboard/Menu";
import styles from "./AdminDashboard.module.css";
import Nav from "../Dashboard/Nav";
import Records from "./Records";
import { useEffect, useState } from "react";
import { toaster } from "evergreen-ui";
import { collection, onSnapshot, query } from "firebase/firestore";
import db from "../../../../supabase/Supabase";
import { useDispatch } from "react-redux";
function AdminDashboard() {
  const [users, setUsers] = useState(null);
  const dispatch = useDispatch();

  console.log(users);
  // useEffect(() => {
  //   async function usersData() {
  //     try {
  //       onSnapshot(query(collection(db, "users")), (snapshot) => {
  //         const snap = snapshot.docs.map(
  //           (doc) => (
  //             {
  //               ...doc.data().profile,
  //               id: doc.id,
  //             }
  //           )
  //         );
  //         setUsers(snap);
  //         dispatch({ type: "ADMIN_USERS", payload: snap });
  //       });
  //     } catch (error) {
  //       toaster.warning(error.code);
  //     }
  //   }
  //   usersData();
  // }, [dispatch]);

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
        <Nav name="Welcome to Admin" status="vendor" />
        <Records/>
      </section>
    </div>
  );
}

export default AdminDashboard;
