import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { HallType } from 'src/app/customers/hall-type';

@Component({
  selector: 'edit-all-temp',
  templateUrl: './edit-all-temp.component.html',
  styleUrls: ['./edit-all-temp.component.css']
})
export class EditAllTempComponent implements OnInit {
  /*************** customer and form group ********************/
  customer: HallType;
  @Input() formAll: FormGroup;
  @Output() ins: EventEmitter<any> = new EventEmitter<any>();
  childInstans:{};
  /* ************ valadition **************** */
  phoneNum: any = '^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})';
  emailPatteren: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';

  /* **************************** */
  isTrue: Observable<boolean>;
  constructor() { }

  ngOnInit() {}

  childIns(evt){
    this.ins = evt;
  }

}
