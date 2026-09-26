import { useState } from 'react';
import styles from './AdminLogin.module.css'
import { toaster } from "evergreen-ui";
import { signInWithEmailAndPassword } from 'firebase/auth/web-extension';
import { auth } from '../../../../supabase/Supabase';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../../Loading';
function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault();
    // try {
    //   setLoading(true)
    //   if (email !== "superpayadmin@gmail.com") return toaster.warning("Invalid Email or Password"), setLoading(false);
    //   // Sign in with email and password
    //   const userCredential = await signInWithEmailAndPassword(auth, email, password);
    //   console.log(userCredential.user.email)
    //   // Check if the user is an admin
    //   // This could be a claim in the token or a check in your database
    //   if (userCredential.user.email === "superpayadmin@gmail.com" /* check for admin role */) {

    //     setLoading(false)
    //     console.log(userCredential.user);
    //     toaster.success("successfully logged in")
    //     // Redirect to admin dashboard or perform admin tasks
    //     navigate('/admin/dashboard')
    //   } else {
    //     setLoading(false)
    //     toaster.danger("Not an admin");
    //   }
    // } catch (error) {
    //   setLoading(false);
    //   toaster.danger(`${error.code}`);
    //   console.error('Login failed', error);
    // }
  };


  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <section className={styles.brand}>
        <div>
          <img src="/public/images/IMG_2593.jpg" alt="" width="50%" />
        </div>
        <h3>Admin login</h3>
      </section>
      <section className={styles.form}>
        <input
          type="email"
          placeholder="Email Address"
          required
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
      </section>
      <section className={styles.submit}>
        <button type="submit">{loading ? (<Loading/>) : "Proceed"}</button>
      </section>
    </form>
  );
}

export default AdminLogin
