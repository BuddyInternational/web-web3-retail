import  { useEffect } from "react";
const NotFound = () => {
    useEffect(() => {
        // Redirect to the PDF when this component mounts
        window.location.href = "/privacy-policy.pdf"; 
      }, []);
    
      return null;
};

export default NotFound;
