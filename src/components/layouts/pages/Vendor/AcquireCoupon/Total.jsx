/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import styles from "./Total.module.css";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../../Loading";
function Total({ tols }) {
  const navigate = useNavigate();
  const result = tols
    .map((total) => total)
    .reduce((previous, current) => {
      return previous + current;
    }, 0);
  console.log(result);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const converter = rates.result;
  console.log(converter);

  const getRates = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetch(
        `https://api.exconvert.com/convert?access_key=42277b28-a72bd820-d86b1e17-a4fc58a2&from=NGN&to=USD&amount=${result}`
      );
      if (data.status === 404) throw new Error("Something went wrong");
      if (!data.ok) throw new Error("Something went wrong");
      const res = await data.json();
      setLoading(false);
      setRates(res);

    } catch (error) {
      setLoading(false);
      // setErrorEl(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [result]);

  useEffect(() => {
    getRates();
  }, [getRates]);

  return (
    <div className={styles.totalContent}>
      {!loading && result < 10000 && (
        <div className={styles.warning}>
          <p>Your total acquistion must be upto </p>
          <span className={styles.warn}>
            <img src="/public/images/mdi_naira_warning.svg" alt="" />
            <span>10000</span>
          </span>
        </div>
      )}

      {loading && (
        <span className={styles.loading}>
          <Loading color="primary" />
        </span>
      )}
      {!loading && result >= 10000 && (
        <div className={styles.total}>
          <span className={styles.price}>
            <span style={{ fontWeight: "bold" }}>Total:</span>
            <img src="/public/images/mdi_naira.svg" alt="" />
            <span>{result.toLocaleString()}</span>
          </span>

          <p>
            <span className={styles.price}>
              <span style={{ fontWeight: "bold" }}>USDT equivalent:</span>
              <span>{converter.USD.toLocaleString()}</span>
            </span>
          </p>
        </div>
      )}

      <div className={styles.submit}>
        <button
          onClick={() => navigate(`/vendor/acquire/${converter.USD}`)}
          disabled={!loading && result < 10000}
        >
          Proceed to payment
        </button>
      </div>
    </div>
  );
}

export default Total;
