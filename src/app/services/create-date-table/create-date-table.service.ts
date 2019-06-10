import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateDateTableService {

  eventsOb: Object = {
    events: [//object with all details events go here
    ],
    hasEvents: () => {
      return Object.keys(this.eventsOb['events']).length;
    }
  };

  private callerIns;
  private date: Date = new Date();

  private table:{} = {
    default: {//no collapse functionality
      tHead: []
    },
    ordered: {//with collapse functionality, no crud options
      tHead: ["#", "תאריך", "אירוע"]
    },
    advanced: {//with collapse functionality and crud opt...
      tHead: ["#", "תאריך", "אירוע", "ערוך", "מחק", "סטטוס"]
    }
  };

  private tableType:{} = {};
  
  constructor() { }

  initEvents(eventsList: Array<{}>, caller, tableType?: string) {

    // eventsList.forEach((el: {}) => {console.log(el);});
    if (eventsList) {
      this.callerIns = caller;
      tableType = (tableType)? tableType:  "default";
      this.tableType = {[tableType]: this.table[tableType]};
      
      this.eventsOb['events'] = {};
      for (let ii in eventsList) {
        
        let keyDate:string;
        if(typeof eventsList[ii]['date'] == "string"){
          let splitDate = eventsList[ii]['date'].split('-'),
            splitTime = eventsList[ii]['date'].split(' ')[1].split(':'),
            year = +splitDate[0],
            month = (+splitDate[1] - 1),
            day = +(splitDate[2].split(' ')[0]),

            hour = (+splitTime[0]),
            minutes = (+splitTime[1]),
            seconds = (+splitTime[2]),
            newDate: Date = new Date(year, month, day, hour, minutes, seconds),
            formatedDate = this.dateToStr(newDate);
          keyDate = formatedDate.substring(3);
          // let copyObj = Object.assign({}, eventsList[ii]);
          eventsList[ii]['date'] = newDate;
        }else{
          keyDate = this.numAppendSero(eventsList[ii]['date'].getMonth()+1)+"-"+eventsList[ii]['date'].getFullYear();
        }
        
        (!this.eventsOb['events'][keyDate]) ? this.eventsOb['events'][keyDate] = [] : '';
        this.eventsOb['events'][keyDate].push(eventsList[ii]);
      }
      return this.tabelItems(this.eventsOb['events'], tableType);
    }
  }

  tabelItems(items?: any, tbType?){
    items = items? items: this.eventsOb['events'];
    let rowKeys = items? Object.keys(items): Object.keys(this.eventsOb['events']);
    tbType = tbType? tbType: Object.keys(this.tableType)[0];
    let itemsTable = {};
      rowKeys.forEach((strDate) => {

        let table = this.createTableHead(tbType),
          tBody = this.createElem("DIV");

        tBody.id = "id" +strDate;
        tBody.className = "col-sm-12 pt-3";
        items[strDate].forEach((events, idx) => {
          let row = this.createElem("DIV");
          row = this.createTableBody(row, events, idx, strDate);

          // tBody.id = "id" + this.numAppendSero(events['date'].getMonth() + 1) + "-" + events['date'].getFullYear();
          row.className = "row border-top";
          tBody.appendChild(row);
        });
        table.appendChild(tBody);
        (!itemsTable[strDate]) ? itemsTable[strDate] = {}: '';
        itemsTable[strDate] = table;
      });
      return itemsTable;
  }

  createTableHead(tbType) {
    let table = this.createElem("DIV", (elem) => {
      
      elem.className = "text-right col-sm-12";
      elem.style.diraction = "rtl";
    
      if(this.table[tbType].tHead.length){
        let rowContainer = this.createElem("DIV"),
          divItems = this.createElem("DIV");
          rowContainer.className = "row";
          divItems.className = "col-12 d-flex";
        
          this.tableType[tbType].tHead.forEach(element => {
            let th = this.createElem("DIV");
            th.innerHTML = element;
            th.className = "col";
            divItems.appendChild(th);
          });
          
          rowContainer.appendChild(divItems);
          elem.appendChild(rowContainer);
        }
      
      return elem;
    });
    return table;
  }

  createTableBody(tableRow: HTMLDivElement, events, rowIdx?, parentId?) {
    
    let tableType = Object.keys(this.tableType)[0];

    let definitionList = (tableType == "ordered")? this.ordered(tableRow, events, rowIdx, parentId): 
        (tableType == "advanced")? this.advanced(tableRow, events, rowIdx, parentId):this.default(events);

    tableRow.appendChild(definitionList);
    return tableRow;
  }

  default(events){

    return this.createElem("DIV", (elem) => {
      let accordTarget: HTMLDivElement = <HTMLDivElement>this.createElem("DIV"),
        headTag: HTMLHeadElement = <HTMLHeadElement>this.createElem("H1"),
        pTag: HTMLParagraphElement = <HTMLParagraphElement>this.createElem("P");

      accordTarget.className = "row";

      /* event type */
      headTag.style.fontSize = "1rem";
      headTag.innerHTML = events['eventType'];
      this.eventsDefinitionList(accordTarget, "סוג האירוע:", headTag);

      /* name */
      this.eventsDefinitionList(accordTarget, "שם בעלי האירוע:", events['name']);

      /* date */

      this.eventsDefinitionList(accordTarget, "תאריך האירוע:", this.getEventDayDiscription(events['date']));

      /* location */
      this.eventsDefinitionList(accordTarget, "מיקום/עיר:", events['location']);

      /* description */
      pTag.innerHTML = events['description'];
      this.eventsDefinitionList(accordTarget, "תיאור/הודעה:", pTag);

      elem.appendChild(accordTarget);
      return elem;
    });
  }

  dropDownBtn(currentDate, strRand, rowIdx){
    return this.createElem("BUTTON", (accordBtn) => {
      let caret: HTMLElement = <HTMLDivElement>this.createElem("I");

      accordBtn.innerHTML = currentDate;
      accordBtn.className = (rowIdx === 0)? "col text-right btn btn-link text-success": "col text-right btn btn-link text-success collapsed";

      accordBtn.setAttribute('type', 'button');
      accordBtn.setAttribute('data-toggle', 'collapse');
      accordBtn.setAttribute('data-target', '#' + strRand);
      accordBtn.setAttribute('aria-expanded', (rowIdx === 0)? "true":"false");
      accordBtn.setAttribute('aria-controls', strRand);

      caret.innerHTML = "arrow_drop_down";
      caret.className = "material-icons";

      accordBtn.appendChild(caret);
      return accordBtn;
    });
  }

  ordered(tableRow: HTMLDivElement, events, rowIdx, parentId, collapse?: boolean){
    let strRand = this.randStr();
    
    collapse = collapse? rowIdx: 0;
    /* TABLE TDs */
    this.createElem("DIV", (elem) => {
      elem.innerHTML = rowIdx + 1;
      elem.className = "col p-3";
      tableRow.appendChild(elem);
    });

    let dropBtn = this.dropDownBtn(this.getCurrentDate(events['date']), strRand, rowIdx);
    tableRow.appendChild(dropBtn);

    this.createElem("DIV", (elem) => {
      elem.className = "col text-right p-3";
      elem.innerHTML = this.getEventType(events['eventType']);
      tableRow.appendChild(elem);
    });

    return this.elemToCollapsed(this.default(events), strRand, collapse, parentId);
  }

  advanced(tableRow, events, rowIdx, parentId){

    let orderedList = this.ordered(tableRow, events, rowIdx, parentId, true);

    this.createElem("BUTTON", (elem) => {
      elem.className = "col text-right btn btn-light bg-white text-warning";
      elem.innerHTML = "ערוך";
      this.addEvtToBtn(elem, this.callerIns.addEvents, events);
      tableRow.appendChild(elem);
    });

    this.createElem("BUTTON", (elem) => {
      elem.className = "col text-right btn btn-light bg-white text-danger";
      elem.innerHTML = "מחק";
      this.addEvtToBtn(elem, this.callerIns.delEvents, events);
      tableRow.appendChild(elem);
    });

    this.createElem("BUTTON", (elem) => {
      elem.className = "col text-right btn btn-light text-success";
      elem.innerHTML = "פעיל";
      tableRow.appendChild(elem);
    });
    return orderedList;
  }

  elemToCollapsed(elem, strRand, rowIdx, parentId){
    elem.id = strRand;
    elem.className = (rowIdx === 0)? "col-sm-12 collapse show": "col-sm-12 collapse";
    elem.setAttribute('aria-labelledby', 'heading' + (strRand.slice(0, 1).toUpperCase() + strRand.slice(1, strRand.length)));
    elem.setAttribute('data-parent', '#id' + parentId);
    return elem;
  }

  randStr(){
    let charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      randomPoz = Math.floor(Math.random() * charSet.length),
      randomstring = Math.random().toString(36).slice(-8),
      strRand = charSet.slice(randomPoz, randomPoz + 1).toLowerCase() + randomstring;
      return strRand;
  }

  getCurrentDate(evtDate){
    let days = evtDate.getDate(),
      month = evtDate.getMonth() + 1,
      year = evtDate.getFullYear(),
      currentDate = this.numAppendSero(days) + "-" + this.numAppendSero(month) + "-" + year;
    return currentDate;
  }

  getEventType(event) {
    return (event == "wedding") ? "חתונה" : (event == "bar-mitzvah") ? "בר/בת מצווה" : (event == "hina") ? "חינה" : event;
  }

  createElem(elem: string, cBFn?) {
    let element = document.createElement(elem);
    return cBFn ? cBFn(element) : element;
  }

  getEventDayDiscription(date: Date) {
    let numDayInweek = date.getDay(),
        weekStr: string[] = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
        dayInWeek = weekStr[numDayInweek];
    let msg = ("ביום " + dayInWeek + " בתאריך " + date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " בשעה " +
      date.getHours() + ":0" + date.getMinutes() + " בערב");
    return msg;
  }

  addEvtToBtn(addBtn, fn, events) {
    let thiz = this;
    addBtn.addEventListener("click", () => {
      fn.call(thiz.callerIns, events);
    });
  }

  numAppendSero(date: number): string {
    return (date < 10) ? "0" + date : date.toString();
  }

  eventsDefinitionList(accordTarget: HTMLDivElement, dtElValue: string, ddEl: string | HTMLHeadElement | HTMLParagraphElement) {
    let dt = this.createElem("DT"),
      dd = this.createElem("DD");

    dt.className = "col-sm-3";
    dd.className = "col-sm-9";

    dd.style.marginRight = "0px";
    dt.innerHTML = dtElValue;

    (typeof ddEl == "string") ? dd.innerHTML = ddEl : dd.appendChild(ddEl);

    accordTarget.appendChild(dt);
    accordTarget.appendChild(dd);
  }

  delEvents(event) {
    return this.callerIns(event);
  }

  createEvents() {
    return this.callerIns();
  }

  addEvents(event) {
    return this.callerIns(event);
  }

  dateToStr(date: Date, fullDate?: boolean) {
    let year = date.getFullYear(), 
        month: number | string = date.getMonth() + 1, 
        days: number | string = date.getDate(),
        hours: number | string = date.getHours(),
        minutes: number | string = date.getMinutes();
    (days < 10) ? days = "0" + days : '';
    (month < 10) ? month = "0" + month : month;

    return (!fullDate) ? days + "-" + month + "-" + year : month + "-" + year + " "+ hours+":"+minutes;
  }

  
  noEvents(parent?, msg?){
    let pTag = this.createElem('P'),
      spanTag = <HTMLSpanElement>this.createElem("SPAN");
    msg = msg? msg: "  אין אירועים לחודש זה.";
    spanTag.classList.add("text-danger");
    spanTag.innerHTML = "#.";
    pTag.appendChild(spanTag);
    pTag.innerHTML += msg;
    parent? parent.appendChild(pTag):'';
    return parent? '':pTag;
  }
  
  daily(dateStr?:string){
    let monthYearKey = dateStr? this.sliceMonthYear(dateStr):this.numAppendSero(this.date.getMonth())+"-"+this.date.getFullYear()
    let events = this.eventsOb['events'][monthYearKey];
    console.log(dateStr);
    
    if(events){
      let searchDate = dateStr? this.stripZeros(dateStr): this.date.getDate()+"-"+this.date.getMonth()+"-"+this.date.getFullYear();
      
      let evts = events.filter((evtOb) => evtOb['date'].getDate()+"-"+(evtOb['date'].getMonth()+1)+"-"+evtOb['date'].getFullYear() == searchDate);
      
      let tableEvt = evts.length? this.tabelItems({[searchDate]:evts}): 
          {[searchDate]: this.noEvents(false, "אין אירועים לתאריך: "+searchDate)};
      // this.callerIns.showEvents(tableEvt);
      return tableEvt;
    }
  }
  weekly(dateStr?){
    let monthYearKey = dateStr? this.sliceMonthYear(dateStr):this.numAppendSero(this.date.getMonth()+1)+"-"+this.date.getFullYear();
    
    let events = this.eventsOb['events'][monthYearKey];
    
    console.log(dateStr);
    if(events){
      let stripedZeros = dateStr? this.stripZeros(dateStr): false;
      let currDate = stripedZeros? stripedZeros.split("-")[stripedZeros.split("-").length -1]+"-"+stripedZeros.split("-")[1]+"-"+stripedZeros.split("-")[0]: new Date();
      currDate = typeof currDate == "string"? new Date(currDate): currDate;
      let nextWeekDt = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate());
      nextWeekDt.setDate(currDate.getDate()+7);
      
      let searchDate = currDate.getDate()+"/"+(currDate.getMonth()+1)+ " - "+ nextWeekDt.getDate()+"/"+(nextWeekDt.getMonth() +1);
      let evts = events.filter((evtOb) => evtOb['date'] >= currDate && evtOb['date'] <= nextWeekDt);
      let tableEvt = evts.length? this.tabelItems({[searchDate+"-"+nextWeekDt.getFullYear()]:evts}): 
          {[searchDate]: this.noEvents(false, "אין אירועים בין תאריכים אלה: "+searchDate + " "+nextWeekDt.getFullYear())};
      // this.callerIns.showEvents(tableEvt);
      return tableEvt;
    }
  }

  yearly(yearDateStr?){
    let events = Object.keys(this.eventsOb['events']);
    if(events.length){
      let evts = [];

      events.forEach((evtOb) => {
        this.eventsOb['events'][evtOb].forEach(element => {
          return evts.push(element);
        });
      });
      console.log(evts);
      evts.sort((a, b) => a.date - b.date);
      
      let tableEvt = evts.length? this.tabelItems({[this.date.getFullYear()]:evts}): 
          {[this.date.getFullYear()]: this.noEvents(false, "אין אירועים לשנה זו: "+this.date.getFullYear())};;
      return tableEvt;
    }
  }
  sliceMonthYear(str){
    str = (str.split('-')[1].length <= 1 && +(str.split('-')[1].slice(0,1)) < 10)? "0"+str.split('-')[1]+"-"+str.split('-')[2]:str.split('-')[1]+"-"+str.split('-')[2];
    return str;
  }

  stripZeros(dateStr: string){
    let explodedStr = dateStr.split('-');
    let str: string;
    explodedStr.length? explodedStr.forEach(item => {
        (item.length > 1 && item.slice(0,1) == "0")? str? str += "-"+item.slice(1):str = item.slice(1):str? str += "-"+item:str = item;
      }): str = dateStr;
      return str;
  }
/*
  setNextWeek(num?: number){
    num = num?num: 6;
    this.date.setDate(this.date.getDate()+num);
    return this.date;
  }

   searchDate(date: Date, delimiter: number){
    let dateItem = date['date'].getDate()+"-"+date['date'].getMonth()+"-"+date['date'].getFullYear();
    console.log(date);
    
    this.date = new Date();
    for(let ii = 0; ii < delimiter; ii++){
      this.date.setDate(this.date.getDate()+1);
      let sKey = this.date.getDate()+"-"+this.date.getMonth()+"-"+this.date.getFullYear();
      if(dateItem == sKey) return true;
    }
    return false;
  } */
}
