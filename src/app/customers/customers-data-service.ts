import { Customers } from 'src/app/types/customers-type';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; 
import { ResourcesService } from '../services/resources/resources.service';
import { ActivatedRoute } from '@angular/router';
import { Customer } from '../types/customers-type';

@Injectable()
export class CustomersDataService implements OnInit {

    /**** costmumer */
    private customers: Promise<Customers>;

    private customer: any = new BehaviorSubject(1);
    public customerObsever = this.customer.asObservable();

    /**** costmumers media prop */
    private galleries: any;
    private emailPatteren: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
    public intendedUrl: string;
    num: number = 0;

    customerOb: Customer;

    constructor(private srv: ResourcesService, private route: ActivatedRoute) { this.initCustomers(); }

    ngOnInit() { }

    initCustomers() {
        this.customers = this.srv.getResources("customers", false);
    }

    public getCustomers(type?) {

        return this.customers.then(
            (res) => {
                let data = res && res['customers'] ? res['customers'] : res ? { ['customers']: res } : [];
                return (type && data && data[type]) ? data[type] : data;
            },
            (res) => {
                return [];
            }
        );
    }

    handleError(errors) {
        console.log(errors);

    }

    CustomerEmit(customer) {
        this.customer.next(customer);
    }

    public getFieldType(customerProp){
        let isNumric = (!isNaN(parseFloat(customerProp)) && isFinite(customerProp));

        let prop: string | number = "company";
        if (isNumric) {
            prop = "id";
            customerProp = +customerProp;
        } else if (!isNumric && typeof customerProp == "string") {
            let regex = customerProp.match(this.emailPatteren);
            if (regex && regex[0]) prop = "email";
        } else {
            console.log("WARNING! only string and numbers of data typs allowed to passed this func!");
            return true;
        }
        return {
            [prop]: customerProp,
            [customerProp]: prop
        };
    }

    public getById(customerProp: any): Promise<{}> | any {
        // let customers = this.costs? this.costs: this.customers;
        let isNumric = (!isNaN(parseFloat(customerProp)) && isFinite(customerProp)),
            type = this.intendedUrl ? this.intendedUrl : decodeURIComponent(location.pathname).split('/')[2];
        type = (type === "app") ? decodeURIComponent(location.pathname).split('/')[2] : type;

        let decodedUrl = decodeURIComponent(localStorage.pathname);
        
        if(decodedUrl.indexOf('/customers') >= 0){
            console.log(decodedUrl.indexOf('/customers'));
        }
       
        let prop: string | number = "company";
        if (isNumric) {
            prop = "id";
            customerProp = +customerProp;
        } else if (!isNumric && typeof customerProp == "string") {
            let regex = customerProp.match(this.emailPatteren);
            if (regex && regex[0]) prop = "email";
        } else {
            console.log("WARNING! only string and numbers of data typs allowed to passed this func!");
            return true;
        }


        return this.getCustomers().then((dataResponse) => {
            if (type == '/join') {
                // return false;
                return this.joinPageAccessor(dataResponse, prop, customerProp);
            }
            
            if(this.customerOb){
                return this.customerOb;
            }
            
            let customersData = dataResponse['customers'] ? dataResponse['customers'] : dataResponse;

            let customer = customersData && customersData[type] ? customersData[type] : false;
            console.log("dataResponse: ", dataResponse, " type: ", type, " customer: ", customer, " prop: ", prop, " customerProp: ", customerProp, " len: ", customer.length);
            
            let foundedCustomer = customer ? customer.find((items) => {
                return items['customer'][prop] == customerProp;
            }) : [];//{return items['customer'][prop] == customerProp;})

            if(typeof foundedCustomer == "object" || Array.isArray(foundedCustomer)) {
                this.customerOb = foundedCustomer;
                this.customer.next(foundedCustomer);//this.customer.next(1);
            }
            return foundedCustomer;//? true:false;
        });
    }

    getCustomersMaper() {
        return this.getCustomers().then((dataResponse) => {
            console.log(dataResponse);
            // return dataResponse;
        });
    }

    joinPageAccessor(customers, prop, customerProp) {

        let concated = customers ? this.concatCustomers(customers) : false;
        let isCustomer = concated && Array.isArray(concated) ?
            concated.filter(items => items['customer'][prop] == customerProp).length > 0? true:false : false;

        console.log("customers: " , customers, " concated: ", concated, " prop: ", prop, " customerProp: ", customerProp, " is customer: ", isCustomer);
        (typeof isCustomer === "object") ? this.customer.next(isCustomer) : this.customer.next(1);
        return isCustomer;
    }

    userIsAlreadyCustomer(customers, prop, customerProp){
        let concated = customers ? this.concatCustomers(customers) : false;
        let isCustomer = concated && Array.isArray(concated) ?
            concated.filter(items => items['customer'][prop] == customerProp).length > 0? true:false : false;
        return isCustomer;
    }

    concatCustomers(customers) {
        let cus = [],
            customersArray;

        for (let ii in customers) {
            // let cust = customers[ii];
            // console.log(ii);
            if(ii == "customers"){
                customersArray = customers[ii];
                for (let item in customersArray){
                    if (cus.length === 0) {
                        cus = customersArray[item];
                    } else {
                        cus = cus.concat(customersArray[item]);
                    }
                    // console.log(item);
                }
                break;
            }
            if (cus.length === 0) {
                cus = customers[ii];
            } else {
                cus = cus.concat(customers[ii]);
            }
        }
        return cus;
    }

    CustomerPromis(CustomerUriRecourse) {

        return this.getById(CustomerUriRecourse).then((customerResponse) => {
            let customer = customerResponse['customer'];
            if (typeof customer == "object" && customer['email']) {

                return customer;
            } else {
                return false;
            }
        });
    }

    findItems(obj, id) {

        let arrItem = [];
        let gals = obj['value'];
        let idx = 0;
        for (let ii of gals) {

            if (ii.customer_id === id) {
                //this.customer.next(gals[ii]);
                arrItem[idx++] = ii;
            }
        }
        return arrItem;
    }

    finCustomer(elem, prop, costName) {
        return elem[prop] == costName;
    }
}

