import {
  Box,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import React from "react";
import { IoClose } from "react-icons/io5";
import ClickStatistics from "../ClickStatistics";

const VendorRewardModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            // width: { xs: "90%", sm: "70%", md: "60%", lg: "50%", xl: "50%" },
            width: { xs: "90%", sm: "80%", md: "70%", lg: "60%", xl: "50%" },
            maxHeight: "80%",
            overflowY: "auto",
            borderRadius: "8px",
            boxShadow: 3,
            p: 3,
          }}
        >
          <DialogTitle
            sx={{ m: 0, p: 2, textAlign: "center" }}
            id="customized-dialog-title"
          >
            TRANSIENT VENDOR REWARDS
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={(theme) => ({
              position: "absolute",
              right: 16,
              top: 16,
              fontSize: "20px",
              border: "1px solid gray",
              borderRadius: "10px",
            })}
          >
            <IoClose />
          </IconButton>
          <DialogContent dividers>
            <ClickStatistics />
          </DialogContent>
        </Box>
      </Fade>
    </Modal>
  );
};

export default VendorRewardModal;
