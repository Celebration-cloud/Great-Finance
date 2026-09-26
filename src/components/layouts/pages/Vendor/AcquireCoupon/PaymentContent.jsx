import { useParams } from "react-router-dom";
import styles from "./PaymentContent.module.css";
function PaymentContent() {
  const { payment } = useParams();
  console.log(payment)
  return (
    <div className={styles.payment_content}>
      <section className={styles.details}>
        <div>
          <h3>Coupon purchase</h3>
        </div>
        <div className={styles.pay}>
          <div>
            Copy the wallet address below and send <br />{" "}
            <span className={styles.amount}>{payment} USDT</span>
          </div>
          <div className={styles.address}>
            182hxfzkkzhb837zvbxmksxhjs836shhd
            <span> Copy</span>
          </div>
          <div>
            When you are done making the payment,{" "}
            <span className={styles.direct}>click on the button below</span>
          </div>
        </div>
      </section>
      <section className={styles.payBtn}>
        <button>I have made payment</button>
      </section>
    </div>
  );
}

export default PaymentContent;
