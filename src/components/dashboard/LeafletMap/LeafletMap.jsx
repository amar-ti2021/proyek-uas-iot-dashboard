import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PropTypes from "prop-types";

const LeafletMap = ({ markers }) => {
  return (
    <MapContainer
      center={markers[0].position}
      zoom={15}
      style={{ minHeight: "250px", height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position}>
          <Popup>
            <strong>{marker.title}</strong>
            <br />
            <a href={marker.link} target="_blank" rel="noopener noreferrer">
              {marker.linkText}
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

LeafletMap.propTypes = {
  markers: PropTypes.array.isRequired,
};

export default LeafletMap;
