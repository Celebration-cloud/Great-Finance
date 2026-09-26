import howToInvestStep from './HowToInvestStep';
import styles from './HowToInvest.module.css'
function HowToInvest() {
  return (
    <div className={styles.howToInvest}>
      <h2>How To Invest</h2>
      <section>
        {howToInvestStep.map((item) => (
          <div className={styles.guide} key={item.id}>
            <span>0{item.id}</span>
            <p>{item.guide}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default HowToInvest
