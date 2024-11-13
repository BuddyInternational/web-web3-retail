import {
  Box,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Modal,
} from "@mui/material";
import React from "react";
import { IoClose } from "react-icons/io5";
import CommonJotform from "../../../utils/CommonJotform";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useVanityContext } from "../../../context/VanityContext";
const supportQueryFormUrl = process.env.REACT_APP_SUPPORT_QUERY_JOTFORM_LINK;

const SupporyQueryModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { address } = useWeb3ModalAccount();
  const { vanityAddress } = useVanityContext();
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
            width: {
              xs: "99vw",
              sm: "80vw",
              md: "70vw",
              lg: "70vw",
              xl: "50vw",
            },
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
            Submit Your Query
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
            <CommonJotform
              formUrl={supportQueryFormUrl!}
              defaults={{
                walletAddress: address || "",
                vanityAddress: vanityAddress || "",
              }}
            />
          </DialogContent>
        </Box>
      </Fade>
    </Modal>
  );
};

export default SupporyQueryModal;
