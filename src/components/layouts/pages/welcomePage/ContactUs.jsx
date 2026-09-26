import styles from './ContactUs.module.css'
function ContactUs() {
  return (
    <div className={styles.contactUs}>
      <h2>Contact Us</h2>
      <div className={styles.email}>
        <span>Send us an email</span>
        <p>greatfinanceng@gmail.com</p>
      </div>
      <div className={styles.whatsapp}>
        <span>Chat us on whatsapp</span>
        <p>07031069524</p>
      </div>
    </div>
  );
}

export default ContactUs
