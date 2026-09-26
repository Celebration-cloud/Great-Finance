/* eslint-disable react/prop-types */
import { NavLink, useNavigate } from 'react-router-dom';
import menuStyles from './Menu.module.css'
import { signOut } from 'firebase/auth';
import { auth } from '../../../../supabase/Supabase';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toaster } from 'evergreen-ui';
function Menu({dashboard}) {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [mod, setMod] = useState(false)
  const dialog = document.querySelector("#modal");
  const vendorOut = document.querySelector("#vendor");
  const adminOut = document.querySelector("#admin");
  function handleSignOut(){
    setMod((open) => !open);
    dialog?.showModal()
  }
  function vendorSignOut(){
    setMod((open) => !open);
    vendorOut?.showModal()
  }
  function adminSignOut(){
    setMod((open) => !open);
    adminOut?.showModal()
  }
  async function closeUser(){
    try {
      await auth.signOut()
      toaster.success("signed out successfully")
      navigate("/")

      window.location.reload(false);
      dispatch({ type: "SUPA_SESSION", payload: null })
    } catch (error) {
      console.log(error.message);
    }
      dialog?.close();
  }
  async function closeVendor(){
    try {
      await auth.signOut()
      toaster.success("signed out successfully")
      navigate("/")

      window.location.reload(false);
      dispatch({ type: "SUPA_SESSION", payload: null })
    } catch (error) {
      console.log(error.message);
    }
      dialog?.close();
  }
  async function closeAdmin(){
    try {
      await auth.signOut()
      toaster.success("signed out successfully")
      navigate("/")

      window.location.reload(false);
      dispatch({ type: "SUPA_SESSION", payload: null })
    } catch (error) {
      console.log(error.message);
    }
      dialog?.close();
  }
  function closeModal(){
    setMod((open) => !open);
    dialog?.close();
  }
  function closeModal2(){
    setMod((open) => !open);
    vendorOut?.close();
  }
  function closeModal3(){
    setMod((open) => !open);
    adminOut?.close();
  }
  return (
    <>
      <div
        className={`offcanvas offcanvas-start ${menuStyles.category}`}
        tabIndex="-1"
        data-bs-scroll="true"
        id="offcanvasWithBothOptions"
        aria-labelledby="offcanvasWithBothOptionsLabel"
      >
        <div className="offcanvas-header">
          {dashboard === "user" && (
            <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">
              Superpay
            </h5>
          )}
          {dashboard === "vendor" && (
            <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">
              Superpay Vendor
            </h5>
          )}
          {dashboard === "admin" && (
            <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">
              Superpay Admin
            </h5>
          )}
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className={menuStyles.ul}>
            {dashboard === "vendor" && (
              <>
                <NavLink to="/vendor/dashboard">
                  <li>
                    <span>
                      <img src="/public/images/couponTable.svg" alt="" />
                    </span>
                    <span>Coupon table</span>
                  </li>
                </NavLink>
                <NavLink to="/vendor/acquire">
                  <li>
                    <span>
                      <img src="/public/images/acquireCoupon.svg" alt="" />
                    </span>
                    <span>Acquire coupon</span>
                  </li>
                </NavLink>

                <NavLink to="/vendor/history">
                  <li>
                    <span>
                      <img src="/public/images/purchase_history.svg" alt="" />
                    </span>
                    <span>Purchase History</span>
                  </li>
                </NavLink>
                <NavLink to="/vendor/kyc">
                  <li>
                    <span>
                      <img src="/public/images/kyc.svg" alt="" />
                    </span>
                    <span>KYC Verification</span>
                  </li>
                </NavLink>
              </>
            )}

            {dashboard === "user" && (
              <>
                <NavLink to="/dashboard/investment">
                  <li>
                    <span>
                      <img src="/public/svg/investment.svg" alt="" />
                    </span>
                    <span>Investments</span>
                  </li>
                </NavLink>
                <NavLink to="/dashboard/withdrawals">
                  <li>
                    <span>
                      <img src="/public/svg/withdraw.svg" alt="" />
                    </span>
                    <span>Withdrawals</span>
                  </li>
                </NavLink>
                <NavLink to="/dashboard/purchase">
                  <li>
                    <span>
                      <img src="/public/svg/purschase.svg" alt="" />
                    </span>
                    <span>Purchase coupon</span>
                  </li>
                </NavLink>
                <NavLink to="/dashboard/referral">
                  <li>
                    <span>
                      <img src="/public/svg/referral.svg" alt="" />
                    </span>
                    <span>Referral</span>
                  </li>
                </NavLink>
              </>
            )}
            {dashboard === "admin" && (
              <>
                <NavLink to="/admin/users">
                  <li>
                    <span>
                      <img src="/public/images/user_management.svg" alt="" />
                    </span>
                    <span>User management</span>
                  </li>
                </NavLink>
                <NavLink to="/admin/vendors">
                  <li>
                    <span>
                      <img src="/public/images/vendor_management.svg" alt="" />
                    </span>
                    <span>Vendor management</span>
                  </li>
                </NavLink>
                <NavLink to="/admin/vendor_verification">
                  <li>
                    <span>
                      <img
                        src="/public/images/vendor_verification.svg"
                        alt=""
                      />
                    </span>
                    <span>Vendor Verification</span>
                  </li>
                </NavLink>
                <NavLink to="/admin/verify_token">
                  <li>
                    <span>
                      <img
                        src="/public/images/verify_token_purchase.svg"
                        alt=""
                      />
                    </span>
                    <span>Verify token purchase</span>
                  </li>
                </NavLink>
                <NavLink to="/admin/due_payout">
                  <li>
                    <span>
                      <img src="/public/images/due_payouts.svg" alt="" />
                    </span>
                    <span>Due payouts</span>
                  </li>
                </NavLink>
              </>
            )}
            {dashboard === "user" && (
              <li>
                <span>
                  <img src="/public/svg/signout.svg" alt="" />
                </span>
                <span style={{ color: "#004584" }} onClick={handleSignOut}>
                  Sign out
                </span>
              </li>
            )}
            {dashboard === "vendor" && (
              <li>
                <span>
                  <img src="/public/svg/signout.svg" alt="" />
                </span>
                <span style={{ color: "#004584" }} onClick={vendorSignOut}>
                  Sign out
                </span>
              </li>
            )}
            {dashboard === "admin" && (
              <li>
                <span>
                  <img src="/public/svg/signout.svg" alt="" />
                </span>
                <span style={{ color: "#004584" }} onClick={adminSignOut}>Sign out</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <dialog id="modal" {...(mod && open)} className={menuStyles.dialog}>
        <div className={menuStyles.modalContent}>
          <p>Are you sure you want to sign out? </p>
          <div className={menuStyles["button-group"]}>
            <button type="submit" onClick={closeUser}>
              Yes
            </button>
            <button type="submit" onClick={closeModal}>
              No
            </button>
          </div>
        </div>
      </dialog>
      <dialog id="vendor" {...(mod && open)} className={menuStyles.dialog}>
        <div className={menuStyles.modalContent}>
          <p>Are you sure you want to sign out? </p>
          <div className={menuStyles["button-group"]}>
            <button type="submit" onClick={closeVendor}>
              Yes
            </button>
            <button type="submit" onClick={closeModal2}>
              No
            </button>
          </div>
        </div>
      </dialog>
      <dialog id="admin" {...(mod && open)} className={menuStyles.dialog}>
        <div className={menuStyles.modalContent}>
          <p>Are you sure you want to sign out? </p>
          <div className={menuStyles["button-group"]}>
            <button type="submit" onClick={closeAdmin}>
              Yes
            </button>
            <button type="submit" onClick={closeModal3}>
              No
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default Menu
