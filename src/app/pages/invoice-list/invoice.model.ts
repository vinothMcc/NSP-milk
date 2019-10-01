export class Customer {
    supplier: String;
    line: String;
    order: string;
    name: String;
    milk_count: String;
    payment_type: String;
    customer_type: String;
    "30days_amount": string;
    "31days_amount": string;
    "29days_amount": string;
    "28days_amount": string;
    start_date: Date;
    end_date: Date;
    information: String;
    invoice: {
        is_paid: Boolean,
        payment: [
            {
            timestamp: { type: Date, default: Date },
            amount: Number
            }
        ]
    };
    extra_milk: {};
    minus_milk: {};
    pay;
    constructor() {
        this.pay = this.invoice.payment[0].amount;
    }
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}