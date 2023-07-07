<?php
// Check if all required fields are filled
if (empty($_POST['name']) || empty($_POST['address']) || empty($_POST['suburb']) || empty($_POST['state']) || empty($_POST['country']) || empty($_POST['email'])) {
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
    $payment = $_POST['payment'];

    // Connect to the database
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "userbooking";

    // Create a new connection instance
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check if the user has rented within the past three months
    $threeMonthsAgo = date('Y-m-d', strtotime('-3 months'));
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM Renting_History WHERE user_email = :email AND rent_date > :threeMonthsAgo");
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':threeMonthsAgo', $threeMonthsAgo);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $rentedWithinThreeMonths = ($result['count'] > 0);

    // Insert booking into Renting_History table
    $stmt = $conn->prepare("INSERT INTO Renting_History (user_email, rent_date, bond_amount) VALUES (:email, NOW(), :bond_amount)");
    $stmt->bindParam(':email', $email);
    $bondAmount = ($rentedWithinThreeMonths ? 0 : 200); // Store bond amount in a variable
    $stmt->bindParam(':bond_amount', $bondAmount);
    $stmt->execute();

    // Close the database connection
    $conn = null;

    // Display success message
    echo "<p>Your booking has been placed!</p>";
  }
}
?>
