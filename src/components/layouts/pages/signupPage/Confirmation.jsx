import {useNavigate} from 'react-router-dom'
import { useDispatch } from "react-redux";
function Confirmation() {
    const navigate = useNavigate()
    const dispatch = useDispatch()


  return (
    <div>
      <img src='/public/images/logo.svg' width="100px" alt=''/>
      <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
        <span><p>Check your email, then</p>
      <p style={{color: "blue"}} onClick={() => (navigate("/Login"), dispatch({type: "CONFIRMED" }))}>Login</p></span>
      </div>

    </div>
  )
}

export default Confirmation
