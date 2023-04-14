import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearMessage, setMessage } from '../store/slices/notificationMessagesSlice';
import generateRandomId from '../services/generateRandomId';
import { millisToMinutesAndSeconds } from '../services/convertToMinsHours';



/* const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '500px',
    minWidth: '400px',
    position: 'fixed',
    top: "50px",
    right: "10px",
    zIndex: 3000,
  },
})); */

const styles = {
  root: {
    maxWidth: '400px',
    position: 'fixed',
    top: "50px",
    right: "10px",
    zIndex: 3000,
  }
}

const Toast = ({id, message, severity }) => {
  const dispatch = useDispatch();
  return(
    <div className={`toast-container3 p-3`}>
      <div id="liveToast" className={`toast d-inline-block border ${severity === "success" ? "border-success" : "border-danger"} `} role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-header">
          <strong className={`me-auto ${severity === "success" ? "text-success" : "text-danger"} text-capitalize`}>{severity}</strong>
          <small>{millisToMinutesAndSeconds( Date.now() - id )} ago</small>
          <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" onClick={() => {
            dispatch(clearMessage({ severity: severity, key: id }))
          }}></button>
        </div>
        <div className="toast-body">
          {message}
        </div>
      </div>
    </div>
  )
}

export default function AlertNotification() {
  const messages = useSelector((state) => state.notificationMessages.messages)
  const { success, error } = messages

  useEffect(() => {
    /* dispatch(
      setMessage({
        severity: "success",
        message: "Recipient Updated Successfully",
        key: generateRandomId(44),
      })
    ); */
  }, [])

  const dispatch = useDispatch();

  const successMessages = () => {
    return success.map((message, index) => {
      setTimeout(() => {
        dispatch(clearMessage({severity: "success", key: message.key}))
      }, 5000);
      return (
        <Toast key={message.key} id={message.key} message={message.message} severity="success" />
      )
    })
  }

  const errorMessages = () => {
    return error.map((message, index) => {
      setTimeout(() => {
        dispatch(clearMessage({ severity: "error", key: message.key }))
      }, 5000);
      return (
        <Toast key={message.key} id={message.key} message={message.message} severity="error" />
      )
    })
  }

  return (
    <div style={styles.root} className="">
      {successMessages()}
      {errorMessages()}
    </div>
  );
}