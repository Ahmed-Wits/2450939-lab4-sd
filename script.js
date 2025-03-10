// Get DOM elements
const countryInput = document.getElementById("country-input");
const searchButton = document.getElementById("search-button");
const countryInfoSection = document.getElementById("country-info");
const borderingCountriesSection = document.getElementById("bordering-countries");

const capitalElement = document.getElementById("capital");
const populationElement = document.getElementById("population");
const regionElement = document.getElementById("region");
const flagElement = document.getElementById("flag");

// API URL for fetching country data
const API_URL = "https://restcountries.com/v3.1/name/";

// Event listener for the search button
searchButton.addEventListener("click", () => {
    const countryName = countryInput.value.trim(); // Remove extra spaces

    // Check if the input is empty or contains only spaces
    if (!countryName) {
        alert("Please enter a valid country name.");
        return;
    }

    // Ensure no accidental searches for unintended values
    if (countryName.length < 2) {
        alert("Country name must have at least 2 characters.");
        return;
    }

    fetchCountryData(countryName);
});

// Fetch country data from the API
async function fetchCountryData(country) {
    try {
        // Fetch data from the API, enforce exact match with fullText=true
        const response = await fetch(`${API_URL}${country}?fullText=true`);
        
        // Check if the response is OK, otherwise throw an error
        if (!response.ok) {
            throw new Error("Country not found. Please enter a valid country name.");
        }

        const data = await response.json();
        const countryData = data[0]; // Get the first result from the API response

        // Update the DOM with country information
        capitalElement.textContent = countryData.capital[0] || "N/A";
        populationElement.textContent = countryData.population.toLocaleString();
        regionElement.textContent = countryData.region;

        // Set the country's flag
        flagElement.src = countryData.flags.png;
        flagElement.alt = `${countryData.name.common} Flag`;

        // Fetch and display neighbouring countries' information
        displayBorderingCountries(countryData.borders || []);
    } catch (error) {
        alert(error.message);
        clearResults(); // Clear previous results if there was an error
    }
}

// Function to display bordering countries
function displayBorderingCountries(borders) {
    // Clear previous bordering countries' results
    borderingCountriesSection.innerHTML = "";

    if (borders.length === 0) {
        borderingCountriesSection.innerHTML = "<p>No bordering countries.</p>";
        return;
    }

    borders.forEach(async (border) => {
        try {
            const response = await fetch(`${API_URL}${border}?fullText=true`);
            const data = await response.json();
            const borderCountry = data[0]; // Get the first result for the border country

            const borderElement = document.createElement("div");
            borderElement.classList.add("border-country");

            const flagElement = document.createElement("img");
            flagElement.src = borderCountry.flags.png;
            flagElement.alt = `${borderCountry.name.common} Flag`;

            const nameElement = document.createElement("p");
            nameElement.textContent = borderCountry.name.common;

            borderElement.appendChild(flagElement);
            borderElement.appendChild(nameElement);
            borderingCountriesSection.appendChild(borderElement);
        } catch (error) {
            console.error("Error fetching bordering country data:", error);
        }
    });
}

// Function to clear previous results
function clearResults() {
    capitalElement.textContent = "";
    populationElement.textContent = "";
    regionElement.textContent = "";
    flagElement.src = "";
    borderingCountriesSection.innerHTML = "";
}
