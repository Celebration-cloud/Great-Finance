/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { Link } from "react-router-dom";
import styles from './Login.module.css'
import { useState } from "react";
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import { signInWithEmailAndPassword } from "firebase/auth";
import db, { auth } from "../../../../supabase/Supabase";
import { collection, onSnapshot, query } from "firebase/firestore";
import Loading from "../../../../Loading";
import { toaster } from "evergreen-ui";

function Login() {
  document.title = `Login || Superpay`;
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  })
  const email = loginData.email
  const password = loginData.password
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // const user = useSelector((store)=> store.user.profile)
  const sessions = useSelector((store)=> store.user.session)
  const [user, setUserA] = useState(null)
  console.log(sessions, user)

  if(user){
    navigate(`/dashboard/${user[0]?.name}`);
  }




  function handleChange(e){
    const {value, name} = e.target
    setLoginData({...loginData,[name]: value})
  }

  async function handleSubmit(e){
      e.preventDefault();
      if(Object.values(loginData).includes("")) return (setError("Please Input the field"))
      try {
        setIsLoading(true);

        const log = await signInWithEmailAndPassword(auth, email, password);
        const session = log.user;

        onSnapshot(query(collection(db, "users")), (snapshot) => {
          const shots = snapshot.docs.filter(
            (doc) => doc.data().profile.uid === session.uid
          );
          const snap = shots.map((doc) => doc.data().profile);
          snap[0]?.ban === true
            ? (toaster.danger("user Banned"),
              navigate("/login"),
              dispatch({ type: "SUPA_SESSION", payload: null }))
            : toaster.success("successfully logged in");
          setUserA(snap);

          const snapBoards = snapshot.docs.filter(
            (doc) => doc.data().dashboard.uid === session.uid
          );
          const snapBoard = snapBoards.map((doc) => doc.data().dashboard);
          console.log(snap, snapBoard);

          dispatch({ type: "SUPA_STORE", payload: snapBoard });
          dispatch({ type: "SUPA_SESSION", payload: session });
        });
        {
          user && user[0]?.ban === false
            && toaster.success("successfully logged in")
        }

        {
          user && navigate(`/dashboard/${user[0]?.name}`);
        }


        // dispatch({ type: "SUPA_SESSION", payload: session });
        setIsLoading(false);
        setError(null);
      } catch (error) {
        setIsLoading(false)
        setError(error.message);
        console.log(error.message);
      }
    }


  return (
    <div className={styles.div}>
      <section className={styles.login}>
        <Link to="/">
          <img src="../../../../../public/images/IMG_2593.jpg" alt="" />
        </Link>
        <div className={styles.loginSection}>
          {error && (toaster.danger(error)
          )}
          <h3>Login</h3>
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.inputForm}>
              <input
                id="email"
                name="email"
                onChange={handleChange}
                required
                placeholder="Enter email address"
              />
              <span>
                <input
                  id="password"
                  name="password"
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
                <Link to='/recovery'>
                  <p>Forgot your password?</p>
                </Link>
              </span>
            </div>
            <div className={styles.loginAction}>
              <button>
                {isLoading ? <Loading color="text-light" /> : "Sign In"}
              </button>
              <span>
                Don't have an account? <Link to="/Signup">Register</Link>
              </span>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Login
