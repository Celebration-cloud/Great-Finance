/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
import styles from './Records.module.css'
// import {useSelector} from 'react-redux'
function Records({record}) {
  // const userData = useSelector((store) => store.user.storage);
  // console.log(userData)
  return (
    <>
      {record?.map((item) => (
        <div
          key={item.uid}
          className={styles.records}
        >
          <div className={styles.current}>
            <span>Number of current investments : </span>
            <span>{item.Number_of_current_investments}</span>
          </div>
          <div className="">
            <span>Total balance:</span>
            <span>{item.Total_balance}</span>
          </div>
          <div>
            <span>Realized profit:</span>
            <span>{item.Realised_profit}</span>
          </div>
          <div>
            <span>Unrealized profit:</span>
            <span>{item.Unrealised_profit}</span>
          </div>
          <div>
            <span>Number of referrals : </span>
            <span>{item.Number_of_referrals}</span>
          </div>
        </div>
      ))}
    </>
  );
}

export default Records
