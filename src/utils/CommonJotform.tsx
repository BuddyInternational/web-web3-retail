import React, { useEffect, useState } from "react";
import Jotform from "react-jotform";
import Skeleton from "@mui/material/Skeleton";

interface FormProps{
    formUrl : string;
    defaults : any; 
} 

const CommonJotform: React.FC<FormProps> = ({  formUrl, defaults  }) => {
  const [jotformLoaded, setJotformLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setJotformLoaded(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col space-y-4 my-4">
      {jotformLoaded ? (
        <Jotform
          src={formUrl || ""}
          defaults={defaults}
          className="w-full h-auto border border-gray-300 rounded-lg shadow-md"
        />
      ) : (
        <Skeleton variant="rectangular" width="100%" height={300} />
      )}
    </div>
  );
};

export default CommonJotform;
