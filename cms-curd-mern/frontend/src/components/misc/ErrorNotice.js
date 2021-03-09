import React, { useState } from "react";

import Alert from 'react-bootstrap/Alert'


function ErrorNotice (props) {
    const [show, setShow] = useState(props.message ? true :false);

    const onClose = () => {
        setShow(false);
    }

    if (show) {
        return (
          <Alert variant="danger" onClose={onClose && props.clearError} dismissible>
            <Alert.Heading>{props.message}</Alert.Heading>
          </Alert>
        );
      }
      else{
        return (
          ''
        )
      }

    // return (
    //     <div className="error-notice">
    //         <span>{props.message}</span>
    //         <button onClick={props.clearError}>X</button>
    //     </div>
    // );
}

export default ErrorNotice;