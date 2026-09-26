import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "../pages/welcomePage/Homepage";
import Login from "../pages/loginPage/Login";
import SignUp from "../pages/signupPage/SignUp";
import Dashboard from "../pages/Dashboard/Dashboard";
import Referral from "../pages/Dashboard/Referral/Referral";
import Investment from "../pages/Dashboard/Investment/Investment";
import PurchaseCoupon from "../pages/Dashboard/PurchaseCoupon/PurchaseCoupon";
import Withdrawal from "../pages/Dashboard/Withdrawal/Withdrawal";
import Confirmation from "../pages/signupPage/Confirmation";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import LoginPage from "../pages/Vendor/loginPage/LoginPage";
import VendorSignUp from "../pages/Vendor/signupPage/VendorSignUp";
import VendorDashboard from "../pages/Vendor/Dashboard/VendorDashboard";
import AcquireCoupon from "../pages/Vendor/AcquireCoupon/AcquireCoupon";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import db, { auth } from "../../../supabase/Supabase";
import { collection, onSnapshot, query } from "firebase/firestore";
import PurchaseHistory from "../pages/Vendor/PurchaseHistory/PurchaseHistory";
import Kyc from "../pages/Vendor/Kyc/Kyc";
import Payment from "../pages/Vendor/AcquireCoupon/Payment";
import Recovery from "../pages/Recovery/Recovery";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import VendorManage from "../pages/admin/VendorManagement/VendorManage";
import VendorVerify from "../pages/admin/VendorVerification/VendorVerify";
import VerifyToken from "../pages/admin/VerifyTokenPurcharse/VerifyToken";
import DuePayout from "../pages/admin/DuePayouts/DuePayout";
import UserManage from "../pages/admin/UserManagement/UserManage";
function GreatFinance() {
  const dispatch = useDispatch();
  const confirm = useSelector((store) => store.user.status);
  const session = useSelector((store) => store.user.session);
  const profile = useSelector((store) => store.user.profile);
  console.log(profile)
  const [users, setUsers] = useState(null)
  const [userActive, setUserActive] = useState(null)
  console.log(userActive, session)
  console.log(users);

  // useEffect(() => {
  //   async function fet(){
  //     try {
  //       onSnapshot(query(collection(db, "users")), (snapshot) => {
  //         const shots = snapshot.docs.filter(
  //           (doc) => doc.data().profile.uid === session.uid
  //         );
  //         const snap = shots.map((doc) => doc.data().profile);
  //         setUserActive(snap);
  //         // profileAction(snap)
  //         dispatch({ type: "SUPA_PROFILE", payload: snap });
  //       });
  //     } catch (error) {
  //       toaster.warning(error.message)
  //     }
  //   }
  //   fet()
  // }, [dispatch, session])

  useEffect(() => {
    // Verify if the user is authenticated
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user)
        onSnapshot(query(collection(db, "users")), (snapshot) => {

          const shots = snapshot.docs.filter(
              (doc) => doc.data().profile.uid === user.uid
            );
            const snap = shots.map((doc) => doc.data().profile);
            setUserActive(snap)
            // profileAction(snap)
            dispatch({ type: "SUPA_PROFILE", payload: snap });

          });
          onSnapshot(query(collection(db, "users")), (snapshot) => {
            const snap = snapshot.docs.map((doc) => doc.data().profile);
            setUsers(snap);
            dispatch({ type: "ADMIN_USERS", payload: snap });
          });

          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          // ...
          dispatch({ type: "SUPA_SESSION", payload: user });
        } else {
          // User is signed out
          // ...
          dispatch({ type: "SUPA_SESSION", payload: null });
          dispatch({ type: "SUPA_PROFILE", payload: null });
        }
      });

    }, [dispatch]);



  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* User route */}
          <Route index path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/recovery" element={<Recovery />} />

          {/* Vendor route */}
          <Route path="/vendor/login" element={<LoginPage />} />
          <Route path="/vendor/signup" element={<VendorSignUp />} />
          {session && (
            <>
              <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              <Route path="/vendor/acquire" element={<AcquireCoupon />} />
              <Route path="/vendor/history" element={<PurchaseHistory />} />
              <Route path="/vendor/kyc" element={<Kyc />} />
              <Route path="/vendor/acquire/:payment" element={<Payment />} />
            </>
          )}

          {/* Admin route */}
          <Route path="/admin" element={<AdminLogin />} />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManage />} />
          <Route path="/admin/vendors" element={<VendorManage />} />
          <Route path="/admin/vendor_verification" element={<VendorVerify />} />
          <Route path="/admin/verify_token" element={<VerifyToken />} />
          <Route path="/admin/due_payout" element={<DuePayout />} />

          {/* User route */}
          {session && (
            <>
              <Route path="/dashboard/" element={<Dashboard />}>
                <Route index element={<Navigate replace to=":name" />} />
                <Route path=":name" element={<Dashboard />} />
              </Route>
              <Route path="/dashboard/referral" element={<Referral />} />
              <Route path="/dashboard/investment" element={<Investment />} />
              <Route path="/dashboard/withdrawals" element={<Withdrawal />} />
              <Route path="/dashboard/purchase" element={<PurchaseCoupon />} />
            </>
          )}

          {confirm === "signed" && (
            <Route path="/confirm" element={<Confirmation />} />
          )}
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default GreatFinance;
