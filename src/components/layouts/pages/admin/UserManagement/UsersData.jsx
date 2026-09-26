import styles from './UsersData.module.css'
function UsersData() {

  return (
    <div className={styles.items} style={{ width: "100%" }}>
      <section className={styles.item}>
        <div>
          <span>1. </span>
        </div>
        <div>
          <span>Ezugwu samuel </span>
        </div>
        <div>
          <span>User ID: 2313453212</span>
        </div>
        <div>
          <span>Email: ezugsjatek@gmail.com</span>
        </div>
        <div>
          <button className={styles.log}>Login</button>
        </div>
        <div>
          <button className={styles.ban}>Ban User</button>
        </div>
      </section>
    </div>
  );
}

export default UsersData;
