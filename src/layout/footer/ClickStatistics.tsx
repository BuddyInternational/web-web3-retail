import React, { useEffect, useState } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Skeleton } from "@mui/material";
import ImageCarousel from "./ImageCarousel";
import Map from "./GoogleMap";
import { APIProvider } from "@vis.gl/react-google-maps";
import GoogleMap from "./GoogleMap";
import { saveAs } from "file-saver";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// interface ClickData {
//   x: string;
//   y: string;
// }

// interface APIResponse {
//   clickStatistics: {
//     datasets: [
//       {
//         data: ClickData[];
//       }
//     ];
//   };
//   os: { os: string; score: number }[];
//   country: { countryName: string; score: number }[];
//   city: { city: string; score: number; name: string; countryCode: string }[];
// }

interface ClickDataPoint {
  x: string; // Date string, like "2024-09-24T00:00:00.000Z"
  y: string; // Number of clicks
}

interface Dataset {
  data: ClickDataPoint[];
}

interface ClickStatistics {
  datasets: Dataset[];
}

interface OSData {
  os: string;
  score: number;
}

interface CountryData {
  countryName: string;
  country: string;
  score: number;
}

interface CityData {
  name: string;
  countryCode: string;
  score: number;
}

interface APIResponse {
  clickStatistics: ClickStatistics;
  os: OSData[];
  country: CountryData[];
  city: CityData[];
}

interface VanityData {
  walletAddress: string;
  vanityAddress: string;
  vanityPrivateKey: string;
  createdAt: string;
}

// API KEY
const LINK_STATISTICS_API_KEY = process.env.REACT_APP_LINK_STATISTICS_API;
const LINK_ID = process.env.REACT_APP_LINK_STATISTICS_LINKID;
const google_map_api_key = process.env.REACT_APP_GOOGLE_MAP_API;

const ClickStatistics: React.FC = () => {
  // Static Data (replace API call with this)
  const staticData = {
    clickStatistics: {
      datasets: [
        {
          data: [
            { x: "2024-09-24T00:00:00.000Z", y: "3" },
            { x: "2024-09-25T00:00:00.000Z", y: "0" },
            { x: "2024-09-26T00:00:00.000Z", y: "0" },
            { x: "2024-09-27T00:00:00.000Z", y: "0" },
            { x: "2024-09-28T00:00:00.000Z", y: "0" },
            { x: "2024-09-29T00:00:00.000Z", y: "0" },
            { x: "2024-09-30T00:00:00.000Z", y: "1" },
            { x: "2024-10-01T00:00:00.000Z", y: "0" },
            { x: "2024-10-02T00:00:00.000Z", y: "0" },
            { x: "2024-10-03T00:00:00.000Z", y: "0" },
            { x: "2024-10-04T00:00:00.000Z", y: "0" },
            { x: "2024-10-05T00:00:00.000Z", y: "0" },
            { x: "2024-10-06T00:00:00.000Z", y: "0" },
            { x: "2024-10-07T00:00:00.000Z", y: "0" },
            { x: "2024-10-08T00:00:00.000Z", y: "0" },
            { x: "2024-10-09T00:00:00.000Z", y: "1" },
            { x: "2024-10-10T00:00:00.000Z", y: "0" },
            { x: "2024-10-11T00:00:00.000Z", y: "1" },
            { x: "2024-10-12T00:00:00.000Z", y: "1" },
            { x: "2024-10-13T00:00:00.000Z", y: "0" },
            { x: "2024-10-14T00:00:00.000Z", y: "0" },
            { x: "2024-10-15T00:00:00.000Z", y: "0" },
            { x: "2024-10-16T00:00:00.000Z", y: "0" },
            { x: "2024-10-17T00:00:00.000Z", y: "0" },
            { x: "2024-10-18T00:00:00.000Z", y: "0" },
            { x: "2024-10-19T00:00:00.000Z", y: "0" },
            { x: "2024-10-20T00:00:00.000Z", y: "0" },
            { x: "2024-10-21T00:00:00.000Z", y: "0" },
            { x: "2024-10-22T00:00:00.000Z", y: "0" },
            { x: "2024-10-23T00:00:00.000Z", y: "2" },
            { x: "2024-10-24T00:00:00.000Z", y: "4" },
          ],
        },
      ],
    },
    os: [
      { os: "iOS", score: 7 },
      { os: "Linux", score: 3 },
      { os: "Mac OS X", score: 2 },
      { os: "Windows", score: 1 },
    ],
    country: [
      { countryName: "United States", country: "US", score: 9 },
      { countryName: "India", country: "IN", score: 3 },
      { countryName: "Japan", country: "JP", score: 1 },
    ],
    city: [
      { name: "Surat", countryCode: "IN", score: 3 },
      { name: "Washington", countryCode: "US", score: 3 },
      { name: "Boston", countryCode: "US", score: 3 },
      { name: "Boardman", countryCode: "US", score: 2 },
      { name: "Tokyo", countryCode: "JP", score: 1 },
      { name: "Philadelphia", countryCode: "US", score: 1 },
    ],
  };

  const [clickData, setClickData] = useState<ClickDataPoint[]>([]);
  const [osData, setOsData] = useState<OSData[]>([]);
  const [countryData, setCountryData] = useState<
  CountryData[]
  >([]);
  const [cityData, setCityData] = useState<
  CityData[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);



  useEffect(() => {
    // Set static data instead of fetching
    const clickData = staticData.clickStatistics.datasets[0].data;
    const osData = staticData.os;
    const countryData = staticData.country;
    const cityData = staticData.city;

    setClickData(clickData);
    setOsData(osData);
    setCountryData(countryData);
    setCityData(cityData);
    setLoading(false);
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const options = {
  //         method: "GET",
  //         url: `/statistics/link/${LINK_ID}?period=last30&tz=UTC`,
  //         headers: { accept: "*/*", Authorization: LINK_STATISTICS_API_KEY },
  //       };

  //       const response = await axios.request<APIResponse>(options);
  //       console.log("response--------",response);
  //       if(response){
  //         const clickData = response.data.clickStatistics.datasets[0].data;
  //         const osData = response.data.os;
  //         const countryData = response.data.country;
  //         const cityData = response.data.city;
  
  //         setClickData(clickData);
  //         setOsData(osData);
  //         setCountryData(countryData);
  //         setCityData(cityData);
  //         setLoading(false);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);


  const labels = clickData.map((item) => new Date(item.x).toLocaleDateString());
  const dataPoints = clickData.map((item) => parseInt(item.y));

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Clicks Over Time",
        data: dataPoints,
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const osLabels = osData.map((os) => os.os);
  const osScores = osData.map((os) => os.score);

  const osChartData = {
    labels: osLabels,
    datasets: [
      {
        label: "Devices",
        data: osScores,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const countryLabels = countryData.map((country) => country.countryName);
  const countryScores = countryData.map((country) => country.score);

  const countryChartData = {
    labels: countryLabels,
    datasets: [
      {
        label: "Countries",
        data: countryScores,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const cityLabels = cityData.map((city) => city.name);
  const cityScores = cityData.map((city) => city.score);

  const cityChartData = {
    labels: cityLabels,
    datasets: [
      {
        label: "Cities",
        data: cityScores,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const downloadCsv = () => {
    const csvRows = [["Date", "Clicks"]];

    clickData.forEach((item) => {
      csvRows.push([new Date(item.x).toLocaleDateString(), item.y]);
    });

    csvRows.push(["", ""]);
    csvRows.push(["Device", "Score"]);
    osData.forEach((os) => {
      csvRows.push([os.os, os.score.toString()]);
    });

    csvRows.push(["", ""]);
    csvRows.push(["Country", "Score"]);
    countryData.forEach((country) => {
      csvRows.push([country.countryName, country.score.toString()]);
    });

    csvRows.push(["", ""]);
    csvRows.push(["City", "Score"]);
    cityData.forEach((city) => {
      csvRows.push([city.name, city.score.toString()]);
    });

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "click_statistics.csv");
    a.click();
  };

  // Server API Base URL
  const server_api_base_url: any = process.env.REACT_APP_SERVER_API_BASE_URL;

  // Function to fetch data from the backend for vanity data
  const downloadVanityData = async () => {
    try {
      const response = await axios.get(`${server_api_base_url}/api/vanity/downloadVanityAddress`);
      
      // Check if response.data exists and is an array
      if (response.data.data && Array.isArray(response.data.data)) {
        console.log("Setting data", response.data.data);

        const csv = convertToCSV(response.data.data);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "data.csv");
      } else {
        console.log("No data found");
        alert("No data to download");
          return;
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  // Function to convert data to CSV format
  const convertToCSV = (array: VanityData[]) => {
    const headers = Object.keys(array[0]).join(",") + "\n";
    const rows = array.map((obj) => Object.values(obj).join(",")).join("\n");
    return headers + rows;
  };

  // Replace loading message with Skeleton components
  if (loading) {
    return (
      <div className="container mx-auto p-4 bg-white">
        <h1 className="text-3xl font-bold mb-4 text-center">
          <Skeleton variant="text" width="60%" animation="wave" />
        </h1>

        <div className="mb-6 px-4 sm:px-8 lg:px-20">
          <Skeleton variant="rectangular" width="100%" height={400} animation="wave"/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="rounded" width="100%" height={200} animation="wave"/>
          </div>
          <div className="flex flex-col items-center">
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="rounded" width="100%" height={200} animation="wave"/>
          </div>
          <div className="flex flex-col items-center">
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="rounded" width="100%" height={200} animation="wave"/>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-white my-2">
      <h1 className="text-2xl font-bold mb-4 text-center">Retail QR Scan</h1>

      {/* Line Chart for Clicks Over Time */}
      <div
        className="mb-6"
      >
        <Line data={chartData} options={{ responsive: true }} />
      </div>

      {/* Grid Layout for Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
        {/* Pie Chart for Devices */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold text-center mb-4">
            Device Breakdown
          </h2>
          <div className="w-full max-w-md">
            <Pie data={osChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Pie Chart for Countries */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold text-center mb-4">
            Country Breakdown
          </h2>
          <div className="w-full max-w-md">
            <Pie
              data={countryChartData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Pie Chart for Cities */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold text-center mb-4">City Breakdown</h2>
          <div className="w-full max-w-md">
            <Pie
              data={cityChartData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>

      <div className="">
      <APIProvider apiKey={google_map_api_key!}>
    <GoogleMap />
  </APIProvider>
      </div>
      <div className="my-4">
        <ImageCarousel />
      </div>

      {/* CSV Download Button */}
      <div className="flex justify-between mt-4 sm:mt-28 md:mt-12">
        <button
          onClick={downloadCsv}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Download CSV
        </button>
        <button
          onClick={downloadVanityData}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Download Vanity Data
        </button>
      </div>
    
    </div>
  );
};

export default ClickStatistics;
