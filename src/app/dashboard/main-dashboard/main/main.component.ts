import { Component, OnInit } from '@angular/core';
import { Subscription, Observable, of, merge, combineLatest, forkJoin, timer, zip } from 'rxjs';
import { ResourcesService } from 'src/app/services/resources/resources.service';
// import { Chart } from 'chart.js';
import { map, filter, finalize, concatAll, mergeAll, mapTo, concat, tap, first, last, takeWhile, take, takeLast, switchAll } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  resources: {} = {};
  chart: any;
  resourceSubscrition: Subscription;
  intervalItems: any;


  /* Chart.js */
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };  
  
  public barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];

  public barChartType = 'bar';

  public barChartLegend = true;  public barChartData = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];

  constructor(private rsrv: ResourcesService) { }

  ngOnInit() {
    let resources = ['users', 'customers', 'articles', 'events', 'forbidden'];// 'forbidden', 'messages', 
    this.getResources(resources);
  }

  getResources(resourcesName: string[]): Observable<{}> | any {

    let num: number = 0;

    resourcesName.forEach(itemsKey => {
      this.rsrv.getResources(itemsKey, false).then(items => {
        this.resources[itemsKey] = (itemsKey == "customers")? this.rsrv.getCustomersItems(items): items;
        num++;
      });
    });
    
    this.intervalItems = setInterval(() => {
      if (num == resourcesName.length) {
        // this.resources = itemsResources;
        this.initChart();
        clearInterval(this.intervalItems);
      }
      // console.log(num, " : ", this.resources);
    }, 500);

  }

  logger(item) {
    console.log(item);
  }

  initChart() {
    let date = new Date(),
      MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      MONTHSHEB = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
      selectedMonth = MONTHSHEB.slice(0, date.getMonth() + 1),
      canvas: HTMLCanvasElement = $("#canvas"),
      itemsKey = Object.keys(this.resources);


    // let dataLine = dt.reduce((total, item) => total = [...total,...itemsKey.map(itemKey => this.resources[itemKey].length)], []);
    console.log("selectedMonth: ", selectedMonth);

    let colors = {
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(120, 162, 235, 1)',
        'rgba(255, 206, 150, 1)',
        'rgba(180, 255, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 244, 1)'
      ]
    };

    let config = {
      type: 'bar',
      data: {
        labels: selectedMonth,
        datasets: []
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Chart.js Line Chart'
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'חודש'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'ערך'
            },
            ticks: {
              min: 0,
              max: 100,
              // forces step size to be 5 units
              stepSize: 5
            }
          }]
        }
      }
    };

    let randomScalingFactor = (num: number) => Math.round(Math.random() * (50 + num));

    itemsKey.forEach((itemKey, idx) => {
      let lenData = this.resources[itemKey]? this.resources[itemKey].length: 20;
      let color = selectedMonth.map(item => [colors.borderColor[idx]]);
      // let month = MONTHSHEB[config.data.labels.length % MONTHSHEB.length];
      // config.data.labels.push(month);
      
      let newDataset = {
        label: itemKey + ' total: ' + lenData,
        backgroundColor: color,
        borderColor: color,
        data: selectedMonth.map(item => randomScalingFactor(lenData)),
        fill: false,
        borderWidth: 1,
      };
      config.data.datasets.push(newDataset);
    });
    // this.chart = new Chart(canvas, config);
  }

  ngOnDestroy() {
    if(this.intervalItems) clearInterval(this.intervalItems);
    // this.resourceSubscrition.unsubscribe();
  }
}
