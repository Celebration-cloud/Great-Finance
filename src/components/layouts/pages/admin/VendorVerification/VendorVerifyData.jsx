import styles from './VendorVerifyData.module.css'
function VendorVerifyData() {
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
          <span>Email: ezugsjatek@gmail.com</span>
        </div>
        <div>
          <button className={styles.log}>Verify vendor</button>
        </div>
        <div>
          <button className={styles.details}>Review vendor details</button>
        </div>
      </section>
    </div>
  );
}

export default VendorVerifyData
