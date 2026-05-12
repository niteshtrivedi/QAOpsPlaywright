const base = require('@playwright/test');


exports.customtest = base.test.extend(

    {
      testDataForOrder : {

      "username" : "niteshtrivedi.84@gmail.com",
      "password" : "Nitesh@01",
      "productName" : "ZARA COAT 3"

      }



    }
)