// services/paymentService.js

let paymentCounter = 0;

const PaymentService = {
  processPayment: async ({ amount, cardNumber }) => {
    paymentCounter += 1;

    // deny every 3rd payment request
    if (paymentCounter % 3 === 0) {
      return {
        success: false,
        reason: 'Credit Card Authorization Failed.'
      };
    }

    // you can make it fancier with cardNumber, but not required
    return {
      success: true,
      transactionId: 'TX-' + Date.now()
    };
  }
};

module.exports = PaymentService;
