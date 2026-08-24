export const redirectToGPay = ({ amount, tournamentTitle, onSuccess, onFailure }) => {
  // Demo UPI string that opens GPay on Mobile / Desktop UPI Handler
  const upiId = "nexusplay@upi"; // Replace with actual UPI ID
  const name = encodeURIComponent("Nexus Play Tournaments");
  const note = encodeURIComponent(`Registration for ${tournamentTitle}`);
  
  // Standard UPI Intent URL (Directs to GPay / Default UPI App)
  const upiUrl = `upi://pay?pa=${upiId}&pn=${name}&tn=${note}&am=${amount}&cu=INR`;

  try {
    // Attempt opening UPI app
    window.location.href = upiUrl;

    // Simulation for frontend testing (User manually confirms payment done)
    setTimeout(() => {
      const confirmed = window.confirm("Did you complete the payment on GPay?");
      if (confirmed) {
        onSuccess({ paymentId: "PAY_" + Date.now() });
      } else {
        onFailure("Payment was cancelled or failed.");
      }
    }, 1500);
  } catch (err) {
    onFailure("Could not redirect to GPay.");
  }
};