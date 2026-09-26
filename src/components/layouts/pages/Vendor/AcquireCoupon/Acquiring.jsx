/* eslint-disable react/prop-types */
import styles from './Acquiring.module.css'
import acquireType from './AcquireType'
function Acquiring({ amount , setAmount, setTotal}) {


    // .reduce((previous, current) => {
    //   return previous + current;
    // }, 0);
  return (
    <div className={styles.container}>
      {acquireType.map((item) => (
        <div key={item.id} className={styles.section}>
          <section className={styles.planSection}>
            <p className={styles.plan}>{item.plan}</p>
            <div className={styles.section1}>
              <span className={styles.price}>
                <img src="/public/images/mdi_naira.svg" alt="" />
                <span>{item.amount.toLocaleString()}</span>
              </span>

              <span>to get</span>
              <span className={styles.price}>
                <img src="/public/images/mdi_naira.svg" alt="" />
                <span>{item.get.toLocaleString()}</span>
              </span>
            </div>
          </section>

          <section className={styles.amount}>
            <p>Quantity</p>
            <div className={styles.control}>
              <span
                className={styles.amountLabel}
                onClick={() => {
                  if (amount[item.id] < 1) return 0;

                  setAmount((prev) => {
                    return {
                      ...prev,
                      [item.id]: prev[item.id] - 1,
                    };
                  });
                  setTotal((prev) => {
                    return {
                      ...prev,
                      [item.id]: prev[item.id] - item.amount,
                    };
                  });
                }}
              >
                -
              </span>
              <input
                type="text"
                inputMode="numeric"
                disabled
                value={amount[item.id]}
                name="amount"
                id="amount"
              />

              <span
                className={styles.amountLabel}
                onClick={() => {
                  setAmount((prev) => {
                    return {
                      ...prev,
                      [item.id]: prev[item.id] + 1,
                    };
                  });
                  setTotal((prev) => {
                    return {
                      ...prev,
                      [item.id]: prev[item.id] + item.amount,
                    };
                  });
                }}
              >
                +
              </span>
            </div>
          </section>
        </div>
      ))}
    </div>
  );
}

export default Acquiring
