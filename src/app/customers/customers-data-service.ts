import { Injectable, OnInit } from '@angular/core';
import { HallType } from './hall-type';
import { BehaviorSubject, of, Subject, Observable, AsyncSubject, ReplaySubject } from 'rxjs';
import { tap, single, map, find, filter, first, pluck, take } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ResourcesService } from '../services/resources/resources.service';

@Injectable()
export class CustomersDataService implements OnInit{

    /**** costmumer */
    private customers:Promise<any>;

    private customer: any = new BehaviorSubject(1);
    public customerObsever = this.customer.asObservable();

    /**** costmumers media prop */
    private galleries: any;
    private emailPatteren: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
    public intendedUrl: string;
    num:number =0;

    constructor(private srv: ResourcesService) { this.initCustomers();}

    ngOnInit(){}

    initCustomers(){
        this.customers = this.srv.getResources("customers", false);
    }

    public getCustomers(type?) {

        return this.customers.then(
            (res) => {
                let data = res && res['customers']? res['customers']: res?{['customers']: res}:[];
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
            console.log(dataResponse);
            
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

    joinPagAccessor(customers, prop, customerProp){
        
        let concated = customers? this.concatCustomers(customers):false;
        let isCustomer = concated && Array.isArray(concated)? 
        concated.find(items => items['customer'][prop] == customerProp):false;
        
        console.log(customers, prop, customerProp, " is customer: ", isCustomer);
        (typeof isCustomer === "object")? this.customer.next(isCustomer): this.customer.next(1);
        return isCustomer;
    }

    concatCustomers(customers){
        let cus = [];
        for(let ii in customers){
            // let cust = customers[ii];
            console.log(ii);
            if(cus.length === 0){
                cus = customers[ii];
            }else{
                cus = cus.concat(customers[ii]);
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

