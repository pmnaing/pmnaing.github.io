<?php
session_start();

// Retrieve the carBrand parameter from the AJAX request
$carBrand = $_POST['carBrand'];

// Perform the necessary logic to check car availability
// Modify the logic based on your specific requirements

// Simulating the availability check
$availability = checkAvailability($carBrand);

function checkAvailability($carBrand) {
    // Load the JSON data from cars.json
    $jsonData = file_get_contents('cars.json');
    $cars = json_decode($jsonData, true);

    // Search for the car by brand in the JSON data
    foreach ($cars['cars'] as $car) {
        if (strtolower($car['brand']) === strtolower($carBrand) || strtolower($car['model']) === strtolower($carBrand)) {
            return $car['availability'];
        }
    }

    // If the car brand is not found, consider it as unavailable
    return false;
}

// Create an associative array to hold the response data
$response = array();

if ($availability) {
    // Car is available, add it to the shopping cart
    // Perform the necessary logic to add the car to the shopping cart
    // Modify the logic based on your specific requirements

    // Example logic to add the car to the shopping cart session
    $cartItem = array(
        'carBrand' => $carBrand,
        // Add other car details as needed
    );

    // Add the cart item to the shopping cart session
    $_SESSION['shoppingCart'][] = $cartItem;

    $response['success'] = true;
    $response['message'] = 'Car added to the shopping cart successfully.';
} else {
    // Car is not available
    $response['success'] = false;
    $response['message'] = 'Sorry, the car is not available now. Please try other cars.';
}

// Convert the response to JSON and send it back
header('Content-Type: application/json');
echo json_encode($response);
?>
