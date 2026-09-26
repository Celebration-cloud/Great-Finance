import ourPlansGuide from "./OurPlansGuide"
import styles from './OurPlan.module.css'
import {v4 as uuid} from 'uuid'
function OurPlan() {
    const ti = Intl.NumberFormat("en-us")
  return (
    <div className={styles.ourPlans}>
      <h2>Our Plans</h2>
      <section className={styles.ourPlansSection}>
        {ourPlansGuide.map((item) => (
          <div className={styles.planning} key={uuid()}>
            <article className={styles.plans}>
              <span>${ti.format(item.amount)}</span>
              <p>to get</p>
              <span>${ti.format(item.get)}</span>
              <strong>
                <h6>R.O.I</h6>
                <p>{item.duration}days</p>
              </strong>
            </article>
            <div>Invest</div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default OurPlan
