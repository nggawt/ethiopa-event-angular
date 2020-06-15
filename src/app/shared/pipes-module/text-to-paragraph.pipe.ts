import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textToParagraph'
})
export class TextToParagraphPipe implements PipeTransform {

  transform(value: any, args?: any, args1?: any): any {
    let val = value.replace(/[^\n]\s{2,}/g, " ");
    let txt;
    let matchStr = val.split(',');
    matchStr? matchStr.forEach((text, idx) => {
      if(idx % 3 === 2) text+=",\n\n";
      (txt)? txt += text: txt = text;
    }): txt = value;
    return txt;

    // let regex = new RegExp('\"', "gm");
    // console.log(value.match(new RegExp("(?=,.+,.+, ),", "gm")));
    
    // let matchStr = value.split('.'),
    //     pTag = document.createElement("P");
    // let replaceNewline = value.replace(new RegExp("(?=,.+,.+, ), ", "gm"), ",\n");//.replace('.', '.\n');
    
    /*
    if(args1 == 2){
      // console.log(value);
    } 
    if(matchStr){
      matchStr.forEach((element, idx) => {
        
        if(idx % 3 == 2){
          args.appendChild(pTag);
          pTag = document.createElement("P");
        } 
        if((matchStr.length -1) == idx){
          pTag.innerHTML += element;
          args.appendChild(pTag);
        }else{
          pTag.innerHTML += element+". <br />";
        }
      });
    }else{
      console.log(value);

       // pTag.innerHTML = value;
        //args.appendChild(pTag);
    }*/
  }

}
