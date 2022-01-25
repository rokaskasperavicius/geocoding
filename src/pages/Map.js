import { useEffect, useState } from 'react'
import { Map as PigeonMap, ZoomControl, Overlay } from 'pigeon-maps'
import { useDebounce } from 'use-debounce'

// Assets
import { Marker } from 'assets/images'
import {
  AnalyzerIcon,
  ArrowIcon,
  MapIcon,
  OutlineIcon,
  TargetIcon,
} from 'assets/icons'

// Common
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  MAP_ZOOM,
} from 'common/constants'

// Components
import { Loader, Outline } from 'components'

let classifier;

export const Map = () => {
  const [searchValue, setSearchValue] = useState('')
  const [debouncedSearchValue] = useDebounce(searchValue, 400);

  console.log("T111")

  const [searchResults, setSearchResults] = useState([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const [weatherData, setWeatherData] = useState()

  const [markerPosition, setMarkerPosition] = useState()

  const [currentMapCenter, setCurrentMapCenter] = useState(DEFAULT_MAP_CENTER)
  const [currentMapZoom, setCurrentMapZoom] = useState(DEFAULT_MAP_ZOOM)

  const [mapCenter, setMapCenter] = useState(currentMapCenter)
  const [mapZoom, setMapZoom] = useState(currentMapZoom)

  const [isOutlineClicked, setIsOutlineClicked] = useState(false)

  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzerResults, setAnalyzerResults] = useState()

  const [aoiImage, setAoiImage] = useState()

  useEffect(() => {
    // If the image changes - run the area classification
    if (isAnalyzerOpen && aoiImage) {
      setIsAnalyzing(true)

      // Code taken and refactored from Google Teachable Machine
      classifier = window.ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/eCYC_iBuQ6/model.json', () => {
        classifier.classify(document.getElementById('aoi'), (error, results) => {
          if (error) {
            console.error(error)
          }

          setAnalyzerResults(results)
          setIsAnalyzing(false)
        });
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aoiImage])

  const [pos, setPos] = useState([])

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
    if (isAnalyzerOpen && markerPosition) {
      setAoiImage(`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${markerPosition[1]},${markerPosition[0]},${mapZoom - 1},0/200x200@2x?access_token=pk.eyJ1Ijoicm9rYXMxOTIiLCJhIjoiY2t3NmZoMHhkMHBzeTJubnY1dXF3ZDJiOSJ9.vDVsipOXPQAjbOnzzTg5bg`)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerPosition])

  useEffect(() => {
    if (markerPosition) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${markerPosition[0]}&lon=${markerPosition[1]}&appid=06d73ad44324084601b8cbbe52ab44b2`)
        .then(res => res.json())
        .then(data => setWeatherData(data))
        .catch((err) => console.error(err))
    }
  }, [markerPosition])

  function mapTiler (x, y, z) {
    // Use this street view if mapTiler reaches the free plan limit
    // return `https://a-tiles.locationiq.com/v3/streets/r/${z}/${x}/${y}.png?key=pk.3b4a15ec85f3ef7ee440bfac775ab389`

    if (isAnalyzerOpen) {
      return `https://api.maptiler.com/tiles/satellite/${z}/${x}/${y}.jpg?key=WiyE10ejQrGObwvuZiuv`
    }

    return `https://api.maptiler.com/maps/hybrid/${z}/${x}/${y}.jpg?key=WiyE10ejQrGObwvuZiuv`
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
      {isAnalyzerOpen && aoiImage && (
        <img
          id='aoi'
          src={aoiImage}
          alt='aoi'
          crossOrigin='anonymous'
          className='aoi'
        />
      )}
      <Outline
        isShown={isOutlineClicked && isAnalyzerOpen}
        position={pos}
      />
      {!isAnalyzerOpen && (
        <div className={`search-sidebar${isSearchOpen ? ' search-sidebar--opened' : ''}`}>
          <div className='exand-icon__wrapper'>
            <img
              src={ArrowIcon}
              alt='expand icon'
              className='expand-icon'
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            />
          </div>
          <div className='search-content__wrapper'>
            <div className='search-content'>
              <div className='input-wrapper'>
                <img
                  onClick={handleGetCurrentLocation}
                  alt='location icon'
                  className='input-icon'
                  src={TargetIcon}
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
                  {searchResults.map(({ display_name, lat, lon }, index) => (
                    <div
                      key={index}
                      className='search-result'
                      onClick={() => {
                        setMarkerPosition([lat, lon])
                        setCurrentMapCenter([lat, lon])
                        setCurrentMapZoom(MAP_ZOOM)
                      }}
                    >
                      {display_name}
                    </div>
                  ))}
                </div>
              )}
              {searchResults.error && !isLoading && (
                <div className='empty-search'>No address found</div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className='map-wrapper'>
        <PigeonMap
          mouseEvents={!isAnalyzing}
          touchEvents={!isAnalyzing}
          provider={mapTiler}
          attribution={(
            <>
              <a
                title='MapTiler'
                target='_blank'
                rel='noreferrer'
                href='https://www.maptiler.com/copyright/'
              >
                &copy; MapTiler
              </a>
              {' '}
              <a
                title='OpenStreetMap'
                target='_blank'
                rel='noreferrer'
                href='https://www.openstreetmap.org/copyright'
              >
                &copy; OpenStreetMap contributors
              </a>
            </>
          )}
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
        {markerPosition && !isSearchOpen && !isAnalyzerOpen && (
          <div className='position'>
            <pre>Lat: {parseFloat(markerPosition[0]).toFixed(5)}  |  Lon: {parseFloat(markerPosition[1]).toFixed(5)}</pre>
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
        {isAnalyzerOpen && (
          <div className='analyzer-results__wrapper'>
            {!isAnalyzing && (
              <div className='analyzer-results'>
                {aoiImage ? (
                  <>
                    <p>Info</p>
                    {analyzerResults ? (
                      analyzerResults.map(({ label, confidence }) => (
                        <div>
                          <p>Type: {label}</p>
                          <p>Confidence: {confidence.toFixed(3)}</p>
                        </div>
                      ))
                    ) : (
                      <p>Not found</p>
                    )}
                  </>
                ) : (
                  <p>Select AOI</p>
                )}
              </div>
            )}
            <Loader
              isLoading={isAnalyzing}
              size={50}
              css={{
                marginTop: 'unset',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                position: 'absolute',
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}
