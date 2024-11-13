import "../../App.css";
import React, { useState } from "react";
import { Map, Marker} from "@vis.gl/react-google-maps";

const GoogleMap = () => {
  // shows marker on London by default
  // const [markerLocation, setMarkerLocation] = useState({
  //   lat: 21.1702,
  //   lng: 72.8311,
  // });
  // State to hold multiple marker locations
  const [markerLocations, setMarkerLocations] = useState([
    { lat: 21.1702, lng: 72.8311 }, // Marker for Surat
    { lat: 38.9047, lng: -77.0163 }, // Marker for Washington
    { lat: 42.3188, lng: -71.0852 }, // Marker for Boston
    { lat: 35.6895, lng: 139.6917 }, // Marker for Tokyo
    { lat: 40.0077, lng: -75.1339 } // Marker for Philadelphia
  ]);

  return (
    <div className="map-container">
      <Map
        style={{ borderRadius: "20px" }}
        defaultZoom={10}
        // defaultCenter={markerLocation}
        defaultCenter={{ lat: 21.1702, lng: 72.8311 }}
        gestureHandling={"greedy"}
        disableDefaultUI
      >
        {/* <Marker position={markerLocation} /> */}
        {markerLocations.map((location, index) => (
          <Marker key={index} position={location} />
        ))}
      </Map>
    </div>
  );
}

export default GoogleMap;
