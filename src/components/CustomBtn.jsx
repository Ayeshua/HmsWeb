import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";

function CustomBtn({
  label,
  type,
  color1,
  color2,
  margin,
  btnClicked,
  disabled,
  uploading,
}) {
  const [btnEntered, setBtnEntered] = useState(false);

  return (
    <Button
      type={type}
      onMouseEnter={() => setBtnEntered(true)}
      onMouseLeave={() => setBtnEntered(false)}
      onClick={() => {
        if (btnClicked) btnClicked();
      }}
      disabled={disabled}
      style={{
        borderRadius: "7px",
        padding: "7px",
        color: "white",
        cursor: "pointer",
        border: "#c84b15 0px solid",
        margin,
        fontWeight: "bold",
        backgroundColor: btnEntered ? color2 : color1,
      }}
    >
      <>
        {uploading ? (
          <>
            <span>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                color="white"
              />
            </span>
            wait...
          </>
        ) : (
          label
        )}
      </>
    </Button>
  );
}

export default CustomBtn;
