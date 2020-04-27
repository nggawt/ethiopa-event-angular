import { Directive, HostListener, ElementRef } from '@angular/core';
@Directive({
    selector: '[textareaResize]'
})
export class ResizableTextAreaDirective {

    @HostListener('keyup') onkeyup() {
        this.el.nativeElement.style.height = "auto";
        this.updateHeight();
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