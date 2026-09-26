import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import {useDispatch} from 'react-redux'
import { auth } from '../../supabase/Supabase';
function useAuth(){
  const dispatch = useDispatch()
  useEffect(() => {
    // Verify if the user is authenticated
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({type: "SUPA_SESSION", payload: user})
      } else {
        dispatch({ type: "SUPA_SESSION", payload: null });
      }
    });
  }, [dispatch])
}

export default useAuth
