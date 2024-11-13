import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IoMdCall } from "react-icons/io";
import { FaWpforms } from "react-icons/fa";
import SupporyQueryModal from "./modals/SupporyQueryModal";
import { Typography } from "@mui/material";

const SupportMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openQueryModal, setOpenQueryModal] = React.useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenQueryModal = () => {
    setOpenQueryModal(true);
    setAnchorEl(null);
  };

  const handleCloseQueryModal = () => {
    setOpenQueryModal(false);
    setAnchorEl(null);
  };
  return (
    <>
      <Typography
        id="support-button"
        aria-controls={open ? "support-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        m={0}
      >
        <p className="text-sm font-semibold transition-colors duration-300 hover:text-yellow-400 cursor-pointer">
          Support
        </p>
      </Typography>
      <Menu
        id="support-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "support-button",
        }}
      >
        <MenuItem>
          <a href="tel:18883795590" className="flex gap-2 items-center">
            <span>
              <IoMdCall />
            </span>
            Call Suport{" "}
          </a>
        </MenuItem>
        <MenuItem onClick={handleOpenQueryModal}>
          <span className="mr-2">
            <FaWpforms />
          </span>
          Fill Your Query
        </MenuItem>
      </Menu>
      <SupporyQueryModal
        open={openQueryModal}
        onClose={handleCloseQueryModal}
      />
    </>
  );
};

export default SupportMenu;
