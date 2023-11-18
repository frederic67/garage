document.querySelector('.search-section form').addEventListener('submit', function(event) {
    console.log("Gestionnaire de soumission appelé");
    event.preventDefault(); // Empêche la soumission normale du formulaire / Prevents normal form submission

    // Récupération des valeurs du formulaire / Retrieving form values
    const brand = document.getElementById('brand').value;
    const price = document.getElementById('price').value;
    const year = document.getElementById('year').value;

    // Construction de l'URL de l'API avec les paramètres / Building the API URL with parameters
    const apiUrl = `/api/vehicles?brand=${brand}&price=${price}&year=${year}`;

    // Faire une requête à l'API / Make an API request
    fetch(apiUrl)
        .then(response => response.json())
        .then(vehicles => {
            // Effacez les anciens résultats / Clear old results
            const vehiclesRow = document.querySelector('.vehicles-section .row.mb-5');
            vehiclesRow.innerHTML = '';

            // Affichez les nouveaux résultats / View new results
            vehicles.forEach(vehicle => {
                const vehicleDiv = document.createElement('div');
                vehicleDiv.className = 'col-md-4';
    
                const image = document.createElement('img');
                image.src = vehicle.image_url;
                image.alt = vehicle.name;
                image.className = 'img-fluid custom-shadow';
    
                const descriptionDiv = document.createElement('div');
                descriptionDiv.className = 'vehicle-description mt-3';
    
                const h4 = document.createElement('h4');
                h4.textContent = vehicle.name;
    
                const p = document.createElement('p');
                p.textContent = vehicle.description;
    
                descriptionDiv.appendChild(h4);
                descriptionDiv.appendChild(p);
    
                vehicleDiv.appendChild(image);
                vehicleDiv.appendChild(descriptionDiv);
    
                vehiclesRow.appendChild(vehicleDiv);
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des véhicules:', error));
});
// Récupérer les marques et les ajouter au select / Retrieve the marks and add them to the select
fetch('/api/brands')
    .then(response => response.json())
    .then(brands => {
        const brandSelect = document.getElementById('brand');
        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            brandSelect.appendChild(option);
        });
    });

// Récupérer les années et les ajouter au select / Get the years and add them to the select
fetch('/api/years')
    .then(response => response.json())
    .then(years => {
        const yearSelect = document.getElementById('year');
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        });
    });
