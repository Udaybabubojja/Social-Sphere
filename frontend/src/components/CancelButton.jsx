import { Button, useColorMode } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const CancelButton = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <Button
      position={"fixed"}
      bottom={10}
      right={10}
      bg={colorMode === "light" ? "red.300" : "red.700"}
      onClick={handleCancel}
    >
      Cancel
    </Button>
  );
};

export default CancelButton;
