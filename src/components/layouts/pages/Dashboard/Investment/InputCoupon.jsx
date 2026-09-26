import styles from './InputCoupon.module.css'
function InputCoupon() {
  return (
    <div className={styles.inputCoupon}>
      <input type="text" placeholder="Enter your coupon code" />
      <button>Invest</button>
    </div>
  );
}

export default InputCoupon
