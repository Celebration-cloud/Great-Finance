import styles from './InvestmentHistory.module.css'
function InvestmentHistory() {
  return (
    <div className={styles.investmentHistory}>
      <h3>Investment history</h3>
      <div className={styles.history}>
        <div className={styles.date}>{new Date().toDateString()}</div>
        <div className={styles.amount}>
          <strong>Amount </strong>
          <span>
            <span><img src="/public/images/mdi_naira.svg" alt="" /></span>
            <span>2,000</span>
          </span>
        </div>
        <div className={styles.profit}>
          <strong>Profit</strong>
          <span>
            <span><img src="/public/images/mdi_naira.svg" alt="" /></span>
            <span>3,000</span>
          </span>
        </div>
        <div className={styles.duration}>
          <p>R.O.I</p>
          <p>4 days left</p>
        </div>
        <div className={styles.status}>In Progress...</div>
      </div>
    </div>
  );
}

export default InvestmentHistory
