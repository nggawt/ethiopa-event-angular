import { Injectable } from '@angular/core';
import { HallType } from './hall-type';
import { BehaviorSubject, of, Subject, Observable, AsyncSubject, ReplaySubject } from 'rxjs';
import { tap, single, map, find, filter, first, pluck, take } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class CustomersDataService {

    /**** costmumer */
    private customers:Promise<any>;
    private costs: any = false;

    private customer: any = new BehaviorSubject(1);
    public customerObsever = this.customer.asObservable();

    /**** costmumers media prop */
    private galleries: any;
    private emailPatteren: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
    public intendedUrl: string;

    constructor(private http: HttpClient) {

        this.customers = this.http.get("http://ethio:8080/api/customers")
        .pipe(
            tap(res => {
                this.costs = res['customers'];
                this.galleries = res['galleries'];
            })
            
        ).toPromise().catch(this.handleError);
    }
    
    public getCustomers(type?) {
        if(this.costs) return new Promise((accepted, rejected) => { return accepted(this.costs);});

        return this.customers.then(
            (res) => {
                let data = res && res['customers']? res['customers']:[];
                
                return (type && data && data[type])? data[type]:data;
            },
            (res) => {
                return [];
            }
        );
    }
    
    handleError(errors){
        console.log(errors);
        
    }

    CustomerEmit(customer) {
        this.customer.next(customer);
    }

    public getById(customerName: any):Promise<{}> | any {
        // let customers = this.costs? this.costs: this.customers;
        let isNumric = (! isNaN(parseFloat(customerName)) && isFinite(customerName));
        let type = this.intendedUrl? this.intendedUrl:decodeURIComponent(location.pathname).split('/')[2];
        type = (type === "app")?decodeURIComponent(location.pathname).split('/')[2]:type;
                
        let prop: string | number = "company";
        if (isNumric) {
            prop = "id";
            customerName = +customerName;
        }else if(! isNumric && typeof customerName == "string"){
            let regex = customerName.match(this.emailPatteren);
            if(regex && regex[0]) prop = "email";
        }else{
            console.log("WARNING! only string and numbers of data typs allowed to passed this func!");
            return false;
        }


        return this.getCustomers().then((dataResponse) => {
            if(type == '/join'){
                return this.joinPagAccessor(dataResponse, prop, customerName);
            }
            let customersData = dataResponse['customers']? dataResponse['customers']: dataResponse;
            let customer = customersData && customersData[type]? customersData[type]:false;
            
            customer = customer?customer.find((items) => items['customer'][prop] == customerName):[];//{return items['customer'][prop] == customerName;})
            (typeof customer == "object")? this.customer.next(customer): this.customer.next(1);
            return customer;
        });
    }

    getCustomersMaper(){
        return this.getCustomers().then((dataResponse) => {
            console.log(dataResponse);
            // return dataResponse;
        });
    }

    joinPagAccessor(cus, prop, customerName){

        let concated = cus?this.concatCustomers(cus):false;
        let isCustomer = concated?concated.find((items) => {return items['customer'][prop] == customerName;}):false;
        
        (typeof isCustomer === "object")? this.customer.next(isCustomer): this.customer.next(1);
        return isCustomer;
    }

    concatCustomers(customers){
        let cus = [];
        for(let ii in customers){
            let cust = customers[ii];
            if(cus.length === 0){
                cus = cust;
            }else{
                cus = cus.concat(cust);
            }
        }
        return cus;
    }

    CustomerPromis(CustomerUriRecourse) {

        return this.getById(CustomerUriRecourse).then((customerResponse) => {
            let customer = customerResponse['customer'];
            if (typeof customer == "object"  && customer['email']) {
                        
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

            if (ii.Customer_id === id) {
                //this.customer.next(gals[ii]);
                arrItem[idx++] = ii;
            }
        }
        return arrItem;
    }

    finCustomer(elem,prop,costName){
        return elem[prop] == costName;
    } 
}

