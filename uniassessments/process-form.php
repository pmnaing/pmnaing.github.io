<?php
// Check if all required fields are filled
if(empty($_POST['name']) || empty($_POST['address']) || empty($_POST['suburb']) || empty($_POST['state']) || empty($_POST['country']) || empty($_POST['email'])) {
  // Display error message
  echo "<p>Please fill out all required fields marked with an asterisk (*)</p>";
} else {
  // Check if email is valid
  if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    // Display error message
    echo "<p>Please enter a valid email address</p>";
  } else {
    // Get order details
    $name = $_POST['name'];
    $address = $_POST['address'];
    $suburb = $_POST['suburb'];
    $state = $_POST['state'];
    $country = $_POST['country'];
    $email = $_POST['email'];

    // Send confirmation email
    $to = $email;
    $subject = "Order Confirmation";
    $message = "Thank you for your order! Here are your order details:\n\nName: $name\nAddress: $address\nSuburb: $suburb\nState: $state\nCountry: $country\nEmail: $email\n\nOrder Date and Time: " . date("Y-m-d H:i:s");
    $headers = "From: orders@example.com";

    if(mail($to, $subject, $message, $headers)) {
      // Display success message
      echo "<p>Your order has been placed! An email confirmation has been sent to $email</p>";
    } else {
      // Display error message
      echo "<p>There was an error processing your order. Please try again later.</p>";
    }
  }
}
?>
