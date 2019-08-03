import { Directive, ViewContainerRef, OnInit, TemplateRef } from '@angular/core';

@Directive({
  selector: '[add-component]'
})
export class AddComponentDirective implements OnInit {

  constructor(public tempRef: TemplateRef<any>, public viewCont: ViewContainerRef ) { }

  ngOnInit(){}

}
