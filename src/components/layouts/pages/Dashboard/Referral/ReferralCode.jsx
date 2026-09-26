/* eslint-disable react/prop-types */
import { useState } from 'react';
import styles from './ReferralCode.module.css'
// import { useSelector } from "react-redux";
import CopyToClipboard from 'react-copy-to-clipboard';
function ReferralCode({records}) {
  const [copy, setCopy] = useState(false)
  // const referralData = useSelector((store) => store.user.referral);
  const handleClick = (value)=>{
      navigator.clipboard.writeText(value);
    setTimeout(() => setCopy(false), 1000);}

  return (
    <>
      {records?.map((item) => (
        <div key={item.uid} className={styles.referralCode}>
          <p>{item.Referral_code}</p>
          <CopyToClipboard
            text={item.Referral_code}
            onCopy={() => setCopy(true)}
          >
            <button onClick={() => handleClick(item.Referral_code)}>
              Copy referral code
            </button>
          </CopyToClipboard>
          {copy && (
            <span
              style={{
                backgroundColor: "green",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
              }}
              onClick={() => setCopy(false)}
            >
              Copied!
            </span>
          )}
        </div>
      ))}
    </>
  );
}

export default ReferralCode
