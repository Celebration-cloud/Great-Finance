import InputCoupon from "./InputCoupon"
import InvestmentHistory from "./InvestmentHistory"
import styles from './InvestmentSection.module.css'
function InvestmentSection() {
  return (
    <div className={styles.section}>
      <InputCoupon/>
      <InvestmentHistory/>
    </div>
  )
}

export default InvestmentSection
