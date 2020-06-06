import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from './../../services/http-service/http.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';


declare let $: any;

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css', '../../styles/form-inputs.css'],
    encapsulation: ViewEncapsulation.None
})

export class SearchComponent implements OnInit {

    private url: string;
    loginParams: { [key: string]: string };

    allowLogin$: Observable<boolean>;
    public allowCharSets = '(){}+\'\"<>?/\\:,+*&^%$#@!`~[]|=-.  ';


    private itemsSearch: { customers: {}[], events: {}[], articles: {}[] } = {
        customers: [],
        events: [],
        articles: []
    };
    constructor(private http: HttpService, private router: Router, private auth: AuthService) { }

    ngOnInit() { }

    contactModel(param) { }

    setUrlPage(customer) {

        let compNameTrimed = customer['company'].trim(),
            bTypeTrimed = customer['businessType'].trim(),
            compName = (compNameTrimed.split(' ').length > 1) ? this.appendSelashBetweenSpace(compNameTrimed, ' ') : customer['company'],
            businessType = (bTypeTrimed.split(' ').length > 1) ? this.appendSelashBetweenSpace(bTypeTrimed, ' ') : customer['businessType'];

        return "customers/" + businessType + "/" + compName;
    }

    async searchItems(evt) {
        let input: HTMLInputElement = evt.target,
            div: HTMLDivElement = <HTMLDivElement>input.parentElement.parentElement.parentElement;


        let allowed = await this.allowCharSets.split('').filter(char => {
            return input.value.indexOf(char) != -1;
        });
        // console.log(allowed.length);

        if (!allowed.length && input.value.length >= 2) {
            let searchItems: {}[] = [],
                divSearch = $(".search-div")[0],
                customersProps = ['id', 'title', 'company', 'businessType', 'address', 'descriptions'],
                eventsProps = ['id', 'address', 'descriptions', 'date'],
                articleProps = ['id', 'title', 'body', 'date'];
            /* filter customres */

            let customers = await this.gatItems(input, "customers", customersProps);
            if (customers.length) searchItems = [...searchItems, ...customers];
            // console.log(customers);

            /* filter events */
            let sceduleEvents = await this.gatItems(input, 'events', eventsProps);
            if (sceduleEvents.length) searchItems = [...searchItems, ...sceduleEvents];
            // console.log(sceduleEvents);

            /* filter articles */
            let articles = await this.gatItems(input, 'articles', articleProps);
            if (articles.length) searchItems = [...searchItems, ...articles];
            // console.log(articles);

            /* filter pages(contact EE and Customers) */

            /* Execute Search FN */

            let cHtm = await this.createHtms(searchItems);
            // this.maxwidth = this.maxwidth === 0? (divSearch.parentElement.clientWidth * 2): this.maxwidth
            // divSearch.style.width = this.maxwidth + "px";
            if (divSearch.firstElementChild) divSearch.removeChild(divSearch.firstElementChild);
            divSearch.className += " shadow-sm";
            divSearch.style.top = divSearch.parentElement.clientHeight + "px";
            divSearch.style.left = 0 + "px";
            divSearch.style.zIndex = 99;
            divSearch.appendChild(cHtm);
            console.log(cHtm);
        }
    }

    gatItems(input, url?, propsArray?) {

        let link = (url == "events") ? 'scedule-events' : url;
        if (this.itemsSearch[url].length) {
            return this.filterItems(this.itemsSearch[url], input.value, link);
        } else {
            return this.http.getData(url).pipe(map(items => {
                // console.log(Object.keys(items['customers']));//['halls-events']
                items = (items['customers']) ? Object.keys(items['customers']).map(item => items['customers'][item].map(customer => customer['customer']))[0] : items;

                // let evt = events[0].map(item => this.extractProps(item, ['address', 'descriptions', 'date']));
                let evts = Array.prototype.map.call(items, item => this.extractProps(item, propsArray));
                // console.log(evts);
                this.itemsSearch[url] = evts;
                let filteredEvt = this.filterItems(evts, input.value, link);
                return filteredEvt;
            })).toPromise();
        }
    }

    createHtms(items: Array<{}>) {
        let ul: HTMLUListElement = <HTMLUListElement>document.createElement("UL");

        items.forEach(element => {
            let li: HTMLLIElement = <HTMLLIElement>document.createElement("LI"),
                aTag: HTMLAnchorElement = <HTMLAnchorElement>document.createElement("A");

            ul.className = "list-group list-group-flush";
            li.className = "list-group-item";
            let match = element['match'].split('::');

            match.forEach((txt) => {

                let span = document.createElement("SPAN"),
                    txtSplit = txt.split(element['key']);

                span.className = "bg-warning";
                span.innerHTML = element['key'];

                aTag.innerHTML += this.sliceLastTxt(txtSplit[0]);
                aTag.appendChild(span);
                aTag.innerHTML += this.sliceFirstTxt(txtSplit[1]);
            });

            aTag.addEventListener("click", this.navigatToPage.bind(this, element, ul), false);
            li.appendChild(aTag);
            ul.appendChild(li);
        });
        this.attachEvents(ul);
        return ul;
    }

    sliceLastTxt(txt: string) {

        return (txt.lastIndexOf('.') >= 15) ? (txt.lastIndexOf('.', txt.length - 5) >= 0) ?
            txt.slice(txt.lastIndexOf('.', txt.length - 5) + 1) : txt.slice(txt.lastIndexOf('.') + 1) :
            (txt.lastIndexOf(',') >= 15) ? (txt.lastIndexOf(',', txt.length - 5) >= 0) ?
                txt.slice(txt.lastIndexOf(',', txt.length - 5) + 1) : txt.slice(txt.lastIndexOf(',') + 1) : txt;
    }

    sliceFirstTxt(txt: string) {//lastIndexOf
        return (txt.indexOf('.') >= 15) ? txt.slice(0, txt.indexOf('.')) :
            (txt.indexOf(',') >= 15) ? txt.slice(0, txt.indexOf(',')) : txt;
    }

    attachEvents(ul) {
        $(document).on("click", (e) => {
            if (e.target.id == "search_form") {
                e.stopPropagation();
                return false;
            }
            $(ul).hide(); //hide the button
        });

        $("#search_form").on("focus", () => {
            $(ul).show();
        });
    }

    navigatToPage(items, ul) {

        // let parent = ul.parentElement;
        // parent.removeChild(ul);
        console.log(items);
        this.router.navigate([items['link']]);
        $(ul).hide();
    }

    extractProps(customer, delimiters: string[]) {
        let cust = {};
        delimiters.forEach(element => {
            cust[element] = customer[element];
        });
        return cust;
    }

    filterItems(itemsArray: Array<{}>, inputText: string, link?: string) {

        let itemsFounded = [];
        let regex = new RegExp('.*?[\\S.]*?' + inputText + '.*?[,\\.]?$', "gmi");//?(?=\\s)

        itemsArray.forEach(item => {

            Object.keys(item).forEach(itemKey => {

                let foundedItem = (typeof item[itemKey] == "string") ? item[itemKey].match(regex, "gmi") : false;
                if (foundedItem) {
                    let slicedItems = (foundedItem.length > 2) ? foundedItem.slice(0, 2) : foundedItem;
                    let url = (link == "customers") ? (itemKey == "discriptions") ? "/" + link + "/" + item['businessType'] + "/" + item['company'] + "/about" :
                        "/" + link + "/" + item['businessType'] + "/" + item['company'] : (link == "articles") ? "/" + link + "/" + item['id'] : "/" + link;

                    let fd = {
                        match: slicedItems.join('::'),
                        key: inputText,
                        link: url,
                        [itemKey]: item[itemKey]
                    };
                    itemsFounded.push(fd);
                }
            });

        });
        return itemsFounded;
    }

    appendSelashBetweenSpace(text, delimiter?) {
        let str: string;
        delimiter = delimiter ? delimiter : " ";
        text.split(delimiter).forEach(element => {
            (str) ? (element != "") ? str += "-" + element : '' : (element != "") ? str = element : '';
        });
        return str;
    }

    redirect() {
        let splitUrl: any = (this.url.indexOf('halls-events') >= 0) ? this.url.split("/") : false;
        splitUrl = (splitUrl && (splitUrl[1] && splitUrl[2])) ? splitUrl[1] + "/" + splitUrl[2] : (splitUrl && splitUrl[1]) ? splitUrl[1] : "/";
        this.router.navigate([splitUrl]);//, { relativeTo: this.route }
    }
}