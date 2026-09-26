import styles from './VerifyTokenData.module.css'
function VerifyTokenData() {
  return (
    <div className={styles.items} style={{ width: "100%" }}>
      <section className={styles.item}>
        <div>
          <span>1. </span>
        </div>
        <div>
          <span>Ezugwu samuel </span>
        </div>
        <div>
          <span>Vendor ID: 2313453212</span>
        </div>
        <div>
          <span>Deposit: 63.5091496 USDT </span>
        </div>
        <div>
          <button className={styles.log}>Confirm</button>
        </div>
      </section>
    </div>
  );
}

export default VerifyTokenData
