document.getElementById('payment-button').addEventListener('click', () => {
    // Replace this with your actual Stripe payment link
    const stripePaymentLink = 'https://buy.stripe.com/7sIaFo3uZedm1d69AA';

    // Redirect to the Stripe payment link
    window.location.href = stripePaymentLink;
});
