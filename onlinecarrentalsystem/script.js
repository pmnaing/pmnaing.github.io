// Define a shopping cart array to store selected cars
const shoppingCart = JSON.parse(sessionStorage.getItem('shoppingCart')) || [];
let cars = [];

// Function to load the JSON file and extract data
function loadCars() {
  fetch('cars.json')
    .then(response => response.json())
    .then(data => {
      // Extract the car data from the JSON object
      cars = data.cars;

      // Generate the car table dynamically
      const carTable = document.createElement('table');
      const tableHeader = `
        <tr>
          <th>Image</th>
          <th>Brand</th>
          <th>Model</th>
          <th>Fuel</th>
          <th>Seats</th>
          <th>Availability</th>
          <th>Price/Day</th>
          <th>Action</th>
        </tr>
      `;
      carTable.innerHTML = tableHeader;

      // Iterate over the car data and add rows to the table
      cars.forEach(car => {
        const carRow = document.createElement('tr');
        carRow.innerHTML = `
          <td><img src="${car.image}" alt="${car.brand} ${car.model}" width="100" height="100"></td>
          <td>${car.brand}</td>
          <td>${car.model}</td>
          <td>${car.fuel}</td>
          <td>${car.seats}</td>
          <td>${car.availability ? 'Available' : 'Not Available'}</td>
          <td>${car['price/day']}</td>
          <td>
            <button class="btn btn-primary" onclick="addToCart('${car.brand}', '${car.model}', ${car['price/day']})">Add to Cart</button>
          </td>
        `;
        carTable.appendChild(carRow);
      });

      // Append the car table to the webpage
      document.getElementById('carList').appendChild(carTable);
    })
}

function addToCart(brand, model, pricePerDay) {
  // Create an AJAX request
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'add_to_cart.php', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  // Define the AJAX response handler
  xhr.onload = function() {
    if (xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      if (response.success) {
        // Car added to cart successfully
        alert(response.message);

        // Find the selected car from the cars array
        const car = cars.find(c => c.brand === brand && c.model === model);

        // Create a new cart item object
        const cartItem = {
          carName: brand + ' ' + model,
          pricePerDay: pricePerDay,
          rentDays: 1, // Default rent days is set to 1
          totalPrice: pricePerDay * 1 // Default total price is set to the price per day
        };

        // Add the cart item to the shopping cart array
        shoppingCart.push(cartItem);

        // Update the shopping cart data in sessionStorage
        sessionStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

        // Update the shopping cart modal
        updateCartModal();
      } else {
        // Car not available
        alert(response.message);
      }
    } else {
      // AJAX request failed
      alert('An error occurred while processing your request.');
    }
  };

  // Prepare the data to send with the AJAX request
  var data = 'carBrand=' + encodeURIComponent(brand) + '&carModel=' + encodeURIComponent(model);

  // Send the AJAX request
  xhr.send(data);
}


// Function to update the shopping cart modal
function updateCartModal() {
  const cartItemsContainer = document.getElementById('cartItems');
  cartItemsContainer.innerHTML = '';
  let totalPrice = 0;
  if (shoppingCart.length === 0) {
    cartItemsContainer.innerHTML = '<p>No items in the shopping cart.</p>';
    document.getElementById('checkoutButton').disabled = true;
  } else {
    const cartTable = document.createElement('table');
    const tableHeader = `<tr> <th>Car</th> <th>Price/Day</th> <th>Rent Days</th> <th>Total Price</th> <th>Action</th> </tr> `;
    cartTable.innerHTML = tableHeader;

    shoppingCart.forEach((item, index) => {
      const cartRow = document.createElement('tr');
      cartRow.innerHTML = `
        <td id="carBrand">${item.carName}</td>
        <td>${item.pricePerDay}</td>
        <td><input type="number" value="${item.rentDays}" onchange="modifyRentDays(${index}, this.value)"></td>
        <td>${item.totalPrice}</td>
        <td>
          <button class="btn btn-outline-danger" onclick="removeFromCart(${index})">Remove</button>
        </td>
      `;
      // Update the total price
      totalPrice += item.totalPrice;

      cartTable.appendChild(cartRow);
    });

    // Display the total price
    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `<td id="totalPrice" colspan="3"></td> <td>Total: ${totalPrice}</td> <td></td>`;
    cartTable.appendChild(totalRow);

    cartItemsContainer.appendChild(cartTable);
    document.getElementById('checkoutButton').disabled = false;
  }
}

// Function to modify rent days for a car in the shopping cart
function modifyRentDays(index, rentDays) {
  const parsedRentDays = parseInt(rentDays);

  if (isNaN(parsedRentDays) || parsedRentDays <= 0) {
    alert('Invalid number of rent days. Please enter a positive number.');
    return;
  }

  shoppingCart[index].rentDays = parsedRentDays;
  shoppingCart[index].totalPrice = shoppingCart[index].pricePerDay * parsedRentDays;

  updateCartModal();
}

// Function to remove a car from the shopping cart
function removeFromCart(index) {
  shoppingCart.splice(index, 1);

  // Update the shopping cart data in sessionStorage
  sessionStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

  updateCartModal();
}



// Function to handle search input and filter cars
function searchCars() {
  const searchInput = document.getElementById('search');
  const searchTerm = searchInput.value.toLowerCase();

  // Get all car rows
  const carRows = document.querySelectorAll('#carList table tr');

  // Loop through each car row and hide/show based on search term
  carRows.forEach(carRow => {
      const brand = carRow.children[0].textContent.toLowerCase();
      const model = carRow.children[1].textContent.toLowerCase();
      const availability = carRow.children[2].textContent.toLowerCase();

      if (brand.includes(searchTerm) || model.includes(searchTerm) || availability.includes(searchTerm)) {
          carRow.style.display = '';
      } else {
          carRow.style.display = 'none';
      }
  });
}

// Call the loadCars function to fetch and display car information
loadCars();

// Add event listener to search input
document.getElementById('search').addEventListener('input', searchCars);

// form.html back button
function goBack() {
  window.history.back();
}

// Function to handle the checkout process and save shopping cart data
function checkout() {
  // Perform the checkout process...

  // Save the shopping cart data to sessionStorage
  sessionStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
}

// Function to redirect to form.html
function redirectToForm() {
  // Save the shopping cart data to sessionStorage
  sessionStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

  // Redirect to form.html
  window.location.href = 'form.html';
}

// Update the shopping cart modal
updateCartModal();
