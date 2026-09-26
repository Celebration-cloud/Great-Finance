import { useState } from 'react';
import styles from './Recovery.module.css'
import { auth } from '../../../../supabase/Supabase';
import { Box, Button, Modal, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth/web-extension';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
function Recovery() {
  const [email, setEmail] = useState('')
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const handleClose = () => {
    setOpen(false)
    navigate('/login')
  };

  function handleEmail(e) {
    setEmail(e.target.value)
  }

  async function handleReset(e) {
    e.preventDefault();
    try {
      setLoading(true)
      await sendPasswordResetEmail(auth, email)
      setLoading(false)
      setOpen(email && true);
    } catch (error) {
      alert(error.code);
      setLoading(false)
    }
  }
  console.log(email)
  return (
    <>
      <form className={styles.container}>
        <section className={styles.brand}>
          <div>
            <img onClick={() => navigate('/')} src="/public/images/IMG_2593.jpg" alt="" width="50%" />
          </div>
          <h3>Password Recovery</h3>
        </section>
        <section className={styles.form}>
          <span>
            Enter your email address in the space below, a recovery email will
            be sent to your email address, click on the link sent to your email
            inorder to change your password.
          </span>
          <input
            type="email"
            placeholder="Email Address"
            required
            onChange={handleEmail}
            className={styles.input}
          />
        </section>
        <section className={styles.submit}>
          <button type="submit" onClick={handleReset}>
            Proceed
          </button>
          <div className={styles.opt}>
            <span>
              Didn’t receive recovery email?{" "}
              <span onClick={handleReset} className={styles.resend}>
                Resend
              </span>
            </span>
          </div>
        </section>
      </form>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            Superpay
          </Typography>
          <Typography id="keep-mounted-modal-description" sx={{ mt: 2, mb: 2 }}>
            Check your email
          </Typography>
          <Button style={{ backgroundColor: "#004584", color: "white" }} onClick={handleClose}>
            Back to Login
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default Recovery
