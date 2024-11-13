import React, { useState } from "react";
import SupportMenu from "./SupportMenu";
import { FaHeart, FaRegCopy } from "react-icons/fa";
import VendorRewardModal from "./modals/VendorRewardModal";

const Footer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const donateAddress = "0xDB9849fD5979ba41EFfd4Dcd935dEe03FD0549Da";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(donateAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Function to handle opening the modal Transient Vendor Rewards
  const handleOpenModal = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    setIsModalOpen(true);
  };

  // Function to handle closing the modal Transient Vendor Rewards
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <footer className="bg-[#00000044] text-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col 2xl:flex-row md:justify-between gap-8">
          {/* GIF Container */}
          <div className="flex-shrink-0 w-full md:w-1/3 lg:w-5/12 2xl:w-1/5 flex justify-center m-auto 2xl:m-0 xl:justify-start">
            <img
              src="/footer.gif"
              alt="Footer Animation"
              className="rounded-xl shadow-xl w-full h-auto max-h-32 object-cover cursor-pointer transition-transform duration-300 transform hover:scale-110"
            />
          </div>

          {/* Footer Text Content */}
          <div className="flex flex-col lg:text-center 2xl:text-left justify-center flex-1">
            <p className="text-sm leading-relaxed opacity-90 mb-4">
              This does not serve as investment advice, nor does it represent an
              invitation or endorsement to participate in any cryptocurrency
              transactions. Investing in crypto assets involves the risk of
              losing all or part of your investment. Only invest what you can
              afford to lose. For more information, please refer to the provided
              link.
            </p>

            <div className="text-sm opacity-90 flex flex-col lg:flex-row flex-1 items-center justify-center 2xl:justify-start text-center 2xl:text-left space-y-2 lg:space-y-0">
              {/* Link to Ly.money */}
              <a
                href="https://referral.ly.money/patronage.tld"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400"
              >
                Ly.money
              </a>

              {/* Donation Section */}
              <div className="flex md:flex-row sm:flex-col items-center space-y-2 sm:space-y-0 sm:space-x-1 md:ml-0 lg:ml-2">
                <span className="inline-flex">To donate with</span>
                <span className="inline-flex items-center">
                  <FaHeart className="text-red-600 mt-0.3" />
                </span>
                <span>to:</span>
                <div className="relative ml-1 flex gap-1">
                  {/* Full address for larger screens */}
                  <span
                    className="md:inline sm:hidden cursor-pointer text-blue-500 hover:text-blue-400"
                  >
                    {donateAddress}
                  </span>

                  {/* Shortened address for small screens */}
                  <span
                    className="sm:inline md:hidden cursor-pointer text-blue-500 hover:text-blue-400"
                  >
                    {`${donateAddress.slice(0, 6)}...${donateAddress.slice(
                      -4
                    )}`}
                  </span>
                  {/* Copy icon */}
                  <span
                    className="m-auto cursor-pointer text-blue-500 hover:text-blue-400"
                    onClick={handleCopyAddress}
                  >
                    <FaRegCopy /> 
                  </span>

                  {/* Tooltip */}
                  <div
                    className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-0 px-2 py-1 text-xs rounded bg-gray-800 text-white ${
                      copied ? "opacity-100" : "opacity-0"
                    } transition-opacity duration-300`}
                  >
                    {copied ? "Copied!" : ""}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm opacity-90 lg:flex flex-1 items-center justify-center text-center mt-4 ">
              Gully Buddy International ® All Rights Reserved
            </p>
          </div>

          {/* Links Container */}
          <div className="flex flex-col gap-2 items-center  justify-center">
            <a
              href="/terms-of-use.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold transition-colors duration-300 hover:text-yellow-400"
            >
              Terms of Use
            </a>
            <a
              href="/#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold transition-colors duration-300 hover:text-yellow-400"
              onClick={handleOpenModal}
            >
              Transient Vendor Rewards
            </a>
            <a
              href="/privacy-policy.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold transition-colors duration-300 hover:text-yellow-400"
            >
              Privacy
            </a>
            <a
              href="/privacy-policy.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold transition-colors duration-300 hover:text-yellow-400"
            >
              Feedback
            </a>
            <SupportMenu />
          </div>
        </div>

        {/* VendorReward Modal */}
        <VendorRewardModal open={isModalOpen} onClose={handleCloseModal} />
      </div>
    </footer>
  );
};

export default Footer;
