import { useEffect, useState } from 'react'
import { Map, Marker, ZoomControl, Overlay } from 'pigeon-maps'
import { osm } from 'pigeon-maps/providers'
import { useDebounce } from 'use-debounce'

export const App = () => {
  const [location, setLocation] = useState("")

  const [data, setData] = useState()
  const [weather, setWeather] = useState()

  const [center, setCenter] = useState([40.758091, -74.000267])
  const [anchor, setAnchor] = useState(center)
  const [zoom, setZoom] = useState(15)

  const [displayNames, setDisplayNames] = useState([])

  const [debouncedValue] = useDebounce(location, 1000);

  const sendLocation = (location) => {
    if (location.length > 0) {
      fetch(`https://nominatim.openstreetmap.org/search?q=${location}&format=json`)
        .then(res => res.json())
        .then(dataJson => {
          console.log(dataJson)
          setZoom(15)
          setData(dataJson)
          setCenter([parseFloat(dataJson[0].lat), parseFloat(dataJson[0].lon)])
          setAnchor([parseFloat(dataJson[0].lat), parseFloat(dataJson[0].lon)])
        })
    }
  }

  useEffect(() => {
    if (data && data.length > 0) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid=06d73ad44324084601b8cbbe52ab44b2`)
        .then(res => res.json())
        .then(dataJson => setWeather(dataJson))
    }
  }, [data])

  function mapTiler (x, y, z, dpr) {
    return `https://maptiles.p.rapidapi.com/en/map/v1/${z}/${x}/${y}.png?rapidapi-key=5e03c7f7cemsh40721afc8a3ddc5p1e7af4jsnd63ea410a5c0`
  }

  useEffect(() => {
    if (debouncedValue.length > 0) {
      fetch(`https://nominatim.openstreetmap.org/search?q=${debouncedValue}&format=json`)
        .then(res => res.json())
        .then(dataJson => {
          setDisplayNames(dataJson)
        })
    }
  }, [debouncedValue])

  return (
    <div>
      <div>
        <input value={location} onChange={(e) => setLocation(e.target.value)} />
        {/* <button onClick={() => sendLocation()}>Get info</button> */}

        {data && data.length > 0 && (
          <div>{data[0].lat} {data[0].lon}</div>
        )}
        <br/>
        {weather && (
          <div>{weather.main.temp - 273.15}</div>
        )}
      </div>
      {displayNames.map(({ display_name }) => (
        <div style={{ cursor: "pointer" }} onClick={() => sendLocation(display_name)}>{display_name}</div>
      ))}
      <div className="map">
        <Map
          height={800}
          provider={osm}
          center={center}
          zoom={zoom}
          // zoomSnap={false}
          onBoundsChanged={({ center, zoom }) => {
            // setZoom(zoom)
            // setCenter(center)
          }}
        >
           {/* <Overlay anchor={anchor} latLngToPixel={(...props) => console.log(props)}>
            {/* <img src='https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg' width={240} height={158} alt='' /> */}
            {/* <div>
              <svg width={zoom === 18 ? 100 : 50} height={zoom === 18 ? 100 : 50}>
                <circle cx="20" cy="20" r={zoom * 16} stroke="green" stroke-width="4" fill="yellow" />
              </svg>
            </div> */}
          {/* </Overlay> */}
          <ZoomControl />
          <Marker width={50} anchor={anchor}/>
        </Map>
      </div>
    </div>
  );
}
