import { useEffect, useState } from 'react';

export const App = () => {
  const [location, setLocation] = useState()

  const [data, setData] = useState()

  const [weather, setWeather] = useState()

  const sendLocation = () => {
    fetch(`https://nominatim.openstreetmap.org/search?q=${location}&format=json`)
      .then(res => res.json())
      .then(dataJson => setData(dataJson))
  }

  useEffect(() => {
    if (data && data.length > 0) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid=06d73ad44324084601b8cbbe52ab44b2`)
        .then(res => res.json())
        .then(dataJson => setWeather(dataJson))
    }
  }, [data])



  return (
    <div>
      <input value={location} onChange={(e) => setLocation(e.target.value)} />

      <button onClick={() => sendLocation()}>Get info</button>

      {data && data.length > 0 && (
        <div>{data[0].lat} {data[0].lon}</div>
      )}
      <br/>
      {weather && (
        <div>{weather.main.temp - 273.15}</div>
      )}
    </div>
  );
}
