/* eslint-disable react/prop-types */
import TableHead from './TableHead'
import styles from './CouponTable.module.css'
import TableData from './TableData'
function CouponTable({dashboard, data}) {
  return (
    <div className={styles['coupon-table']}>
      <section>
        <TableHead  dashboard={dashboard}/>
      </section>
      <section>
        <TableData dashboard={dashboard} data={data}/>
      </section>
    </div>
  )
}

export default CouponTable
