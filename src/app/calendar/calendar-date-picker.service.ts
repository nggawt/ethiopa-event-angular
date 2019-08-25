import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class CalendarDatePickerService {

  private date: Date = new Date();
  private currentDate: Date = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());

  private months: HTMLTableElement[] = [];
  private monthStr: string[] = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
  public weekStr: string[] = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];


  private monthCounter: number = this.date.getMonth();


  private fired: boolean = false;
  private dayOfYear: number = 0;
  private classListToggler: {
    item: HTMLSpanElement,
    name: string[]
  }[] = [];

  /* HTML ELEMENTS */
  private input: HTMLInputElement;

  private datepickrContainer: HTMLDivElement;
  private divNavYears: HTMLDivElement;
  private divNavMonth: HTMLDivElement;

  private table: HTMLTableElement;
  private tableHead: HTMLTableHeaderCellElement;
  private tableTr: HTMLTableRowElement;

  private spanNextYear: HTMLSpanElement;
  private spanPrevYear: HTMLSpanElement;
  private spanPrev: HTMLSpanElement;
  private spanNext: HTMLSpanElement;
  private closeBtn: HTMLSpanElement;
  private spanCurrentMonth: HTMLSpanElement;

  private buttonDropdown: HTMLButtonElement;
  callerInstans;
  formEvents;

  constructor() { }

  createElem(elem: string) { return document.createElement(elem); };

  getCurrentDate() {
    return this.currentDate;
  }

  createHtms(elem: HTMLInputElement, append?) {

    this.input = elem;
    let divMonth: HTMLDivElement = <HTMLDivElement>this.createElem("DIV"),
      divNav: HTMLDivElement = <HTMLDivElement>this.createElem("DIV");

    this.datepickrContainer = <HTMLDivElement>this.createElem('DIV');
    this.divNavYears = <HTMLDivElement>this.createElem('DIV');
    this.divNavYears.className = "dropdown-menu dropdown-custom clearfix position-relative";
    this.divNavYears.style.top = "auto";

    this.divNavMonth = <HTMLDivElement>this.createElem('DIV');
    this.divNavMonth.className = "dropdown-menu dropdown-custom clearfix position-relative";
    this.divNavMonth.style.top = "auto";

    this.table = <HTMLTableElement>this.createElem("TABLE");
    this.tableHead = <HTMLTableHeaderCellElement>this.createElem("THEAD");
    this.tableTr = <HTMLTableRowElement>this.createElem("TR");

    this.spanNextYear = <HTMLSpanElement>this.createElem("span");
    this.spanPrevYear = <HTMLSpanElement>this.createElem("span");

    this.buttonDropdown = <HTMLButtonElement>this.createElem("BUTTON");
    this.buttonDropdown.className = "btn btn-secondary btn-sm dropdown-toggle";
    this.buttonDropdown.setAttribute('data-toggle', "dropdown");
    this.buttonDropdown.setAttribute('aria-haspopup', "true");
    this.buttonDropdown.setAttribute('aria-expanded', "false");
    this.buttonDropdown.setAttribute('type', "button");
    this.buttonDropdown.innerHTML = this.currentDate.getFullYear() + " ";


    this.spanCurrentMonth = <HTMLButtonElement>this.createElem("BUTTON");
    this.spanCurrentMonth.className = "btn btn-secondary btn-sm dropdown-toggle";
    this.spanCurrentMonth.setAttribute('data-toggle', "dropdown");
    this.spanCurrentMonth.setAttribute('aria-haspopup', "true");
    this.spanCurrentMonth.setAttribute('aria-expanded', "false");
    this.spanCurrentMonth.setAttribute('type', "button");
    this.spanCurrentMonth.innerHTML = this.currentDate.getFullYear() + " ";

    let spanBtn = <HTMLSpanElement>this.createElem("span");
    spanBtn.className = "sr-only";
    this.buttonDropdown.appendChild(spanBtn);

    this.spanPrev = <HTMLSpanElement>this.createElem("span");
    this.spanNext = <HTMLSpanElement>this.createElem("span");
    this.closeBtn = <HTMLSpanElement>this.createElem("span");

    this.datepickrContainer.className = "datepickr-calendar w-100";
    this.datepickrContainer.id = "datepicker";

    divNav.className = "col-sm-12 datepickr-year clearfix";
    divNav.id = "myDropdown";
    divMonth.className = "col-sm-12 datepickr-months clearfix";

    this.spanNextYear.className = "datepickr-prev-year btn btn-success btn-xs float-right";
    this.spanNextYear.innerHTML = "<bold>&rArr;</bold>";

    this.spanPrevYear.className = "datepickr-prev-year btn btn-success btn-xs float-left";
    this.spanPrevYear.innerHTML = "<bold>&lArr;</bold>";


    this.spanPrev.className = "datepickr-prev-month";
    this.spanPrev.innerHTML = "<bold>&lArr;</bold>";

    this.spanNext.className = "datepickr-next-month";
    this.spanNext.innerHTML = "<bold>&rArr;</bold>";

    this.spanCurrentMonth.className = "btn btn-primary btn-xs datepickr-current-month";
    this.closeBtn.innerHTML = "X";
    this.closeBtn.className = "btn font-weight-bold text-danger btn-xs pull-left";

    this.tableHead.appendChild(this.tableTr);
    this.table.appendChild(this.tableHead);

    divNav.appendChild(this.spanPrevYear);
    divNav.appendChild(this.buttonDropdown);
    divNav.appendChild(this.spanNextYear);
    divNav.appendChild(this.divNavYears);

    divMonth.appendChild(this.spanPrev);
    divMonth.appendChild(this.spanNext);
    divMonth.appendChild(this.spanCurrentMonth);
    divMonth.appendChild(this.divNavMonth);

    this.datepickrContainer.appendChild(divNav);
    this.datepickrContainer.appendChild(divMonth);
    this.datepickrContainer.appendChild(this.table);
    this.datepickrContainer.appendChild(this.closeBtn);

    if (append && append.append) {
      elem.parentElement.parentElement.appendChild(this.datepickrContainer);
      // this.toggleDisplay();
    }
  }

  fire(callerIns, formEvents?:FormGroup | boolean, input?: HTMLInputElement) {//theYear,len,theMonth
    let theYear = this.date.getFullYear(),
      theMonth = this.date.getMonth(),
      len = this.monthStr.length;

    callerIns ? this.callerInstans = callerIns : '';
    formEvents ? this.formEvents = formEvents : '';

    if (true) {// ! this.fired
      input ? this.createHtms(input) : '';
      this.getYearlyDates(theYear, len, theMonth);
      this.looper(0, this.weekStr, this.appendThead);
      this.looper(0, 10, this.navYears, () => { });
      this.looper(0, this.monthStr.length - 1, this.navMonth, () => { });

      this.setEvents();

      this.fired = true;
      return this.datepickrContainer;
    }
  }


  setEvents(): void {
    let thiz = this;

    this.spanPrev.addEventListener('click', () => {
      thiz.prevMonth();
    }, false);

    this.spanNext.addEventListener('click', () => {
      thiz.nextMonth();
    }, false);

    /* this.input.addEventListener('click', () => {
      thiz.toggleDisplay();
    }, false); */

    this.spanNextYear.addEventListener('click', () => {
      thiz.nextYear();
    }, false);

    this.spanPrevYear.addEventListener('click', () => {
      thiz.prevYear();
    }, false);


    this.closeBtn.addEventListener('click', (e) => {

      let spanEl: HTMLSpanElement = <HTMLSpanElement>e.target;
      if (spanEl.tagName === "SPAN") {
        //createCalendar.updateItems(e.target.innerHTML);
        // thiz.datepickrContainer["style"].display = "none";
        // thiz.toggleDisplay();
      }
    }, false);
  }


  appendThead(arg: any) {

    let th = this.createElem("TH");
    if (typeof arg == 'function') {
      arg(1);

    } else {
      th.innerHTML = arg;
      this.tableTr.appendChild(th);
    }
  }

  appendCh(parent, child) {
    parent.appendChild(child);
  }


  getYearlyDates(theYear: number, len?: number | boolean, month?: number) {

    len = len ? len : this.monthStr.length;

    if (theYear && typeof theYear === "number" && theYear.toString().length === 4) {
      this.currentDate.setFullYear(theYear);
    } else {
      return false;
    }

    for (let ii = 0; ii < len; ii++) {//for loop
      this.currentDate.setMonth(ii);
      this.currentDate.setDate(1);
      this.months[ii] = this.yearlyItems(1, this.getTotalDays());
    }//end for loop

    month = (month || (month === 0)) ? month : 0;

    (theYear !== this.date.getFullYear()) ? this.updateDate(theYear, month, 1) : this.updateDate(false, month, false);


    this.table.appendChild(this.months[month]);
    this.spanCurrentMonth.innerHTML = this.monthStr[month] + " " + this.currentDate.getFullYear();
  }

  getTotalDays(year?, month?) {
    year = year ? year : this.currentDate.getFullYear();
    month = month || month === 0 ? month : this.currentDate.getMonth() + 1;
    return new Date(year, this.currentDate.getMonth() + 1, 0).getDate();
  }

  markDays(span) {

    let totalDays = this.getTotalDays(),
      day = (isNaN(+span.innerHTML) || (span.innerHTML.length > 2) || (span.innerHTML.trim() == "") ||
        (+span.innerHTML) > totalDays || (+span.innerHTML) < 1) ? this.currentDate.getDate() : +span.innerHTML;

    let matches = this.getItemClass(span);

    if (matches.length) span.className = span.className.replace(new RegExp(matches.join('|'), "g"), '');

    span.classList.add("bg-warning");

    if (this.classListToggler.length) {

      (this.classListToggler[0]['name'].length) ? this.classListToggler[0]['item'].className =
        this.classListToggler[0]['item'].className.replace("bg-warning", this.classListToggler[0]['name'].join(' ')) :
        this.classListToggler[0]['item'].classList.remove('bg-warning');
        this.classListToggler.shift();
    }

    this.classListToggler.push({
      item: span,
      name: matches.length ? matches : []
    });
    console.log(day);
    let fullDates: string = day + "-" + (this.currentDate.getMonth() + 1) + "-" + this.currentDate.getFullYear();
    if (this.callerInstans) this.callerInstans.daily(fullDates);
    this.currentDate.setDate(day);
    let dt = this.updateItems();
    (this.formEvents) ? this.formEvents.controls['date'].setValue(dt) : '';
  }

  getItemClass(item, patteren?) {
    let regex = new RegExp(patteren || /\bbg[-\w]+\b/, 'g');
    let matches = [];
    let checker;

    while ((checker = regex.exec(item.className)) !== null) {
      matches.push(checker[0]);
    }
    return matches;
  }

  yearlyItems(index, len): HTMLTableElement {

    let tRow = <HTMLTableRowElement>this.createElem("TR"),
      tBody = <HTMLTableElement>this.createElem("TBODY"),
      thiz = this,
      firstDayOfCurrentMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1),
      endDayOfLastMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0),
      numWeek: number = firstDayOfCurrentMonth.getDay();
    let isNowDate = (this.checkMonth(this.currentDate.getMonth()) && this.checkYear(this.currentDate.getFullYear()));

    for (; index <= len; index++) {

      let td = this.createElem("TD"),
        span = <HTMLSpanElement>this.createElem("span");
      span.className = "datepickr-day";
      span.innerHTML = index;
      if (isNowDate && index == this.date.getDate()) span.className += " font-weight-bold text-center bg-success text-light";
      this.appendCh(td, span);

      span.addEventListener("click", function () {
        thiz.markDays(this);
      });

      if (index == 1) {
        let currentDay = endDayOfLastMonth.getDate(),
          resualt = (currentDay - numWeek);
        this.createOffsetDays(resualt, currentDay, tRow, false);
      }

      if (numWeek == 7) {
        tRow = <HTMLTableRowElement>this.createElem("TR");
        numWeek = 0;
      }
      numWeek++;
      this.appendCh(tRow, td);
      this.appendCh(tBody, tRow);

      if (index == len) {
        this.createOffsetDays(0, (42 - firstDayOfCurrentMonth.getDay() - len), tRow, (row: HTMLTableRowElement) => this.appendCh(tBody, row));
      }

    }//END FOR LOOP
    return tBody;
  }

  createOffsetDays(index, len, tRow, fn) {

    let weekOfEndDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.getTotalDays()).getDay() + 1;

    for (; index < len; index++) {
      let tdd = this.createElem("TD"),
        span = <HTMLSpanElement>this.createElem("span"),
        idxVal = index + 1;
      span.className = "datepickr-day text-light bg-secondary";
      span.style.cursor = "default";
      span.style.border = "none";
      span.style.opacity = ".2";
      span.innerHTML = idxVal;

      this.appendCh(tdd, span);

      if (fn && weekOfEndDay == 7) {
        tRow = this.createElem("TR");
        weekOfEndDay = 0;
      }
      weekOfEndDay++;
      this.appendCh(tRow, tdd);
      (fn) ? fn(tRow) : '';
    }
  }

  navYears(inc?) {
    let years = this.currentDate.getFullYear() + inc,
      lYears = this.createElem("LI"),
      thiz = this;
    lYears.innerHTML = years;
    lYears.className = "dropdown-item float-right d-inline-block";
    lYears.style.width = "auto";
    lYears.style.cursor = "pointer";
    lYears.style.clear = "left";

    this.divNavYears.appendChild(lYears);

    lYears.addEventListener("click", function () {
      thiz.searchByYear(years);
    });
    // this.getYearlyDates(years,this.monthStr, this.monthCounter);
  }

  navMonth(inc: number) {
    let month = inc + 1,
      liMonths = this.createElem("LI"),
      thiz = this;
    liMonths.innerHTML = month.toString();
    liMonths.className = "dropdown-item float-right d-inline-block";
    liMonths.style.width = "auto";
    liMonths.style.cursor = "pointer";
    liMonths.style.clear = "left";

    this.divNavMonth.appendChild(liMonths);
    // console.log(this.divNavMonth);

    liMonths.addEventListener("click", function () {

      thiz.removeTable();
      thiz.updateDate(null, (month - 1), null);

      thiz.table.appendChild(thiz.months[(month - 1)]);
      thiz.spanCurrentMonth.innerHTML = thiz.monthStr[(month - 1)] + " " + thiz.currentDate.getFullYear();

      thiz.monthCounter = (month - 1);
      thiz.updateItems();
    });
  }

  searchByYear(year) {
    this.getYearlyDates(year, 12, 0);
    this.removeTable();
  }

  looper(index, lenOb, fn, param1?) {

    let number = (typeof lenOb === "number") ? lenOb : null,
      arr = (Array.isArray(lenOb)) ? lenOb.length - 1 : null,
      lent = number || arr;

    for (index; index <= lent; index++) {
      if (typeof param1 == 'function') {

        fn.call(this, index);
      } else {
        fn.call(this, lenOb[index]);
      }
    }
  }

  checkYear(theYear) {
    return this.date.getFullYear() === theYear;
  }

  checkMonth(month) {
    return this.date.getMonth() === month;
  }

  checkDay(day) {
    return this.date.getDate() === day;
  }

  updateDate(theYear?, theMonth?, theDay?) {
    let monthAndYearCheck = this.checkMonth(theMonth || this.currentDate.getMonth()) && this.checkYear(theYear || this.currentDate.getFullYear());

    /* *** display full dates if month and year are same is same as now *** */
    (theMonth && monthAndYearCheck) ? this.currentDate.setDate(this.date.getDate()) : this.currentDate.setDate(theDay || 1);

    /* *** year, month, and days setters *** */
    (theYear) ? this.currentDate.setFullYear(theYear) : '';
    (theMonth || (theMonth === 0)) ? this.currentDate.setMonth(theMonth) : "";
    (theDay) ? this.currentDate.setDate(theDay) : '';

    this.monthCounter = this.currentDate.getMonth();

    this.updateItems();
    console.log(theYear, theMonth, theDay);
  }

  updateCalendar(theYear, theMonth, theDay) {
    this.currentDate.setFullYear(theYear);
    this.currentDate.setMonth(theMonth);
    this.currentDate.setDate(theDay);

    this.updateDate(theYear, theMonth, theDay);
    this.removeTable();
    this.table.appendChild(this.months[theMonth]);
  }

  updateItems() {
    // valadite 

    // format date
    let fullDates = this.formatedDate();
    // this.input.focus();
    // this.input.value = fullDates;
    this.spanCurrentMonth.innerHTML = this.monthStr[this.monthCounter] + " " + this.currentDate.getFullYear();
    return fullDates;
  }

  formatedDate(year?, month?, days?) {

    year = year ? year : this.currentDate.getFullYear();
    month = month ? (month + 1) : this.currentDate.getMonth() + 1;
    month = (month < 10) ? "0" + month : month;

    days = days ? days : this.currentDate.getDate();
    days = days < 10 ? "0" + days : days;
    this.buttonDropdown.innerHTML = year + " ";

    return (days) + "-" + (month) + "-" + (year);
  }


  nextYear(inc?) {
    inc = inc ? inc : 1;
    this.getYearlyDates(this.currentDate.getFullYear() + inc, null);
    this.removeTable();
    if (this.callerInstans) this.callerInstans.showEvents();
  }

  prevYear(inc?) {
    inc = inc ? inc : 1;
    this.getYearlyDates(this.currentDate.getFullYear() - inc, null);
    this.removeTable();
    if (this.callerInstans) this.callerInstans.showEvents();
  }

  removeTable() {
    this.table.removeChild(this.table.children[1]);
  }

  prevMonth() {

    this.monthCounter--;
    // console.log("prev monthCounter fn: " + this.monthCounter);

    if (this.monthCounter < 0) {

      this.monthCounter = 11;
      this.getYearlyDates(this.currentDate.getFullYear() - 1, false, this.monthCounter);
      // this.spanCurrentMonth.innerHTML = this.monthStr[this.monthCounter] + " " + this.currentDate.getFullYear();
      this.removeTable();
      // this.updateItems();
      if (this.callerInstans) this.callerInstans.showEvents();
      return;
    }
    this.updateDate(null, this.monthCounter, null);
    this.table.appendChild(this.months[this.monthCounter]);
    this.removeTable();
    if (this.callerInstans) this.callerInstans.showEvents();
    // this.updateItems();
  }

  nextMonth() {

    this.monthCounter++;
    // console.log("next monthCounter fn: " + this.monthCounter);

    if (this.monthCounter > 11) {

      this.monthCounter = 0;
      this.getYearlyDates(this.currentDate.getFullYear() + 1, null, this.monthCounter);
      // this.spanCurrentMonth.innerHTML = this.monthStr[this.monthCounter] + " " + this.currentDate.getFullYear();
      this.removeTable();
      // this.updateItems();
      if (this.callerInstans) this.callerInstans.showEvents();
      return;
    }
    this.table.appendChild(this.months[this.monthCounter]);
    this.updateDate(null, this.monthCounter, null);
    this.removeTable();
    if (this.callerInstans) this.callerInstans.showEvents();
    // this.updateItems();
  }
}
