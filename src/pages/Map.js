/* eslint-disable react-hooks/exhaustive-deps */
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

// import * as tf from '@tensorflow/tfjs';
// import * as tmImage from '@teachablemachine/image';
// import ml5 from 'ml5'

let classifier;

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

  const [image, setImage] = useState("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/31.938068109374967,52.91159012527551,7,0/300x300@2x?access_token=pk.eyJ1Ijoicm9rYXMxOTIiLCJhIjoiY2t3NmZoMHhkMHBzeTJubnY1dXF3ZDJiOSJ9.vDVsipOXPQAjbOnzzTg5bg")

  const [model, setModel] = useState()

  // useEffect(async () => {
  //   var img2 = document.createElement('img'); // Use DOM HTMLImageElement
  //   // img2.src = "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/31.938068109374967,52.91159012527551,7,0/300x300@2x?access_token=pk.eyJ1Ijoicm9rYXMxOTIiLCJhIjoiY2t3NmZoMHhkMHBzeTJubnY1dXF3ZDJiOSJ9.vDVsipOXPQAjbOnzzTg5bg";
  //   //img2.src= 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/3.093120294433561,55.93323768270082,4,0/300x300@2x?access_token=pk.eyJ1Ijoicm9rYXMxOTIiLCJhIjoiY2t3NmZoMHhkMHBzeTJubnY1dXF3ZDJiOSJ9.vDVsipOXPQAjbOnzzTg5bg';
  //   img2.src = image;
  //   img2.crossOrigin = "anonymous";
  //   img2.alt = 'alt text';


  //   let imageModelURL = 'https://teachablemachine.withgoogle.com/models/1KhaE1azi/';
  //   let classifier
  //   classifier = await ml5.imageClassifier(imageModelURL + 'model.json', () => classifier.classify(img2));
  //   // console.log(img2)
  //   // classifier.classify(img2);
  // }, [])

  const [start, setStart] = useState(false)

  // useEffect(() => {
    
  //   // console.log(new ImageData("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png"))
  //   // setInterval(() => {
  //   //   if (classifier && start) {
  //   //     console.log('he2y')
  //   //     // var img2 = document.createElement('img'); // Use DOM HTMLImageElement
  //   //     // // img2.src = "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/31.938068109374967,52.91159012527551,7,0/300x300@2x?access_token=pk.eyJ1Ijoicm9rYXMxOTIiLCJhIjoiY2t3NmZoMHhkMHBzeTJubnY1dXF3ZDJiOSJ9.vDVsipOXPQAjbOnzzTg5bg";
  //   //     // //img2.src= 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/3.093120294433561,55.93323768270082,4,0/300x300@2x?access_token=pk.eyJ1Ijoicm9rYXMxOTIiLCJhIjoiY2t3NmZoMHhkMHBzeTJubnY1dXF3ZDJiOSJ9.vDVsipOXPQAjbOnzzTg5bg';
  //   //     // img2.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png";
  //   //     // img2.alt = 'alt text';

  //   //     // console.log(img2)

  //   //     classifier.classify(document.getElementById('test'), (error, results) => {
  //   //       if (error) {
  //   //         console.error(error);
  //   //         return;
  //   //       }
          
  //   //       console.log(results)
  //   //     });
  //   //   }
  //   // }, 5000);
  // }, [image]);

  // const predict = () => {
  //   classifier = ml5.imageClassifier("https://teachablemachine.withgoogle.com/models/1KhaE1azi/model.json", () => {
  //     setStart(true)
  //     classifier.classify(document.getElementById('test'), (error, results) => {
  //       if (error) {
  //         console.error(error);
  //         return;
  //       }
        
  //       console.log(results[0].label)
  //     });
  //   });
  // }


  // console.log(model)

  // useEffect(async () => {
  //   // console.log({ image })
  //   if (image !== '') {

  //     // More API functions here:
  //     // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

  //     // the link to your model provided by Teachable Machine export panel
  //     const URL = "https://teachablemachine.withgoogle.com/models/1KhaE1azi/";

  //     let model, webcam, labelContainer, maxPredictions;

  //     // Load the image model and setup the webcam
  //     const modelURL = URL + "model.json";
  //     const metadataURL = URL + "metadata.json";

  //     // load the model and metadata
  //     // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  //     // or files from your local hard drive
  //     // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  //     model = await tmImage.load(modelURL, metadataURL)
  //     // maxPredictions = model.getTotalClasses();

  //     // console.log(model.getClassLabels())

  //     // // Convenience function to setup a webcam
  //     // const flip = true; // whether to flip the webcam
  //     // webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
  //     // await webcam.setup(); // request access to the webcam
  //     // await webcam.play();
  //     // window.requestAnimationFrame(loop);

  //     // // append elements to the DOM
  //     // document.getElementById("webcam-container").appendChild(webcam.canvas);
  //     // labelContainer = document.getElementById("label-container");
  //     // for (let i = 0; i < maxPredictions; i++) { // and class labels
  //     //     labelContainer.appendChild(document.createElement("div"));
  //     // }

      

  //     // for (let i = 0; i < maxPredictions; i++) {
  //     //     const classPrediction =
  //     //         prediction[i].className + ": " + prediction[i].probability.toFixed(2);
  //     //     labelContainer.childNodes[i].innerHTML = classPrediction;
  //     // }

  //     console.log(model.getClassLabels())
  //     console.log({ image })
  //     var img2 = document.createElement('img'); // Use DOM HTMLImageElement
  //     img2.src = image;
  //     img2.crossOrigin = "anonymous";
  //     img2.alt = 'alt text';
  
  //     console.log(model)
  //     const prediction = await model.predict(img2);
  //     console.log(prediction)
  //   }
  // }, [image])

  // run the webcam image through the image model
  // const predict = async (image_src) => {
  //   const URL = "https://teachablemachine.withgoogle.com/models/1KhaE1azi/";
  //   const modelURL = URL + "model.json";
  //   const metadataURL = URL + "metadata.json";
  //   const model = await tmImage.load(modelURL, metadataURL)

  //   console.log(tmImage)
  //   // predict can take in an image, video or canvas html element
  //   var img2 = document.createElement('img'); // Use DOM HTMLImageElement
  //   // img2.src = "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/31.938068109374967,52.91159012527551,7,0/300x300@2x?access_token=pk.eyJ1Ijoicm9rYXMxOTIiLCJhIjoiY2t3NmZoMHhkMHBzeTJubnY1dXF3ZDJiOSJ9.vDVsipOXPQAjbOnzzTg5bg";
  //   //img2.src= 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/3.093120294433561,55.93323768270082,4,0/300x300@2x?access_token=pk.eyJ1Ijoicm9rYXMxOTIiLCJhIjoiY2t3NmZoMHhkMHBzeTJubnY1dXF3ZDJiOSJ9.vDVsipOXPQAjbOnzzTg5bg';
  //   img2.src = image_src;
  //   img2.crossOrigin = "anonymous";
  //   img2.alt = 'alt text';
  //   model.predict(img2).then(res => console.log({ res }))
  //   const prediction = await model.predict(img2);
  //   console.log(prediction)
  //   // for (let i = 0; i < maxPredictions; i++) {
  //   //     const classPrediction =
  //   //         prediction[i].className + ": " + prediction[i].probability.toFixed(2);
  //   //     labelContainer.childNodes[i].innerHTML = classPrediction;
  //   // }
  // }

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
    fetch(`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${latLng[1]},${latLng[0]},${mapZoom - 1},0/300x300@2x?access_token=pk.eyJ1Ijoicm9rYXMxOTIiLCJhIjoiY2t3NmZoMHhkMHBzeTJubnY1dXF3ZDJiOSJ9.vDVsipOXPQAjbOnzzTg5bg`)
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
      return `https://api.maptiler.com/tiles/satellite/${z}/${x}/${y}.jpg?key=WiyE10ejQrGObwvuZiuv`

      // return `https://api.maptiler.com/maps/hybrid/${z}/${x}/${y}@2x.jpg?key=WiyE10ejQrGObwvuZiuv`



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
      <img crossOrigin='anonymous' id="test" className='image-tile' src={image} />
      <button onClick={() => console.log('Predicting 123')}>CLICK</button>
      {/* <div
        style={{
          width: '200px',
          height: '200px',
          position: 'absolute',
          top: pos[1] - 100,
          left: pos[0] - 100,
          border: '3px solid white',
          borderRadius: '20px',
          zIndex: 10,
        }}
      /> */}

      <div
        style={{
          width: '150px',
          height: '3px',
          position: 'absolute',
          top: pos[1] - 150,
          left: pos[0] - 75,
          backgroundColor: 'white',
          // border: '3px solid white',
          // borderRadius: '20px',
          zIndex: 10,
          borderRadius: '10px',
        }}
      />
      <div
        style={{
          width: '150px',
          height: '3px',
          position: 'absolute',
          top: pos[1] + 150,
          left: pos[0] - 75,
          backgroundColor: 'white',
          // border: '3px solid white',
          // borderRadius: '20px',
          zIndex: 10,
        }}
      />
      <div
        style={{
          width: '3px',
          height: '150px',
          position: 'absolute',
          top: pos[1] - 75,
          left: pos[0] - 150,
          backgroundColor: 'white',
          // border: '3px solid white',
          // borderRadius: '20px',
          zIndex: 10,
        }}
      />
      <div
        style={{
          width: '3px',
          height: '150px',
          position: 'absolute',
          top: pos[1] - 75,
          left: pos[0] + 150,
          backgroundColor: 'white',
          // border: '3px solid white',
          // borderRadius: '20px',
          zIndex: 10,
        }}
      />
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


