/* eslint-disable react/prop-types */
import styles from './ReferralRecords.module.css'
// import {useSelector} from 'react-redux'
function ReferralRecords({records}) {
  // const referralData = useSelector((store) => store.user.referral);
  return (
    <>
      {records?.map((item) => (
        <div
          key={item.uid}
          className={styles.records}
        >
          <div className={styles.current}>
            <span>Total number of referrals: </span>
            <span>{item.Total_number_of_referrals}</span>
          </div>
          <div className="">
            <span>Total referral earnings: </span>
            <span>{item.Total_referral_earnings}</span>
          </div>
        </div>
      ))}
    </>
  );
}

export default ReferralRecords
