import { useEffect, useState } from 'react'
import { Map, Marker, ZoomControl, Overlay } from 'pigeon-maps'
import { osm } from 'pigeon-maps/providers'
import { useDebounce } from 'use-debounce'

import CircleLoader from "react-spinners/CircleLoader";

import Icon from './target.svg'
import ExpandIcon from './expand-icon.svg'

export const App = () => {
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [isOpen, setIsOpen] = useState(true)

  const [data, setData] = useState()
  const [weather, setWeather] = useState()

  const [center, setCenter] = useState([40.758091, -74.000267])
  const [anchor, setAnchor] = useState(center)
  const [zoom, setZoom] = useState(17)

  const [displayNames, setDisplayNames] = useState()

  const [debouncedValue] = useDebounce(location, 1000);

  // const sendLocation = (location) => {
  //   if (location.length > 0) {
  //     fetch(`https://nominatim.openstreetmap.org/search?q=${location}&format=jsonv2`)
  //       .then(res => res.json())
  //       .then(dataJson => {
  //         console.log(dataJson)
  //         setZoom(17)
  //         setData(dataJson[0])
  //         setCenter([parseFloat(dataJson[0].lat), parseFloat(dataJson[0].lon)])
  //         setAnchor([parseFloat(dataJson[0].lat), parseFloat(dataJson[0].lon)])
  //       })
  //       .finally(() => {
  //         console.log("SETTING TO FALSE")
  //         setIsLoading(false)
  //       })
  //   }
  // }

  const reverseLookUp = () => {
    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
        .then(res => res.json())
        .then(dataJson => {
          console.log(dataJson)
          setZoom(17)
          setData(dataJson)
          setCenter([parseFloat(dataJson.lat), parseFloat(dataJson.lon)])
          setAnchor([parseFloat(dataJson.lat), parseFloat(dataJson.lon)])
        })
        .finally(() => {
          console.log("SETTING TO FALSE")
          setIsLoading(false)
        })
    });
  }

  useEffect(() => {
    if (center) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${center[0]}&lon=${center[1]}&appid=06d73ad44324084601b8cbbe52ab44b2`)
        .then(res => res.json())
        .then(dataJson => setWeather(dataJson))
    }
  }, [center])

  function mapTiler (x, y, z, dpr) {
    return `https://maptiles.p.rapidapi.com/en/map/v1/${z}/${x}/${y}.png?rapidapi-key=5e03c7f7cemsh40721afc8a3ddc5p1e7af4jsnd63ea410a5c0`
  }

  useEffect(() => {
    if (debouncedValue.length > 0) {
      fetch(`https://nominatim.openstreetmap.org/search?q=${debouncedValue}&format=jsonv2`)
        .then(res => res.json())
        .then(dataJson => {
          setDisplayNames(dataJson)
        })
        .catch(() => console.log("ERRORRORORO"))
        .finally(() => {
          console.log("SETTING TO FALSE")
          setIsLoading(false)
        })
    }
  }, [debouncedValue])

  useEffect(() => {
    if (location.length > 0) {
      setIsLoading(true)
    } else {
      setDisplayNames(undefined)
      setIsLoading(false)
    }
  }, [location])

  console.log({ data, isLoading })

  return (
    <div className="app">
      <div className={`search-wrapper${isOpen ? ' search-wrapper-open' : ''}`}>
        <div className="search-content">
          <div className="input-wrapper">
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Search for an address" />
            <img
              onClick={reverseLookUp}
              alt="location icon"
              className="input-icon"
              src={Icon}
            />
          </div>

          {isLoading && (
            <CircleLoader
              size={80}
              css={{
                display: "block",
                margin: "auto",
                marginTop: "100px",
              }}
            />
          )}

          {displayNames && !isLoading && (
            <ol className="addresses">
              {displayNames.map(({ display_name, lat, lon }) => (
                <li className="address" onClick={() => setCenter([parseFloat(lat), parseFloat(lon)])}>{display_name}</li>
              ))}
            </ol>
          )}

          {displayNames && displayNames.length === 0 && !isLoading && (
            <div className="no-address">No address found</div>
          )}
        </div>
      </div>
      <div className="map-wrapper">
        <Map
          height="100%"
          provider={osm}
          center={center}
          zoom={zoom}
          metaWheelZoom={true}
        >
          <img
            src={ExpandIcon}
            alt="expand icon"
            className="expand-icon"
            onClick={() => setIsOpen(!isOpen)}
          />
          {center && (
            <div className="position">
              Latitude: {center[0]}&nbsp;&nbsp;|&nbsp;&nbsp;Longitude: {center[1]}
            </div>
          )}
          {weather && (
            <div className="temperature">
              {Math.round(weather.main.temp - 273.15)} °C
            </div>
          )}
          <ZoomControl style={{ bottom: 30, top: "unset", right: 10, left: "unset" }} buttonStyle={{ width: 50, height: 50, minWidth: "unset" }} />
          <Marker width={50} anchor={center}/>
        </Map>
      </div>
    </div>
  );
}


