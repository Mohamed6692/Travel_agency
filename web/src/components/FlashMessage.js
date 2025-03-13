import { useContext } from "react";
import { FlashContext } from "../contexts/FlashProvider";

export default function FlashMessage() {
  const { flashMessage, visible, hideFlash } = useContext(FlashContext);
  return (
    <div className="flash-message">
      <div className="flash-message-container">
        {visible && (
          <div
            className={`alert alert-${flashMessage.type} d-flex align-items-center justify-content-between`}
            role="alert"
          >
            <span className="text-center">{flashMessage.message}</span>
            <button
              type="button"
              className="btn-close justify-content-end"
              onClick={hideFlash}
            ></button>
          </div>
        )}
      </div>
    </div>
  );
}
