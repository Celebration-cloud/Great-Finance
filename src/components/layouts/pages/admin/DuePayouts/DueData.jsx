import styles from './DueData.module.css'
function DueData() {
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
          <span>Bank: Zenith bank</span>
        </div>
        <div>
          <span>Account number: 2312343212</span>
        </div>
        <div>
          <span>Amount: 70,000</span>
        </div>
        <div>
          <button className={styles.details}>Credit</button>
        </div>
      </section>
    </div>
  );
}

export default DueData
