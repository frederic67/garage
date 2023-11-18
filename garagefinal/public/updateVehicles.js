fetch('/api/vehicles')
    .then(response => response.json())
    .then(vehicles => {
        vehicles.forEach((vehicle, index) => {
            const vehicleDiv = document.getElementById(`vehicle${index + 1}`);
            
            // Image
            const imageLink = vehicleDiv.querySelector('a.image-popup');
            const image = imageLink.querySelector('img');
            image.src = vehicle.image_url;
            image.alt = vehicle.brand + ' ' + vehicle.model;
            imageLink.href = vehicle.image_url;

            // Description
            const descriptionDiv = vehicleDiv.querySelector('.vehicle-description');
            descriptionDiv.querySelector('h4').textContent = vehicle.brand + ' ' + vehicle.model;
            descriptionDiv.querySelector('p').textContent = vehicle.description;

            const price = document.createElement('p');
            price.textContent = `Prix: ${vehicle.price}€`;
            descriptionDiv.appendChild(price);

            const mileage = document.createElement('p');
            mileage.textContent = `Kilométrage: ${vehicle.mileage}km`;
            descriptionDiv.appendChild(mileage);
        });
    })
    .catch(error => console.error('Erreur lors de la récupération des véhicules:', error));
