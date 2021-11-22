import { useEffect, useState } from 'react'
import { Map as PigeonMap, ZoomControl, Overlay } from 'pigeon-maps'
import { useDebounce } from 'use-debounce'

// Components
import { Loader, Outline } from 'components'

// Assets
import { Streets, Light, Dark, Satellite, Marker } from 'assets/images'
import { Expand, Target, AnalyzerIcon, MapIcon, OutlineIcon } from 'assets/icons'

// Common
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, MAP_ZOOM } from 'common/constants'

let classifier;

export const Map = ({ setInverted }) => {
  const [searchValue, setSearchValue] = useState('')
  const [debouncedSearchValue] = useDebounce(searchValue, 400);

  const [searchResults, setSearchResults] = useState([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const [weatherData, setWeatherData] = useState()

  const [markerPosition, setMarkerPosition] = useState()
  const [mapLayer, setMapLayer] = useState(['satellite', 'png'])

  const [currentMapCenter, setCurrentMapCenter] = useState(DEFAULT_MAP_CENTER)
  const [currentMapZoom, setCurrentMapZoom] = useState(DEFAULT_MAP_ZOOM)

  const [mapCenter, setMapCenter] = useState(currentMapCenter)
  const [mapZoom, setMapZoom] = useState(currentMapZoom)

  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false)
  const [isOutlineClicked, setIsOutlineClicked] = useState(false)

  const [image, setImage] = useState("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/31.938068109374967,52.91159012527551,7,0/300x300@2x?access_token=pk.eyJ1Ijoicm9rYXMxOTIiLCJhIjoiY2t3NmZoMHhkMHBzeTJubnY1dXF3ZDJiOSJ9.vDVsipOXPQAjbOnzzTg5bg")

  useEffect(() => {
    if (isAnalyzerOpen && image) {
      classifier = window.ml5.imageClassifier("https://teachablemachine.withgoogle.com/models/1KhaE1azi/model.json", () => {
        classifier.classify(document.getElementById('test'), (error, results) => {
          if (error) {
            console.error(error);
            return;
          }
          
          console.log(results[0].label)
        });
      });
    }
  }, [image])

  const [pos, setPos] = useState([])

  useEffect(() => {
    setInverted(mapLayer[0] === 'dark')
  }, [mapLayer, setInverted])

  const handleGetCurrentLocation = () => {
    const handleError = () => {
      alert('Please allow the location')

      setIsLoading(false)
    }

    setIsLoading(true)

    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      setMarkerPosition([latitude, longitude])
      setCurrentMapCenter([latitude, longitude])
      setCurrentMapZoom(MAP_ZOOM)

      setIsLoading(false)
    }, handleError);
  }

  const onTileClick = (latLng) => {
    fetch(`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${latLng[1]},${latLng[0]},${mapZoom - 1},0/200x200@2x?access_token=pk.eyJ1Ijoicm9rYXMxOTIiLCJhIjoiY2t3NmZoMHhkMHBzeTJubnY1dXF3ZDJiOSJ9.vDVsipOXPQAjbOnzzTg5bg`)
      .then((res) => setImage(res.url))
      // .then((data) => console.log(data))
  }

  useEffect(() => {
    if (markerPosition) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${markerPosition[0]}&lon=${markerPosition[1]}&appid=06d73ad44324084601b8cbbe52ab44b2`)
        .then(res => res.json())
        .then(data => setWeatherData(data))
        .catch((err) => console.error(err))
    }
  }, [markerPosition])

  function mapTiler (x, y, z) {
    // LocationIQ's free plan does not provide the satellite view
    if (mapLayer[0] === 'satellite') {
      if (isAnalyzerOpen) {
        return `https://api.maptiler.com/tiles/satellite/${z}/${x}/${y}.jpg?key=WiyE10ejQrGObwvuZiuv`
      }

      return `https://api.maptiler.com/maps/hybrid/${z}/${x}/${y}.jpg?key=WiyE10ejQrGObwvuZiuv`



      // dont use
      // https://api.maptiler.com/maps/streets/static/59,52,5/400x400.png?key=WiyE10ejQrGObwvuZiuv

      // 'https://maps.locationiq.com/v3/staticmap?key=pk.3b4a15ec85f3ef7ee440bfac775ab389&center=52,55&zoom=<zoom>&size=300x300&format=png&maptype=streets'
    }

    return `https://a-tiles.locationiq.com/v3/${mapLayer[0]}/r/${z}/${x}/${y}.${mapLayer[1]}?key=pk.3b4a15ec85f3ef7ee440bfac775ab389`
  }

  useEffect(() => {
    if (debouncedSearchValue.length > 0) {
      fetch(`https://eu1.locationiq.com/v1/search.php?key=pk.3b4a15ec85f3ef7ee440bfac775ab389&q=${debouncedSearchValue}&format=json`)
        .then(res => res.json())
        .then(data => setSearchResults(data))
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false))
    }
  }, [debouncedSearchValue])

  // Handle the loading state when user types in the search
  useEffect(() => {
    if (searchValue.length > 0) {
      setIsLoading(true)
    } else {
      // Reset search results on empty search input
      setSearchResults([])
      setIsLoading(false)
    }
  }, [searchValue])

  return (
    <main className='map' onMouseMove={(event) => setPos([event.clientX, event.clientY])}>
      {isAnalyzerOpen && (
        <img id='test' crossOrigin='anonymous' src={image} className='image-tile'/>
      )}
      {/* <div
        style={{
          width: '200px',
          height: '200px',
          position: 'absolute',
          top: pos[1] - 100,
          left: pos[0] - 100,
          backgroundColor: 'red',
          // border: '3px solid white',
          // borderRadius: '20px',
          zIndex: 9,
        }}
      /> */}
      <Outline
        isShown={isOutlineClicked && isAnalyzerOpen}
        position={pos}
      />
      <div className={`search-sidebar${isSearchOpen ? ' search-sidebar--opened' : ''}`}>
        {!isAnalyzerOpen && (
          <img
            src={Expand}
            alt='expand icon'
            className='expand-icon'
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          />
        )}
        <div className='search-content__wrapper'>
          <div className='search-content'>
            <div className='input-wrapper'>
              <img
                onClick={handleGetCurrentLocation}
                alt='location icon'
                className='input-icon'
                src={Target}
              />
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder='Search for an address'
              />
            </div>

            <Loader
              isLoading={isLoading}
            />

            {searchResults.length > 0 && !isLoading && (
              <div className='search-results'>
                {searchResults.map(({ display_name, lat, lon }) => (
                  <div className='search-result' onClick={() => {
                    setMarkerPosition([lat, lon])
                    setCurrentMapCenter([lat, lon])
                    setCurrentMapZoom(MAP_ZOOM)
                  }}>{display_name}</div>
                ))}
              </div>
            )}

            {searchResults.error && !isLoading && (
              <div className='empty-search'>No address found</div>
            )}
          </div>
        </div>
      </div>
      <div className='map-wrapper'>
        <PigeonMap
          provider={mapTiler}
          attribution={mapLayer[0] === 'satellite' ?
            <span>
              © <a href='https://www.maptiler.com/copyright/'>MapTiler</a>{' '}|{' '}
              © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer noopener">OpenStreetMap</a> contributors
            </span> :
            <span>
              © <a href='https://locationiq.com/'>LocationIQ</a>{' '}|{' '}
              © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer noopener">OpenStreetMap</a> contributors
            </span>
          }
          onClick={({ latLng, ...props }) => {
            onTileClick(latLng)
            // console.log(latLng, props)
            setMarkerPosition(latLng)
            setCurrentMapCenter(mapCenter)
            setCurrentMapZoom(mapZoom)
          }}
          onBoundsChanged={({ center, zoom }) => { 
            setMapCenter(center)
            setMapZoom(zoom)
          }} 
          center={currentMapCenter}
          zoom={currentMapZoom}
          metaWheelZoom={true}
        >
          {markerPosition && (
            <Overlay anchor={[parseFloat(markerPosition[0]), parseFloat(markerPosition[1])]} offset={[17, 52]}>
              <img
                alt='marker'
                src={Marker}
                height={50}
              />
            </Overlay>
          )}
          <ZoomControl style={{ top: 'unset', right: 10, left: 'unset' }} buttonStyle={{ width: 50, height: 50, minWidth: 'unset' }} />
        </PigeonMap>
        {markerPosition && !isSearchOpen && !isAnalyzerOpen && (
          <div className='position'>
            <pre><strong>Lat:</strong> {parseFloat(markerPosition[0]).toFixed(5)}  |  <strong>Lon:</strong> {parseFloat(markerPosition[1]).toFixed(5)}</pre>
          </div>
        )}
        {weatherData && !isAnalyzerOpen && (
          <div className='temperature'>
            {/* Convert to celcius from kelvin */}
            {Math.round(weatherData.main.temp - 273.15)} &#8451;
          </div>
        )}
        <img
          src={isAnalyzerOpen ? MapIcon : AnalyzerIcon}
          alt='analyzer icon'
          className='analyzer-icon'
          onClick={() => setIsAnalyzerOpen(!isAnalyzerOpen)}
        />
        {isAnalyzerOpen && (
          <img
            src={OutlineIcon}
            alt='outline icon'
            className='outline-icon'
            onClick={() => setIsOutlineClicked(!isOutlineClicked)}
          />
        )}
      </div>
    </main>
  );
}


