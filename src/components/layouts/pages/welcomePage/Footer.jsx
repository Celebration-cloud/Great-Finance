import styles from './Footer.module.css'
function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.copyright}>
        Copyright<img src='../../../../public/images/copyright.svg' alt=''/><strong>greatfinance.com. All Rights Reserved.</strong>
      </span>
    </footer>
  );
}

export default Footer
