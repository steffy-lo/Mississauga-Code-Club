import React from "react";

import StatusModal from "./StatusModal";
import LoadingModal from "./LoadingModal";

export const STD_LOG = (src) => {
  src.setState({
    modalWindow: (
      <LoadingModal
        text={
          <span>
            Your login has expired
            <br />
            Please reauthenticate
            <br />
            Signing you out ...
          </span>
        }
      />
    )
  });
  setTimeout(() => window.location.reload(0), 1000);
}

export const STD_RELOAD = (text, src, action) => {
  src.setState({ modalWindow: ( <LoadingModal text={text} /> ) });
  setTimeout(action, 1000);
}

export const STD_STAT = (title, text, src) => {
  src.setState({
    modalWindow: (
      <StatusModal
        title={title}
        text={text}
        onClose={() => src.setState({modalWindow: ""})}
      />
    )
  });
}
