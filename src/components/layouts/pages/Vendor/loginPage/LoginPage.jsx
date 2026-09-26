/* eslint-disable react/prop-types */
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css'
import { useEffect, useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, onSnapshot, query } from 'firebase/firestore';
import db from '../../../../../supabase/Supabase';
import { toaster } from 'evergreen-ui';
function LoginPage() {
  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailVe, setEmailVe] = useState(null)
    const [loading, setLoading] = useState(false);
    console.log(emailVe)
    const navigate = useNavigate()

    // useEffect(() => {
    //   const fetchVendors = async () => {
    //     try {
    //       onSnapshot(query(collection(db, "vendor")), (snapshot) => {
    //         const snap = snapshot.docs.map((doc) => doc.data().profile);
    //         setEmailVe(snap)
    //       });
    //       // setEmailVe(vendorEmails);
    //     } catch (error) {
    //       console.error( error.message);
    //     }
    //   };

    //   fetchVendors();
    // }, []);

    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        setLoading(true)
        onSnapshot(query(collection(db, "vendor")), (snapshot) => {
          const snap = snapshot.docs.map((doc) => doc.data().profile);
          setEmailVe(snap);
        });
        // if (emailVe.map((item) => item === email))
        //   return (navigate('/vendor/login'), toaster.warning("user not a vendor"));
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, email, password);
        toaster.success("successfully logged in")
        navigate("/vendor/dashboard");
        setLoading(false)

        // Handle successful login (e.g., redirect to vendor dashboard)
        console.log("Vendor logged in successfully");
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        toaster.danger(error.message)
        // Handle login error (e.g., display an error message)
        console.error("Login error:", errorCode, errorMessage);
      }
    };
  return (
    <div className={styles.div}>
      <section className={styles.login}>
        <Link to="/">
          <img src="/public/images/IMG_2593.jpg" alt="" />
        </Link>
        <div className={styles.loginSection}>
          <h3>Vendor Login</h3>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.inputForm}>
              <input
                id="email"
                name="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
              />
              <span>
                <input
                  id="password"
                  name="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <Link>
                  <p>Forgot your password?</p>
                </Link>
              </span>
            </div>
            <div className={styles.loginAction}>
              <button>Sign In</button>
              <span>
                Don't have an account? <Link to="/vendor/signup">Register</Link>
              </span>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default LoginPage
