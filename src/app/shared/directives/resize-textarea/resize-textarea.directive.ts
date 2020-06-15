import { Directive, HostListener, ElementRef } from '@angular/core';
declare var $:any;
@Directive({
    selector: '[textareaResize]'
})
export class ResizableTextAreaDirective {

    @HostListener('keyup') onkeyup() {
        this.el.nativeElement.style.height = "auto";
        this.updateHeight();
        $(this.el).focus();
        
        var position = this.el.nativeElement.value.search(/[\u0590-\u05FF]/);
        (position === 0 || this.el.nativeElement.value.trim().length === 0)? this.el.nativeElement.offsetParent.setAttribute("dir", "RTL"):this.el.nativeElement.offsetParent.setAttribute("dir", "LTR");
        console.log(position);
    }

    @HostListener('keydown') onkeydown() {
        this.updateHeight();
    }

    constructor(private el: ElementRef) { }

    updateHeight(){
        let offsetheight = this.el.nativeElement.offsetHeight,
            scrolheight = this.el.nativeElement.scrollHeight;
        
        //console.log("offsetheight: ", offsetheight, "scrolheight: ", scrolheight, " height: ", this.el.nativeElement.style.height);
        this.el.nativeElement.style.height = (offsetheight < scrolheight)? scrolheight+ "px": this.el.nativeElement.offsetHeight;
        
    }
}