import { useState } from 'react'
import styles from './AcquireContent.module.css'
import Acquiring from './Acquiring';
import Total from './Total';
function AcquireContent() {
  const [total, setTotal] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
  });
  const [amount, setAmount] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
  });
  const tols = [
    total[1],
    total[2],
    total[3],
    total[4],
    total[5],
    total[6],
    total[7],
  ];

  return (
    <div className={styles["coupon-table"]}>
      <section>
        <h6>Acquire coupon</h6>
      </section>
      <section className={styles["plans"]}>
        <div>
          <Acquiring amount={amount} setAmount={setAmount} total={total} setTotal={setTotal}/>
        </div>
        <div>
          <Total tols={tols} />
        </div>
      </section>
    </div>
  );
}

export default AcquireContent
