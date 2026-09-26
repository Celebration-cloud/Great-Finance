import { Link } from "react-router-dom";
import styles from "./SignUp.module.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
import { createUserWithEmailAndPassword } from "firebase/auth";
// import {v5 as uuid} from 'uuid'
import db, { auth } from "../../../../supabase/Supabase";
import { doc, setDoc } from "firebase/firestore";
import Loading from "../../../../Loading";
function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  document.title = `Signup || Superpay`;
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    bank: "",
    password: "",
    referralCode: "",
    accountNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const email = formData.email;
  const password = formData.password;
  const [error, setError] = useState(null);
  function handleChange(e) {
    const { value, name, type } = e.target;
    setFormData((data) => {
      return {
        ...data,
        [name]: type === "tel" ? value.replace(/[^0-9]/g, "") : value,
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setIsLoading(true);
      const data = await createUserWithEmailAndPassword(auth, email, password);
      const user = data.user;

      const firebaseRef = doc(db, "users", user.uid);
      const profile = {
        name: formData.fullName,
        phoneNumber: formData.phoneNumber,
        uid: user.uid,
        email: email,
        bank: formData.bank,
        password: formData.password,
        account: formData.accountNumber,
        referralCode: formData.referralCode,
        ban: false
      };
      const dashboard = {
        Number_of_current_investments: 0,
        Total_balance: 0,
        uid: user.uid,
        Realised_profit: 0,
        Unrealised_profit: 0,
        Number_of_referrals: 0,
      };
      const referral = {
        Total_number_of_referrals: 0,
        uid: user.uid,
        Total_referral_earnings: 0,
        Referral_code: Date.now(),
      };
      //add to database
      await setDoc(
        firebaseRef,
        { profile, dashboard, referral },
        { merge: true }
      );
      setIsLoading(false);
      setError(null);
      navigate("/login");
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      dispatch({ type: "ERROR", payload: error.message });
    }
  }
  return (
    <div className={styles.signing}>
      <Link to="/">
        <img src="../../../../../public/images/IMG_2593.jpg" alt="" />
      </Link>

      <form onSubmit={handleSubmit} className={styles.signUp}>
        <h3>Register</h3>
        <div className={styles.form}>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter First name"
          />
          <br />
          <input
            id="email"
            name="email"
            required
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
          />
          <br />
          <input
            id="phoneNumber"
            name="phoneNumber"
            autoComplete=""
            type="tel"
            required
            value={formData.phoneNumber}
            onChange={handleChange}
            maxLength={11}
            placeholder="Enter phone number"
          />
          <br />
          <select
            id="bank"
            name="bank"
            required
            value={formData.bank}
            onChange={handleChange}
          >
            <option value="">
              Search Bank
            </option>
            <option value="Opay">
              <img src="/public/images/opay.svg" alt="" />
              Opay
            </option>
            <option value="Kuda Bank">
              <img src="/public/images/kuda.svg" alt="" />

              Kuda Bank
            </option>
          </select>
          <br />
          <input
            id="accountNumber"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            required
            maxLength={10}
            inputMode="numeric"
            type="tel"
            placeholder="Enter Account number"
          />
          <br />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete=""
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter a password"
          />
          <br />
          <input
            id="referralCode"
            name="referralCode"
            type="tel"
            value={formData.referralCode}
            onChange={handleChange}
            placeholder="Enter Referral code (optional)"
          />
          <br />
        </div>
        <button>
          {isLoading ? <Loading color="text-light" /> : "Sign Up"}
        </button>
        <p>
          Already have an account? <Link to="/Login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
