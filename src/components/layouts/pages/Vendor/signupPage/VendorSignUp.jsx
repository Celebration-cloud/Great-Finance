import { Link, useNavigate } from 'react-router-dom';
import styles from './VendorSignUp.module.css'
import { useEffect, useState } from 'react';
import { addDoc, collection, onSnapshot, query } from 'firebase/firestore';
import db from '../../../../../supabase/Supabase';
import { toaster } from 'evergreen-ui';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import Loading from '../../../../../Loading';
function VendorSignUp() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    status: "start",
    verified: false
  });
  const email = formData.email
  const password = formData.password
  const [users, setUsers] = useState([])
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const emails = users.map(item => item.email === formData.email)
  console.log(formData, emails, users);

  function handleChange(e) {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      return {
        ...prev,
        [name]: type === "tel" ? value.replace(/[^0-9]/g, "") : value,
      };
    });
  }

  // Create a reference to the "vendor" collection
  const vendorCollectionRef = collection(db, "vendor");

  async function fet(){
    onSnapshot(query(collection(db, "users")), (snapshot) => {
      const snap = snapshot.docs.map((doc) => doc.data().profile);
      setUsers(snap);
      console.log(snap)
    });
  }

  // Add a document to the "vendor" collection
  useEffect(() => {
    fet()

  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    // if(emails.map(item => item === true)) return (  toaster.warning("email is registered as user"))
      try {
        setLoading(true)
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        const profile = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          uid: user.uid,
          password: formData.password,
          whatsapp: formData.phoneNumber,
          status: formData.status,
          verified: formData.verified,
          ban: false,
          investment_history: [],
          purchase_history: []
          // Add other fields as needed
        };

        toaster.success("successfully registered")
        await addDoc(vendorCollectionRef, {profile}, {merge: true});
        setLoading(false)
        navigate('/vendor/login')
        dispatch({ type: "SUPA_PROFILE", payload: user });
        console.log("Vendor document added successfully");

    } catch (error) {
      toaster.warning("email is registered as user");
      setLoading(false)
    }
  }

  return (
    <div className={styles.signing}>
      <Link to="/">
        <img src="../../../../../public/images/IMG_2593.jpg" alt="" />
      </Link>

      <form onSubmit={handleSubmit} className={styles.signUp}>
        <h3>Vendor registration</h3>
        <div className={styles.form}>
          <input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            type="text"
            required
            onChange={handleChange}
            placeholder="Enter First name"
          />
          <br />
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            required
            onChange={handleChange}
            placeholder="Enter Last name"
          />
          <br />
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            required
            onChange={handleChange}
            placeholder="Enter email address"
          />
          <br />
          <input
            id="phoneNumber"
            name="phoneNumber"
            autoComplete=""
            type="tel"
            maxLength={11}
            required
            value={formData.phoneNumber}
            inputMode="numeric"
            onChange={handleChange}
            placeholder="Enter active whatsapp number"
          />
          <br />
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            autoComplete=""
            onChange={handleChange}
            placeholder="Enter a password"
          />
          <br />
        </div>
        <button>{loading ? <Loading/> : "Sign Up"}</button>
        <p>
          Already have an account? <Link to="/vendor/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default VendorSignUp
