import { Link } from 'react-router-dom';
import styles from './WelcomePanel.module.css'
function WelcomePanel() {
  return (
    <div className={styles.welcome}>
      <h1 className={styles.welcomePanel}>
        Exceed your financial struggles <br/>
        today with <span className={styles.greatFinance}>Great finance</span> <br/>
        and make <br/>
        your future easier.
      </h1>
      <div className={styles.entry}>
        <Link to="/login"><div>Login</div></Link>
        <Link to="/signup"><div>Register</div></Link>

      </div>
    </div>
  );
}

export default WelcomePanel
