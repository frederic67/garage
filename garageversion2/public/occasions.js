fetch('/api/vehicles')
    .then(response => response.json())
    .then(vehicles => {
        const vehiclesRow = document.querySelector('.vehicles-section .row.mb-5');
        vehiclesRow.innerHTML = ''; // Videz la section des véhicules / Clear the vehicles section
        vehicles.forEach(vehicle => {
            const vehicleDiv = document.createElement('div');
            vehicleDiv.className = 'col-md-4';

            const imageLink = document.createElement('a');
            imageLink.className = 'image-popup';
            imageLink.href = vehicle.image_url;

            const image = document.createElement('img');
            image.src = vehicle.image_url;
            image.alt = vehicle.brand + ' ' + vehicle.model;
            image.className = 'img-fluid custom-shadow';

            const descriptionDiv = document.createElement('div');
            descriptionDiv.className = 'vehicle-description mt-3';

            const brand = document.createElement('h4');
            brand.textContent = vehicle.brand + ' ' + vehicle.model;

            const description = document.createElement('p');
            description.textContent = vehicle.description;

            const price = document.createElement('p');
            price.textContent = `Prix: ${vehicle.price}€`;

            const mileage = document.createElement('p');
            mileage.textContent = `Kilométrage: ${vehicle.mileage}km`;

            // Assemblage des éléments / Assembling the elements
            imageLink.appendChild(image);
            vehicleDiv.appendChild(imageLink);
            descriptionDiv.appendChild(brand);
            descriptionDiv.appendChild(description);
            descriptionDiv.appendChild(price);
            descriptionDiv.appendChild(mileage);
            vehicleDiv.appendChild(descriptionDiv);
            vehiclesRow.appendChild(vehicleDiv);
        });
    })
    .catch(error => console.error('Erreur lors de la récupération des véhicules:', error));
