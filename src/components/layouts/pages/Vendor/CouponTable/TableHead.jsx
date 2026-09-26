/* eslint-disable react/prop-types */
import styles from './TableHead.module.css'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
function TableHead({dashboard}) {
  return (
    <div className={styles["table-head"]}>
      <p>Coupon table</p>
      {dashboard === "vendor" && <p>status</p>}
      {dashboard !== "vendor" && (
        <PopupState variant="popover" popupId="demo-popup-popover">
          {(popupState) => (
            <div>
              <span
                data-bs-container="body"
                data-bs-toggle="popover"
                data-bs-placement="bottom"
                data-bs-content="Bottom popover"
                {...bindTrigger(popupState)}
              >
                <img src="/public/images/filter.svg" alt="Filter" />
                <span>Filter</span>
              </span>
              <Popover
                {...bindPopover(popupState)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Typography sx={{ p: 0.8, mb: -2 }}>Available coupons</Typography>
                <hr />
                <Typography sx={{ p: 0.8, mt: -2 }}>Sold coupons</Typography>
              </Popover>
            </div>
          )}
        </PopupState>
      )}
    </div>
  );
}

export default TableHead
