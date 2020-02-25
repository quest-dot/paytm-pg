const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const checksum_lib = require('./libs/checksum');
const {
  BASE_URL,
  MERCHANT_ID,
  MERCHANT_KEY,
  CALLBACK_URL,
  CHANNEL_ID,
  INDUSTRY_TYPE_ID,
  WEBSITE,
} = require('./constants');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  var paytmParams = {
    MID: MERCHANT_ID,
    WEBSITE,
    INDUSTRY_TYPE_ID,
    CHANNEL_ID,
    CALLBACK_URL,
    ORDER_ID: `SW_${Date.now()}`,
    CUST_ID: 'CUSTOMER_123',
    MOBILE_NO: '9959582678',
    EMAIL: 'sasidhar.678@gmail.com',
    TXN_AMOUNT: '1.00',
  };

  try {
    checksum_lib.genchecksum(paytmParams, MERCHANT_KEY, async function(err, checksum) {
      console.log('---- checksum generated ----');
      console.log(checksum);

      let payload = '';
      for (const key in paytmParams) {
        payload += `${key}=${paytmParams[key]}&`;
      }
      payload += `${payload}CHECKSUMHASH=${checksum}`.trim();

      console.log('\n', '---- request payload ----', '\n');
      console.log(payload);

      const { data } = await axios.post(BASE_URL, payload);
      res.status(200).send(data);
    });
  } catch (error) {
    res.status(200).send(error);
  }
});

app.post('/response', (req, res) => {
  const { body } = req;
  res.status(200).json(body);
});

app.listen(3000, () => console.log('server started listening @3000'));
