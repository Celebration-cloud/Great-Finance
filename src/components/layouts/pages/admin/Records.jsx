/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
import styles from './Records.module.css'
function Records() {
  const users = useSelector(store => store.admin.users)
  console.log(users)
  return (
    <div className={styles.records}>
      <div className={styles.current}>
        <span>Total number of users : </span>
        <span>30</span>
      </div>
      <div className="">
        <span>Total cash inflow:</span>
        <span>N80,000,000</span>
      </div>
      <div>
        <span>Total cash outflow:</span>
        <span>N35,000,000</span>
      </div>
      <div>
        <span>Due payout:</span>
        <span>36</span>
      </div>
      <div>
        <span>Number of referrals : </span>
        <span>3</span>
      </div>
    </div>
  );
}

export default Records
