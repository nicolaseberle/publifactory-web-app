<template>
  <div class='subscribe-dialog-container'>

    <div class="cell example example2" id="example-2">
      <div v-if="currentPlan==='freemium'">
        <form>
          <div data-locale-reversible>
            <div class="row" >
              <div class="field">
                <input id="email" data-tid="elements_examples.form.email_placeholder" class="input empty" type="text" placeholder="john.smith@domain.com" required="">
                <label for="example2-email" data-tid="elements_examples.form.email">Email</label>
                <div class="baseline"></div>
              </div>
            </div>
            <div class="row" data-locale-reversible>
              <div class="field ">
                <input id="fullname" data-tid="elements_examples.form.name_placeholder" class="input empty" type="text" placeholder="John Smith (or corporate name)" required="">
                <label for="example2-name" data-tid="elements_examples.form.name">Name</label>
                <div class="baseline"></div>
              </div>
            </div>
            <div class="row" data-locale-reversible>
              <div class="field" >
                <input id="address" data-tid="elements_examples.form.address_placeholder" class="input empty" type="text" placeholder="185 Berry St" required="" autocomplete="address-line1">
                <label for="example2-address" data-tid="elements_examples.form.address_label">Address</label>
                <div class="baseline"></div>
              </div>
            </div>
            <div class="row" data-locale-reversible>
              <div class="field half-width">
                <input id="city" data-tid="elements_examples.form.city_placeholder" class="input empty" type="text" placeholder="San Francisco" required="" autocomplete="address-level2">
                <label for="example2-city" data-tid="elements_examples.form.city_label">City</label>
                <div class="baseline"></div>
              </div>
              <div class="field quarter-width">
                <input id="state" data-tid="elements_examples.form.state_placeholder" class="input empty" type="text" placeholder="CA" required="" autocomplete="address-level1">
                <label for="example2-state" data-tid="elements_examples.form.state_label">State</label>
                <div class="baseline"></div>
              </div>
              <div class="field quarter-width">
                <input id="zip" data-tid="elements_examples.form.postal_code_placeholder" class="input empty" type="text" placeholder="94107" required="" autocomplete="postal-code">
                <label for="example2-zip" data-tid="elements_examples.form.postal_code_label">ZIP</label>
                <div class="baseline"></div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="field">
              <div class="sr-input sr-card-element" id="card-element"></div>
              <div class="baseline"></div>
            </div>
          </div>
          <div class="row">
            <div class="field" style='margin-top:20px'>
                <el-switch
                  v-model="checked"
                  active-text="I agree with the Term of Use">
                </el-switch>
            </div>
          </div>

          <div class="sr-field-error" id="card-errors" role="alert"></div>


          <button id="submit"  :disabled='checked===false'>
            <div id="spinner" class="hidden"></div>
            <span id="button-text">Subscribe</span>
          </button>
          <div class="row" >
            <div class="footer">
              <p>Your card will be charged every 5 requests</p>
            </div>
          </div>
        </form>
      </div>
      <div v-if="currentPlan==='premium'" class="sr-payment-summary">
        <el-button style='width:100%;margin:0;' type="success" round>Your subscription is {{mySubscription.status}}</el-button>
      </div>
    </div>

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
  data () {
    return {
      checked: false,
      currentPlan: null,
      stripe: '',
      mySubscription: {status:'noActive'},
      billingId: null
    }
  },
  created (){
  },
  async mounted () {
    const publicKey = await this.getPublicKey();
    await this.getCustomerBillingId()
    await this.getSubscriptionStatus()
    await this.stripeElements(publicKey)
  },
  methods:{
    async stripeElements (publicKey) {
      this.stripe = await Stripe(publicKey);
      var elements = this.stripe.elements();
      // Element styles
      var style = {
        base: {
          color: '#32325D',
          fontWeight: 500,
          fontFamily: 'Source Code Pro, Consolas, Menlo, monospace',
          fontSize: '16px',
          fontSmoothing: 'antialiased',

          '::placeholder': {
            color: '#CFD7DF',
          },
          ':-webkit-autofill': {
            color: '#e39f48',
          },
        },
        invalid: {
          color: '#E25950',

          '::placeholder': {
            color: '#FFCCA5',
          },
        },
        checkbox:{
          margin:'0 0 0 100px '
        }
      };

      var elementClasses = {
        focus: 'focused',
        empty: 'empty',
        invalid: 'invalid'
      };

      // Floating labels
      var inputs = document.querySelectorAll('.cell.example.example2 .input');
      Array.prototype.forEach.call(inputs, function(input) {
        input.addEventListener('focus', function() {
          input.classList.add('focused');
        });
        input.addEventListener('blur', function() {
          input.classList.remove('focused');
        });
        input.addEventListener('keyup', function() {
          if (input.value.length === 0) {
            input.classList.add('empty');
          } else {
            input.classList.remove('empty');
          }
        });
      });

      var card = elements.create('card', {
        style: style,
        classes: elementClasses,
      });

      card.mount('#card-element');

      // Element focus ring
      card.on('focus', () => {
        var el = document.getElementById('card-element');
        el.classList.add('focused');
      });

      card.on('blur', () => {
        var el = document.getElementById('card-element');
        el.classList.remove('focused');
      });

      document.querySelector('#submit').addEventListener('click', (evt) => {
        evt.preventDefault();
        this.changeLoadingState(true);
        // Initiate payment
        this.createPaymentMethodAndCustomer(card);
      });
    },
    async getSubscriptionStatus() {
      if(this.billingId){
        await axios.get('/api/billings/users/'+ this.userId +'/'+ this.billingId,
          { headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.accessToken}`
          }
        }).then((res)=>{
            this.currentPlan = res.data.billing.plan
          }).catch(()=>{
            this.currentPlan='freemium'
          })
      } else {
        this.currentPlan='freemium'
      }
    },
    async getPublicKey () {
      const response = await axios.get('/api/billings/publicKey', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        }
      })
      return response.data

    },
    orderComplete (subscription) {
      this.changeLoadingState(false);
      this.mySubscription = subscription
      this.getSubscriptionStatus()
    },
    orderIncomplete (error) {
      this.changeLoadingState(false);
      this.$message({
        title: this.$t('message.error'),
        message: error.message,
        type: 'error'
      });
    },
    changeLoadingState (isLoading) {
      if (isLoading) {
        document.querySelector('#spinner').classList.add('loading');
        document.querySelector('button').disabled = true;

        document.querySelector('#button-text').classList.add('hidden');
      } else {
        document.querySelector('button').disabled = false;
        document.querySelector('#spinner').classList.remove('loading');
        document.querySelector('#button-text').classList.remove('hidden');
      }
    },
    createPaymentMethodAndCustomer ( card) {
      var cardholderEmail = document.querySelector('#email').value;
      var fullName = document.querySelector('#fullname').value;

      this.stripe.createPaymentMethod('card', card, {
          billing_details: {
            email: cardholderEmail
          }
        })
        .then((result) => {
          if (result.error) {
            this.showCardError(result.error);
          } else {
            this.upgradePlan(result.paymentMethod.id);
          }
        });
    },
    async getCustomerBillingId() {
      await axios.get('/api/users/me',
        {headers: {
        'Authorization': `Bearer ${this.accessToken}`}
        }).then(response => {
          this.billingId = response.data.billing
        })
    },///upgrade/:userId/:billingId'
    upgradePlan (paymentMethodId) {
      axios.post('/api/billings/upgrade/' + this.userId + '/' + this.billingId,
      {
        paymentMethodId: paymentMethodId
      }, {headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        }
      }).then(res => {
        console.log(res)
        this.orderComplete(res.data.subscription);
      }).catch((err)=>{
        this.orderIncomplete(err)
      })
    },
    showCardError (error) {
      this.changeLoadingState(false);
      // The card was declined (i.e. insufficient funds, card has expired, etc)
      const errorMsg = document.querySelector('.sr-field-error');
      errorMsg.textContent = error.message;
      setTimeout(function() {
        errorMsg.textContent = '';
      }, 8000);
    },/*
    handleSubscription (subscription) {
      const { latest_invoice } = subscription;
      const { payment_intent } = latest_invoice;

      if (payment_intent) {
        const { client_secret, status } = payment_intent;

        if (status === 'requires_action' || status === 'requires_payment_method') {
          this.stripe.confirmCardPayment(client_secret).then((result) => {
            if (result.error) {
              // Display error message in your UI.
              // The card was declined (i.e. insufficient funds, card has expired, etc)
              this.changeLoadingState(false);
              this.showCardError(result.error);
            } else {
              // Show a success message to your customer
              this.confirmSubscription(subscription.id);
            }
          });
        } else {
          // No additional information was needed
          // Show a success message to your customer
          this.orderComplete(subscription);
        }
      } else {
        this.orderComplete(subscription);
      }
    },*/
    closeDialog () {
      this.emit('close')
      this.$destroy();
    }
  }


}
</script>
<style>

.sr-payment-summary {
  margin-top: 20px;
  margin-bottom: 20px;
}
.sr-main,
.sr-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  align-self: center;
}
.sr-main {
  width: var(--form-width);
}
.sr-content {
  padding-left: 48px;
}
.sr-legal-text {
  color: var(--gray-light);
  text-align: center;
  font-size: 13px;
  line-height: 17px;
  margin-top: 12px;
}
.sr-field-error {
  color: var(--accent-color);
  text-align: center;
  color: red;
  font-size: 12px;
  line-height: 15px;
  margin-top: 10px;
}

/* Form */
.sr-form-row {
  margin: 16px 0;
}
label {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
  display: inline-block;
}

/* Inputs */
/*
.sr-input,
.sr-select,
input[type='text'] {
  border: 1px solid var(--gray-border);
  border-radius: var(--radius);
  padding: 5px 12px;
  height: 44px;
  width: 100%;
  transition: box-shadow 0.2s ease;
  background: white;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
}
.sr-input:focus,
input[type='text']:focus,
button:focus,
.focused {
  box-shadow: 0 0 0 1px rgba(50, 151, 211, 0.3), 0 1px 1px 0 rgba(0, 0, 0, 0.07),
    0 0 0 4px rgba(50, 151, 211, 0.3);
  outline: none;
  z-index: 9;
}
.sr-input::placeholder,
input[type='text']::placeholder {
  color: var(--gray-light);
}*/

/* Checkbox */
.sr-checkbox-label {
  position: relative;
  cursor: pointer;
}

.sr-checkbox-label input {
  opacity: 0;
  margin-right: 6px;
}

.sr-checkbox-label .sr-checkbox-check {
  position: absolute;
  left: 0;
  height: 16px;
  width: 16px;
  background-color: white;
  border: 1px solid var(--gray-border);
  border-radius: 4px;
  transition: all 0.2s ease;
}

.sr-checkbox-label input:focus ~ .sr-checkbox-check {
  box-shadow: 0 0 0 1px rgba(50, 151, 211, 0.3), 0 1px 1px 0 rgba(0, 0, 0, 0.07),
    0 0 0 4px rgba(50, 151, 211, 0.3);
  outline: none;
}

.sr-checkbox-label input:checked ~ .sr-checkbox-check {
  background-color: var(--accent-color);
  background-image: url('https://storage.googleapis.com/stripe-sample-images/icon-checkmark.svg');
  background-repeat: no-repeat;
  background-size: 16px;
  background-position: -1px -1px;
}

/* Select */
.sr-select {
  display: block;
  height: 44px;
  margin: 0;
  background-image: url('https://storage.googleapis.com/stripe-sample-images/icon-chevron-down.svg');
  background-repeat: no-repeat, repeat;
  background-position: right 12px top 50%, 0 0;
  background-size: 0.65em auto, 100%;
}
.sr-select:after {
}
.sr-select::-ms-expand {
  display: none;
}
.sr-select:hover {
  cursor: pointer;
}
.sr-select:focus {
  box-shadow: 0 0 0 1px rgba(50, 151, 211, 0.3), 0 1px 1px 0 rgba(0, 0, 0, 0.07),
    0 0 0 4px rgba(50, 151, 211, 0.3);
  outline: none;
}
.sr-select option {
  font-weight: 400;
}
.sr-select:invalid {
  color: var(--gray-light);
  background-opacity: 0.4;
}

/* Combo inputs */
.sr-combo-inputs {
  display: flex;
  flex-direction: column;
}
.sr-combo-inputs input,
.sr-combo-inputs .sr-select {
  border-radius: 0;
  border-bottom: 0;
}
.sr-combo-inputs > input:first-child,
.sr-combo-inputs > .sr-select:first-child {
  border-radius: var(--radius) var(--radius) 0 0;
}
.sr-combo-inputs > input:last-child,
.sr-combo-inputs > .sr-select:last-child {
  border-radius: 0 0 var(--radius) var(--radius);
  border-bottom: 1px solid var(--gray-border);
}
.sr-combo-inputs > .sr-combo-inputs-row:first-child input:first-child {
  border-radius: var(--radius) 0 0 0;
}
.sr-combo-inputs > .sr-combo-inputs-row:first-child input:last-child {
  border-radius: 0 var(--radius) 0 0;
}
.sr-combo-inputs-row {
  width: 100%;
  display: flex;
}

.sr-combo-inputs-row > input {
  width: 100%;
  border-radius: 0;
}

.sr-combo-inputs > .sr-combo-inputs-row:first-child input:last-child {
  border-radius: var(--radius) var(--radius) 0 0;
}
/*
.sr-combo-inputs-row:not(:first-of-type) .sr-input {
  border-radius: 0 0 var(--radius) var(--radius);
}
*/

/* Buttons and links */
/*
button {
  background: var(--accent-color);
  border-radius: var(--radius);
  color: white;
  border: 0;
  padding: 12px 16px;
  margin-top: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: block;
}
button:hover {
  filter: contrast(115%);
}
button:active {
  transform: translateY(0px) scale(0.98);
  filter: brightness(0.9);
}
button:disabled {
  opacity: 0.5;
  cursor: none;
}*/

.sr-payment-form button,
.fullwidth {
  width: 100%;
}

a {
  /*color: var(--accent-color);*/
  text-decoration: none;
  transition: all 0.2s ease;
}

a:hover {
  filter: brightness(0.8);
}

a:active {
  filter: brightness(0.5);
}

/* Code block */
.sr-callout {
  background: var(--gray-offset);
  padding: 12px;
  border-radius: var(--radius);
  max-height: 400px;
  max-width: 600px;
  overflow: auto;
}
code,
pre {
  font-family: 'SF Mono', 'IBM Plex Mono', 'Menlo', monospace;
  font-size: 14px;
  overflow-x: auto;
  white-space: pre-wrap;
}

/* Stripe Element placeholder */
.sr-card-element {
  padding-top: 12px;
}

/* Responsiveness */
@media (max-width: 720px) {
  .sr-root {
    flex-direction: column;
    justify-content: flex-start;
    padding: 48px 20px;
    min-width: 320px;
  }

  .sr-header__logo {
    background-position: center;
  }

  .sr-payment-summary {
    text-align: center;
  }

  .sr-content {
    display: none;
  }

  .sr-main {
    width: 100%;
  }
}

.sr-root {
  animation: 0.4s form-in;
  animation-fill-mode: both;
  animation-timing-function: ease;
}

.sr-payment-form .sr-form-row {
  animation: 0.4s field-in;
  animation-fill-mode: both;
  animation-timing-function: ease;
  transform-origin: 50% 0%;
}

/* need saas for loop :D  */
.sr-payment-form .sr-form-row:nth-child(1) {
  animation-delay: 0;
}
.sr-payment-form .sr-form-row:nth-child(2) {
  animation-delay: 60ms;
}
.sr-payment-form .sr-form-row:nth-child(3) {
  animation-delay: 120ms;
}
.sr-payment-form .sr-form-row:nth-child(4) {
  animation-delay: 180ms;
}
.sr-payment-form .sr-form-row:nth-child(5) {
  animation-delay: 240ms;
}
.sr-payment-form .sr-form-row:nth-child(6) {
  animation-delay: 300ms;
}

.hidden {
  display: none;
}

.loading {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}

.sr-plans {
  display: flex;
  width: 600px;
}

.sr-plan {
  border: 1px solid rgb(232, 232, 232);
  border-radius: 6px;
  margin-right: 25px;
  height: 226px;
  width: 257px;
}

.sr-plan-inner {
  margin: 28px;
}

.sr-plan-name {
  color: rgb(166, 166, 166);
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0px;
}

.sr-plan-text {
  color: rgb(153, 153, 153);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0px;
  line-height: 14px;
}

.sr-plan-button {
  border: 2px solid rgb(237, 95, 116);
  border-radius: 7px;
}

@keyframes field-in {
  0% {
    opacity: 0;
    transform: translateY(8px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }
}

@keyframes form-in {
  0% {
    opacity: 0;
    transform: scale(0.98);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}


</style>
