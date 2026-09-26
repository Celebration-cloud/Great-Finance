import styles from './VendorsData.module.css'
function VendorsData() {
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
          <span>Email: ezugsjatek@gmail.com</span>
        </div>
        <div>
          <button className={styles.log}>Login</button>
        </div>
        <div>
          <button className={styles.ban}>Ban Vendor</button>
        </div>
        <div>
          <button className={styles.details}>View vendor details</button>
        </div>
      </section>
    </div>
  );
}

export default VendorsData
