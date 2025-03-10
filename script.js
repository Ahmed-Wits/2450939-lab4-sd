// Wait until the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Select button and input field
    const searchButton = document.getElementById("search-button");

    // Add event listener for button click
    searchButton.addEventListener("click", () => {
        const countryName = document.getElementById("country-input").value.trim();

        // If input is empty, alert user
        if (countryName === "") {
            alert("Please enter a country name.");
            return;
        }

        // Fetch country data from the REST Countries API
        fetch(`https://restcountries.com/v3.1/name/${countryName}`)
            .then(response => {
                // If response is not okay, throw an error
                if (!response.ok) {
                    throw new Error("Country not found");
                }
                return response.json(); // Convert response to JSON
            })
            .then(data => {
                const country = data[0]; // Access first country from response
                const countryInfo = document.getElementById("country-info");
                const bordersSection = document.getElementById("bordering-countries");

                // Display country details
                countryInfo.innerHTML = `
                    <h2>${country.name.common}</h2>
                    <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
                    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                    <p><strong>Region:</strong> ${country.region}</p>
                    <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="150">
                `;

                // Check if country has neighboring countries
                if (country.borders && country.borders.length > 0) {
                    bordersSection.innerHTML = "<h3>Bordering Countries:</h3>";

                    // Loop through each border country
                    country.borders.forEach(border => {
                        fetch(`https://restcountries.com/v3.1/alpha/${border}`)
                            .then(response => response.json())
                            .then(borderData => {
                                const borderCountry = borderData[0];
                                const borderDiv = document.createElement("div");
                                borderDiv.innerHTML = `
                                    <p>${borderCountry.name.common}</p>
                                    <img src="${borderCountry.flags.png}" width="100">
                                `;
                                bordersSection.appendChild(borderDiv);
                            })
                            .catch(error => console.error("Error fetching border country:", error));
                    });
                } else {
                    bordersSection.innerHTML = "<p>No bordering countries.</p>";
                }
            })
            .catch(error => {
                // Handle errors
                document.getElementById("country-info").innerHTML = `<p>Error: ${error.message}</p>`;
            });
    });
});
