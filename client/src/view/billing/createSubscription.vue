<template>
  <div style='height:260px;'>
    <form action="/charge" method="post" class='stripe-form' id="payment-form">
      <div class="form-row inline">
        <div class="col">
          <label for="name">
            Name
          </label>
          <input id="name" name="name" placeholder="Emily Rosen" required>
        </div>
        <div class="col">
          <label for="email">
            Email Address
          </label>
          <input id="email" name="email" type="email" placeholder="emily.rosen@example.com" required>
        </div>
      </div>
    <div class="form-row">
      <label for="card-element">
        Credit or debit card
      </label>
      <div id="card-element">
        <!-- A Stripe Element will be inserted here. -->
      </div>
      <!-- Used to display form errors. -->
      <div id="card-errors" role="alert"></div>
    </div>

    <button>Subscribe to the Associate Editor Plan</button>
    </form>
  </div>
</template>
<script>
import locales from 'locales/article'
import { mapGetters } from 'vuex'
import axios from 'axios'

export default{
  locales,
  name: 'createSubscription',
  computed: {
    ...mapGetters([
      'userId',
      'accessToken'
    ])
  },
  mounted () {
    // Create a Stripe client.
    var stripe = Stripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh');

    // Create an instance of Elements.
    var elements = stripe.elements();

    // Custom styling can be passed to options when creating an Element.
    // (Note that this demo uses a wider set of styles than the guide below.)
    /*
    var style = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };*/
    var style = {
      base: {
        color: '#32325d',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        },
        ':-webkit-autofill': {
          color: '#32325d',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
        ':-webkit-autofill': {
          color: '#fa755a',
        },
      }
    };
    // Create an instance of the card Element.
    var card = elements.create('card', {style: style});

    // Add an instance of the card Element into the `card-element` <div>.
    card.mount('#card-element');
  },
  methods:{
    closeDialog () {
      this.emit('close')
    }
  }


}
</script>
<style>
/**
 * The CSS shown here will not be introduced in the Quickstart guide, but shows
 * how you can use CSS to style your Element's container.
 */
 /**
 * The CSS shown here will not be introduced in the Quickstart guide, but
 * shows how you can use CSS to style your Element's container.
 */
 .form-row.inline {
    display: -ms-flexbox;
    display: flex;
}
.form-row:first-child {
    margin-top: 0;
}
.form-row.inline .col:not(:last-child) {
    margin-right: 20px;
}
label {
    display: block;
    margin-bottom: 8px;
    max-width:100%;
    font-size: 14px;
    font-weight: 500;
}
.form-row.inline .col {
    width: 100%;
}
.form-row {
    width: 100%;
    margin-top: 20px;
}
 input, .StripeElement {
   height: 40px;
   padding: 10px 12px;
   margin-bottom: 10px;
   width: 100%;
   color: #32325d;
   background-color: white;
   border: 1px solid rgba(107, 124, 147, 0.3);;
   border-radius: 4px;

   box-shadow: 0 1px 3px 0 #e6ebf1;
   -webkit-transition: box-shadow 150ms ease;
   transition: box-shadow 150ms ease;
 }

 input:focus, .StripeElement--focus {
   box-shadow: 0 1px 3px 0 #cfd7df;
 }

 .StripeElement--invalid {
   border-color: #fa755a;
 }

 .StripeElement--webkit-autofill {
   background-color: #fefde5 !important;
 }

 .stripe-form {
   text-align: left;
   color: rgba(107, 124, 147, 1);
   font-size: 16px;
   line-height: 1.42857143;
   font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
 }
.stripe-form button {
    border: none;
    border-radius: 4px;
    outline: none;
    text-decoration: none;
    color: #fff;
    background: #0fb160;
    white-space: nowrap;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    border-radius: 4px;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.025em;
    text-decoration: none;
    -webkit-transition: all 150ms ease;
    transition: all 150ms ease;
    float: left;
    margin-top: 30px;
    width:100%;
}
</style>
