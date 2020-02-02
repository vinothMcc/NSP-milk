import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Constants {
  BEURL = 'https://nsp-milk.herokuapp.com';
  CUSTOMER = '/api/customer';
  CUSTOMERS = '/api/customers';
  INVOICE = '/api/invoice/';
  UPDATEINVOICE = 'update_invoice';
  UPDATEEXTRAANDMINUSAMOUNT = '/api/extra-and-minus-milk';
  STATISTICS = '/api/statistics';
  SUPPLIERS = [
    { value: 'suresh', viewValue: 'suresh' },
    { value: 'vinoth', viewValue: 'vinoth' },
    { value: 'baskar', viewValue: 'baskar' }
  ];
  PAYMENT_TYPES = [
    { value: 'PM', viewValue: 'PM' },
    { value: 'LM', viewValue: 'PM' }
  ];

  LINES = [
    { value: 'line1', viewValue: 'line1' },
    { value: 'line2', viewValue: 'line2' },
    { value: 'krishna nagar', viewValue: 'krishna nagar' },
    { value: 'church line', viewValue: 'church line' }
  ];
}
