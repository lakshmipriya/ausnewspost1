// /blocks/weather/weather.js

export default async function decorate(block) {
  // 1. Get the location from the block content (e.g., text "London")
  const location = block.textContent.trim();
  block.textContent = ''; // Clear the block

  // 2. Fetch weather data (Example using a placeholder API)
  const API_KEY = '3237161ae1634c9a8e051934260902';
  const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}`);
  const data = await response.json();

  // 3. Create HTML structure
  const weatherHTML = `
    <div class="weather-card">
      <h3>${data.location.name}</h3>
      <img src="${data.current.condition.icon}" alt="${data.current.condition.text}" />
      <p class="temp">${data.current.temp_c}°C</p>
      <p class="condition">${data.current.condition.text}</p>
    </div>
  `;
  
  block.innerHTML = weatherHTML;
}
