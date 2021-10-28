import { useEffect, useState } from 'react'
import { Map as PigeonMap, ZoomControl, Overlay } from 'pigeon-maps'
import { useDebounce } from 'use-debounce'

// Components
import { Loader } from 'components'

// Assets
import { Streets, Light, Dark, Satellite, Marker } from 'assets/images'
import { Expand, Target } from 'assets/icons'

// Common
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, MAP_ZOOM } from 'common/constants'

export const Map = ({ setInverted }) => {
  const [searchValue, setSearchValue] = useState('')
  const [debouncedSearchValue] = useDebounce(searchValue, 400);

  const [searchResults, setSearchResults] = useState([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const [weatherData, setWeatherData] = useState()

  const [markerPosition, setMarkerPosition] = useState()
  const [mapLayer, setMapLayer] = useState(['streets', 'png'])

  const [currentMapCenter, setCurrentMapCenter] = useState(DEFAULT_MAP_CENTER)
  const [currentMapZoom, setCurrentMapZoom] = useState(DEFAULT_MAP_ZOOM)

  const [mapCenter, setMapCenter] = useState(currentMapCenter)
  const [mapZoom, setMapZoom] = useState(currentMapZoom)

  useEffect(() => {
    setInverted(mapLayer[0] === 'dark')
  }, [mapLayer, setInverted])

  console.log({ mapLayer })

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
      return `https://api.maptiler.com/tiles/satellite/${z}/${x}/${y}.jpg?key=WiyE10ejQrGObwvuZiuv`
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
    <main className='map'>
      <div className={`search-sidebar${isSearchOpen ? ' search-sidebar--opened' : ''}`}>
        <img
          src={Expand}
          alt='expand icon'
          className='expand-icon'
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        />
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
          onClick={({ latLng }) => {
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
        {markerPosition && !isSearchOpen && (
          <div className='position'>
            <pre><strong>Lat:</strong> {parseFloat(markerPosition[0]).toFixed(5)}  |  <strong>Lon:</strong> {parseFloat(markerPosition[1]).toFixed(5)}</pre>
          </div>
        )}
        {weatherData && (
          <div className='temperature'>
            {/* Convert to celcius from kelvin */}
            {Math.round(weatherData.main.temp - 273.15)} &#8451;
          </div>
        )}
        <div className={`map-layers${!isSearchOpen ? ' map-layers--opened' : ''}`}>
          <div>
            <img
              alt='streets layer'
              onClick={() => setMapLayer(['streets', 'png'])}
              src={Streets}
            />
            <span>Streets</span>
          </div>
          <div>
            <img
              alt='light layer'
              onClick={() => setMapLayer(['light', 'png'])}
              src={Light}
            />
            <span>Light</span>
          </div>
          <div>
            <img
              alt='dark layer'
              onClick={() => setMapLayer(['dark', 'png'])}
              src={Dark}
            />
            <span>Dark</span>
          </div>
          <div>
            <img
              alt='satellite layer'
              onClick={() => setMapLayer(['satellite', 'png'])}
              src={Satellite}
            />
            <span>Satellite</span>
          </div>
        </div>
        <div className={`map-layers-background${!isSearchOpen ? ' map-layers-background--opened' : ''}`}/>
      </div>
    </main>
  );
}


