/* eslint-disable react/prop-types */
import styles from './TableData.module.css'
import { useSelector } from 'react-redux';
function TableData({dashboard, data}) {
  const session = useSelector(store => store.user.session)
  console.log(session, data)

  return (
    <table className={styles[`table-data`]}>
      <thead>
        <tr>
          <th>Coupon codes</th>
          <th>Coupon value</th>
          <th>Status</th>
          <th>Coupon Name</th>
          {dashboard === "vendor" && <th>Date of purchase</th>}
        </tr>
      </thead>
      <tbody>
        <tr className={styles["coupon"]}>
          <td data-column="Codes">
            <span data-column="Number">1</span>
            <span>367289262</span>
          </td>
          <td data-column="Email">N 1O,000</td>
          <td data-column="Phone Number">Available</td>
          <td data-column="Country">MAXI PLAN</td>
          {dashboard === "vendor" && <td data-column="Country">12/02/2024</td>}
        </tr>
        <tr className={styles["coupon"]}>
          <td data-column="Codes">
            <span data-column="Number">2</span>
            <span>367289262</span>
          </td>
          <td data-column="Email">N 1O,000</td>
          <td data-column="Phone Number">Available</td>
          <td data-column="Country">MAXI PLAN</td>
          {dashboard === "vendor" && <td data-column="Country">12/02/2024</td>}
        </tr>
        <tr className={styles["coupon"]}>
          <td data-column="Codes">
            <span data-column="Number">3</span>
            <span>367289262</span>
          </td>
          <td data-column="Email">N 1O,000</td>
          <td data-column="Phone Number">Available</td>
          <td data-column="Country">MAXI PLAN</td>
          {dashboard === "vendor" && <td data-column="Country">12/02/2024</td>}
        </tr>
      </tbody>
    </table>
  );
}

export default TableData
