import Explanation from './Explanation';
import Nav from './Nav'
import WelcomePanel from './WelcomePanel'
import styles from './Homepage.module.css'
import HowToInvest from './HowToInvest';
import OurPlan from './OurPlan';
import ContactUs from './ContactUs';
import Footer from './Footer';
import { useEffect } from 'react';
function Homepage() {
    document.title = `Homepage || Superpay`


  return (
    <div className={styles.homePage}><Nav/>
      <section className={styles.welcomeBlack}>
        <WelcomePanel/>
      </section>
      <Explanation/>
      <HowToInvest/>
      <OurPlan/>
      <ContactUs/>
      <Footer/>
    </div>
  );
}

export default Homepage
