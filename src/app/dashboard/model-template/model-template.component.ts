import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'model-template',
  templateUrl: './model-template.component.html',
  styleUrls: ['./model-template.component.css']
})
export class ModelTemplateComponent implements OnInit {
  @Input() testBuzzi = "buzzi";
  constructor() { }

  ngOnInit() {
  }

}
