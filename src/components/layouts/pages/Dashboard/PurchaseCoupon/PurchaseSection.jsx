import styles from './PurchaseSection.module.css'
function PurchaseSection() {
  const phoneNumber = `9014194307 `// Replace with your phone number
  const encodedMessage = encodeURIComponent("Hello, I have a question!"); // URL-encoded message

  return (
    <div className={styles.container}>
      <span className={styles.contact}>
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.9998 0.666672C6.63584 0.666672 0.666504 6.636 0.666504 14C0.666504 21.364 6.63584 27.3333 13.9998 27.3333C21.3638 27.3333 27.3332 21.364 27.3332 14C27.3332 6.636 21.3638 0.666672 13.9998 0.666672ZM9.33317 10.6667C9.33317 10.0538 9.45388 9.447 9.6884 8.88082C9.92292 8.31463 10.2667 7.80018 10.7 7.36684C11.1333 6.9335 11.6478 6.58976 12.214 6.35523C12.7802 6.12071 13.387 6 13.9998 6C14.6127 6 15.2195 6.12071 15.7857 6.35523C16.3519 6.58976 16.8663 6.9335 17.2997 7.36684C17.733 7.80018 18.0768 8.31463 18.3113 8.88082C18.5458 9.447 18.6665 10.0538 18.6665 10.6667C18.6665 11.9043 18.1748 13.0913 17.2997 13.9665C16.4245 14.8417 15.2375 15.3333 13.9998 15.3333C12.7622 15.3333 11.5752 14.8417 10.7 13.9665C9.82484 13.0913 9.33317 11.9043 9.33317 10.6667ZM22.3438 20.6453C21.3458 21.9008 20.0769 22.9146 18.6321 23.6109C17.1872 24.3073 15.6037 24.6682 13.9998 24.6667C12.396 24.6682 10.8125 24.3073 9.36761 23.6109C7.92277 22.9146 6.65392 21.9008 5.65584 20.6453C7.81717 19.0947 10.7665 18 13.9998 18C17.2332 18 20.1825 19.0947 22.3438 20.6453Z"
            fill="#8C8C8C"
          />
        </svg>
        <p>Edward mendel</p>
      </span>
      <div className={styles.whatsapp}>
        <a
          style={{ color: "white" }}
          href={`https://api.whatsapp.com/send?phone=${phoneNumber}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Chat on whatsapp
        </a>
      </div>
    </div>
  );
}

export default PurchaseSection
