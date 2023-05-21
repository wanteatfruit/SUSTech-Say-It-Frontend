import {
  Box,
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import axios from "axios";
import cheerio from "cheerio";
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import Head from "next/head";
// import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder';
interface props {
  onClose: () => void;
  isOpen: boolean;
}

function Map() {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://api.maptiler.com/maps/topo-v2/style.json?key=P8tMJk1zo1DT7YAb58JN",
      center: [-74.5, 40],
      zoom: 2,
      localIdeographFontFamily: "'Noto Sans', 'Noto Sans CJK SC', sans-serif",
    });

    const geocoder_api = {
      forwardGeocode: async (config) => {
        const features = [];
        try {
          let request = 
            "https://nominatim.openstreetmap.org/search?q=" +
            config.query +
            "&format=geojson&polygon_geojson=1&addressdetails=1";
          const response = await fetch(request);
          const geojson = await response.json();
          for (let feature of geojson.features) {
            let center = [
              feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
              feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
            ];
            let point = {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: center,
              },
              place_name: feature.properties.display_name,
              properties: feature.properties,
              text: feature.properties.display_name,
              place_type: ["place"],
              center: center,
            };
            features.push(point);
          }
        } catch (e) {
          console.error(`Failed to forwardGeocode with error: ${e}`);
        }

        return {
          features: features,
        };
      },
    };

    const geoapi = new MaplibreGeocoder(geocoder_api, {
      maplibregl: maplibregl,
      showResultsWhileTyping: true,
      languague:"zh,en",
      countries:'China',
      limit:6,
      // debounceSearch:100,
      zoom:4,
      flyTo:{maxZoom:4}
      // flyTo:false
    });

    geoapi.setLanguage("zh")
    

    map.addControl(
      geoapi
    );

    return () => {
      map.remove();
    };
  }, []);

  return <div ref={mapContainer} style={{ width: "100%", height: "70vh" }} />;
}

export default function MapPlugin({ isOpen, onClose }: props) {

  return (
    <>
      <Head>
        <link
          href="https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css"
          rel="stylesheet"
        />
      </Head>
      <script src="https://unpkg.com/@maplibre/maplibre-gl-geocoder@1.2.0/dist/maplibre-gl-geocoder.min.js"></script>
      <link
        rel="stylesheet"
        href="https://unpkg.com/@maplibre/maplibre-gl-geocoder@1.2.0/dist/maplibre-gl-geocoder.css"
        type="text/css"
      />
      <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={0}>互动地图</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Map />
          </ModalBody>
          <ModalFooter pt={0}>
            <Button onClick={onClose}>关闭</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
