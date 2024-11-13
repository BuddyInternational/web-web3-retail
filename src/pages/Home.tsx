import { useState } from "react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { NFTDetails } from "../utils/Types";
import { useVanityContext } from "../context/VanityContext";
import { Menu, MenuItem, Tooltip, IconButton } from "@mui/material";
import { SiPolygon } from "react-icons/si";
import { FaEthereum } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";

const tokenDetails = {
  [process.env.REACT_APP_TOKEN1_ADDRESS!]: {
    name: "CDE®v1",
    symbol: "CDE",
  },
  [process.env.REACT_APP_TOKEN2_ADDRESS!]: {
    name: "CDE®v2",
    symbol: "CDE",
  },
  [process.env.REACT_APP_TOKEN3_ADDRESS!]: {
    name: (
      <span style={{ display: "flex", alignItems: "center" }}>
        TIM
        <img
          src="/TIM.svg"
          alt="TIM Logo"
          style={{
            height: "0.8em",
            marginLeft: "1px",
            verticalAlign: "middle",
          }}
        />
      </span>
    ),
    symbol: "TIM",
  },
};

const Home = () => {
  const [balances, setBalances] = useState<any>({
    wallet: [],
    vanity: [],
  });
  const [testCDEBalance, setTestCDEBalance] = useState(0);
  const [testTIMBalance, setTestTIMBalance] = useState(0);
  const [NFTdata, setNFTdata] = useState<NFTDetails[]>([]);

  const { vanityAddress } = useVanityContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const isDropdownOpen = Boolean(anchorEl);

  const handleDropdownToggle = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Function to calculate the total USD value of all NFTs
  const calculateTotalNFTValue = () => {
    if (!NFTdata.length) return 0;

    let totalFloorPriceUsd = 0;
    for (const nft of NFTdata) {
      if (nft.floorPriceUsd !== null) {
        totalFloorPriceUsd += Number(nft.floorPriceUsd);
      }
    }
    return Number(totalFloorPriceUsd).toFixed(4);
  };

  return (
    <>
      <div className="flex justify-end w-full">
        <div className="flex  justify-end flex-col sm:gap-4 md:gap-4 lg:gap-6 text-md font-normal w-full md:w-1/4 sm:text-center md:text-left">
          <div className="text-white flex gap-1">
            <span className="text-blue-400 mr-2">Total Value :</span>{" "}
            <span>{calculateTotalNFTValue()} USD</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="md:mb-0 lg:mb-2 flex flex-col">
              <span className="md:text-sm lg:text-md font-sans text-blue-400 font-bold flex gap-3 items-center sm:justify-center md:justify-start">
                <span className="text-center mt-1">Wallet Address Balance</span>
              </span>
              <hr className="sm:border-dotted sm:border-t sm:border-gray-600 sm:w-full sm:my-1 sm:m-auto md:w-full md:my-2" />
            </div>
            {/* Loop through tokenDetails to display the balances */}
            {Object.keys(tokenDetails).map((tokenAddress, idx) => {
              const walletToken = balances.wallet.find(
                (token: any) => tokenAddress === token.address
              );
              const walletBalance = walletToken ? walletToken.balance : "0";

              return (
                <div
                  key={idx}
                  className="md:text-sm lg:text-md text-white flex sm:m-auto md:m-0 sm:flex-col 2xl:flex-row gap-1"
                >
                  <span className="text-[#5692D9] mr-2 flex gap-1">
                    <p>{tokenDetails[tokenAddress].name}</p>
                    <p>Token Balance:</p>
                  </span>{" "}
                  <span>
                    {walletBalance} {tokenDetails[tokenAddress].symbol}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <div className="md:mb-0 lg:mb-2 flex flex-col">
              <span className="md:text-sm lg:text-md font-sans text-blue-400 font-bold flex gap-3 sm:justify-center md:justify-start items-center">
                <span className="text-center mt-1">Vanity Address Balance</span>

                {/* Etherscan Link */}
                <Tooltip title="View on Etherscan" arrow>
                  <a
                    href={`https://etherscan.io/address/${vanityAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5692D9] mt-1.5 cursor-pointer"
                    data-tip="View on Etherscan"
                  >
                    <FaEthereum />
                  </a>
                </Tooltip>

                {/* Polygonscan Link */}
                <Tooltip title="View on Polygonscan" arrow>
                  <a
                    href={`https://polygonscan.com/address/${vanityAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5692D9] mt-1.5 cursor-pointer"
                    data-tip="View on Polygonscan"
                  >
                    <SiPolygon />
                  </a>
                </Tooltip>

                {/* CDE Link */}
                <Tooltip title="CDE" arrow>
                  <a
                    href={`/#`}
                    rel="noopener noreferrer"
                    className="text-[#5692D9] mt-1 cursor-pointer"
                    data-tip="CDE"
                    onClick={() => alert("Prestige this Account")}
                  >
                    <img src="/CDE.svg" className="h-4 w-auto" alt="CDE" />
                  </a>
                </Tooltip>

                {/* Dropdown Toggle Button */}
                <IconButton
                  aria-label="more"
                  aria-controls={isDropdownOpen ? "long-menu" : undefined}
                  aria-haspopup="true"
                  onClick={handleDropdownToggle}
                  className="text-[#5692D9] mt-1 cursor-pointer"
                >
                  <IoMdArrowDropdown />
                </IconButton>
              </span>

              {/* Material-UI Dropdown */}
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={isDropdownOpen}
                onClose={handleClose}
                slotProps={{
                  paper: {
                    style: {
                      maxHeight: 200,
                      width: "20ch",
                      marginTop: "8px",
                    },
                  },
                }}
              >
                {/* {vanityAddresses.map((address) => (
          <MenuItem
            key={address}
            onClick={() => handleAddressSelect(address)}
          >
            {address}
          </MenuItem>
        ))} */}
                {/* Disabled option */}
                <MenuItem disabled>Prestige this Account</MenuItem>
              </Menu>

              <hr className="sm:border-dotted sm:border-t sm:border-gray-600 sm:w-full sm:my-1 sm:m-auto md:w-full md:my-2" />
            </div>

            {/* Loop through tokenDetails for vanity address */}
            {Object.keys(tokenDetails).map((tokenAddress, idx) => {
              const vanityToken = balances.vanity.find(
                (token: any) => tokenAddress === token.address
              );
              const vanityBalance = vanityToken ? vanityToken.balance : "0";

              return (
                <div
                  key={idx}
                  className="md:text-sm lg:text-md text-white flex sm:m-auto md:m-0 sm:flex-col 2xl:flex-row gap-1"
                >
                  <span className="text-[#5692D9] mr-2 flex gap-1">
                    <p>{tokenDetails[tokenAddress].name}</p>
                    <p>Token Balance:</p>
                  </span>{" "}
                  <span>
                    {vanityBalance} {tokenDetails[tokenAddress].symbol}
                  </span>
                </div>
              );
            })}
            <div className="md:text-sm lg:text-md text-white flex sm:m-auto md:m-0 sm:flex-col 2xl:flex-row gap-1">
              <span className="text-[#5692D9] mr-2">
                Test CDE Token Balance:
              </span>{" "}
              <span>{testCDEBalance} TCDE</span>
            </div>
            <div className="md:text-sm lg:text-md text-white flex sm:m-auto md:m-0 sm:flex-col 2xl:flex-row gap-1">
              <span className="text-[#5692D9] mr-2">
                Test TIM Token Balance:
              </span>{" "}
              <span>{testTIMBalance} TTIM</span>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default Home;
