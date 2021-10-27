import { useEffect, useState } from 'react'
import { Map, Marker, ZoomControl, Overlay } from 'pigeon-maps'
import { osm } from 'pigeon-maps/providers'
import { useDebounce } from 'use-debounce'

import CircleLoader from "react-spinners/CircleLoader";

import Icon from './target.svg'
import ExpandIcon from './expand-icon.svg'
import Markerr from './marker.png'

import Location from './location2.png'

import Streets from './images/streets.png'
import Light from './images/light.png'
import Dark from './images/dark.png'
import Satellite from './images/satellite.png'

export const App = ({ setInverted }) => {
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [isOpen, setIsOpen] = useState(false)

  const [data, setData] = useState()
  const [weather, setWeather] = useState()

  const [center, setCenter] = useState([40.758091, -74.000267])
  const [anchor, setAnchor] = useState(center)
  const [zoom, setZoom] = useState(5)

  const [test, setTest] = useState(zoom)
  const [test2, setTest2] = useState(center)


  const [displayNames, setDisplayNames] = useState([])

  const [layout, setLayout] = useState(['streets', 'png'])

  const [debouncedValue] = useDebounce(location, 400);

  useEffect(() => {
    setInverted(layout[0] === 'dark')
  }, [layout, setInverted])

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
      setZoom(17)
      setAnchor([parseFloat(latitude), parseFloat(longitude)])
      setCenter([parseFloat(latitude), parseFloat(longitude)])
      setIsLoading(false)
      // fetch(`https://eu1.locationiq.com/v1/reverse.php?key=pk.3b4a15ec85f3ef7ee440bfac775ab389&lat=${latitude}&lon=${longitude}&format=json`)
      // // fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
      //   .then(res => res.json())
      //   .then(dataJson => {
      //     console.log(dataJson)
      //     setZoom(17)
      //     setData(dataJson)
      //     setCenter([parseFloat(dataJson.lat), parseFloat(dataJson.lon)])
      //     setAnchor([parseFloat(dataJson.lat), parseFloat(dataJson.lon)])
      //   })
      //   .finally(() => {
      //     console.log("SETTING TO FALSE")
      //     setIsLoading(false)
      //   })
    });
  }

  useEffect(() => {
    if (anchor) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${anchor[0]}&lon=${anchor[1]}&appid=06d73ad44324084601b8cbbe52ab44b2`)
        .then(res => res.json())
        .then(dataJson => setWeather(dataJson))
    }
  }, [anchor])

  function mapTiler (x, y, z, dpr) {
    if (layout[0] === 'satellite') {
      return `https://api.maptiler.com/tiles/satellite/${z}/${x}/${y}.jpg?key=WiyE10ejQrGObwvuZiuv`
    }
    return `https://a-tiles.locationiq.com/v3/${layout[0]}/r/${z}/${x}/${y}.${layout[1]}?key=pk.3b4a15ec85f3ef7ee440bfac775ab389`
    
    // return `https://maptiles.p.rapidapi.com/en/map/v1/${z}/${x}/${y}.png?rapidapi-key=5e03c7f7cemsh40721afc8a3ddc5p1e7af4jsnd63ea410a5c0`
  }

  useEffect(() => {
    if (debouncedValue.length > 0) {
      fetch(`https://eu1.locationiq.com/v1/search.php?key=pk.3b4a15ec85f3ef7ee440bfac775ab389&q=${debouncedValue}&format=json`)
      // fetch(`https://nominatim.openstreetmap.org/search?q=${debouncedValue}&format=jsonv2`)
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
      setDisplayNames([])
      setIsLoading(false)
    }
  }, [location])

  console.log(...center)

  return (
    <div className="app">
      <div className={`search-wrapper${isOpen ? ' search-wrapper-open' : ''}`}>
        <img
          src={ExpandIcon}
          alt="expand icon"
          className="expand-icon"
          onClick={() => setIsOpen(!isOpen)}
        />
        <div className="test">
          <div className="search-content">
            <div className="input-wrapper">
              <img
                onClick={reverseLookUp}
                alt="location icon"
                className="input-icon"
                src={Icon}
              />
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Search for an address" />
            </div>

            {isLoading && (
              <CircleLoader
                color="white"
                size={80}
                css={{
                  display: "block",
                  margin: "auto",
                  marginTop: "100px",
                }}
              />
            )}

            {displayNames.length > 0 && !isLoading && (
              <div className="addresses">
                {displayNames.map(({ display_name, lat, lon }) => (
                  <div className="address" onClick={() => {
                    setZoom(17)
                    setCenter([parseFloat(lat), parseFloat(lon)])
                    setAnchor([parseFloat(lat), parseFloat(lon)])
                  }}>{display_name}</div>
                ))}
              </div>
            )}

            {displayNames.error && !isLoading && (
              <div className="no-address">No address found</div>
            )}
          </div>
        </div>
      </div>
      <div className="map-wrapper">
        <Map
          height="100%"
          provider={mapTiler}
          // attribution={false}
          onClick={({ latLng }) => {
            console.log(latLng)
            setAnchor(latLng)
            setCenter(test2)
            setZoom(test)
          }}
          onBoundsChanged={({ center, zoom }) => { 
            setTest(zoom)
            setTest2(center)
          }} 
          center={center}
          zoomSnap={false}
          animate={true}
          zoom={zoom}
          metaWheelZoom={true}
        >
          {anchor && !isOpen && (
            <div className="position">
              <strong>Lat:</strong>&nbsp;{parseFloat(anchor[0]).toFixed(5)}&nbsp;&nbsp;|&nbsp;&nbsp;<strong>Lon:</strong>&nbsp;{parseFloat(anchor[1]).toFixed(5)}
            </div>
          )}
          {weather && (
            <strong className="temperature">
              {Math.round(weather.main.temp - 273.15)} °C
            </strong>
          )}
          <Overlay anchor={anchor} offset={[17, 52]}>
            <img src={Location} height={50} alt='' />
          </Overlay>
          <ZoomControl style={{ top: "unset", right: 10, left: "unset" }} buttonStyle={{ width: 50, height: 50, minWidth: "unset" }} />
          {/* <Marker width={50} anchor={anchor}/> */}
        </Map>
        {/* {!isOpen && ( */}
          <>
            <div className={`layout${!isOpen ? ' layout--opened': ''}`}>
              <div>
                <img
                  onClick={() => setLayout(['streets', 'png'])}
                  src={Streets}
                />
                <span>Streets</span>
              </div>
              <div>
                <img
                  onClick={() => setLayout(['light', 'png'])}
                  src={Light}
                />
                <span>Light</span>
              </div>
              <div>
                <img
                  onClick={() => setLayout(['dark', 'png'])}
                  src={Dark}
                />
                <span>Dark</span>
              </div>
              <div>
                <img
                  onClick={() => setLayout(['satellite', 'png'])}
                  src={Satellite}
                />
                <span>Satellite</span>
              </div>
            </div>
            <div className={`layout-background${!isOpen ? ' layout-background--opened': ''}`} />
          </>
        {/* )} */}
      </div>
    </div>
  );
}


