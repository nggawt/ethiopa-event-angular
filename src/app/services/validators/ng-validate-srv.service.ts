import { Injectable } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class NgValidateSrvService {

  constructor() { }

  validateSize(control): { [key: string]: string } | null {//{ [key: string]: string } | null
    // { files_size: "file size " + this.formatBytes(control.value.size) + " to big." }
    // console.log(control);
    return (Math.round(control.value.size / Math.pow(1024, 2)) > 6) ? { files_size: "file size " + this.formatBytes(control.value.size) + " to big." } : null;
  }

  validateExisst(control): { [key: string]: string } | null {
    return control.value.exisst ? { files_exisst: "file exisst in our system." } : null;
  }

  protected formatBytes(a) {
    if (0 === a) return "0 Bytes";
    var
      c = 1024,
      d = 2,
      e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + e[f];
  }

  validateType(control): { [key: string]: string } | null {
    let videoType = ['video/3gpp', 'video/H261', 'video/H263', 'video/H264', 'video/JPEG', 'video/mp4', 'video/mpeg'];
    let imageType = ['image/jpeg', 'image/png', 'image/gif'];

    let typeName = control.value.type.split('/')[0];
    let typeVal = (typeName == "image") ? imageType.indexOf(control.value.type) :
      (typeName == "video") ? videoType.indexOf(control.value.type) : false;
    let trueOrFalse: boolean = (typeVal == -1);
    let msg: string = "סוג הקובץ לא תקף " + control.value.name + " " + control.value.type;
    return trueOrFalse ? { file_type: msg } : null;
  }

  valLen(target, control): { [key: string]: {} } {
    const validLen = (target == "images") ? (control.value.length >= 3 && control.value.length < 12) : (control.value.length == 1);
    return !validLen ? { 'invalidLength': control.value.length + " length of " + target + " items is invalid" } : null;
  }

  unchange(iteVal: string, control: FormControl) {
    return (control.value === iteVal) ? { ['unchane']: true } : null;
  }

  getValidatedItems(formItems: FormGroup) {
    let controls = formItems.controls,
      valItems = { gallery: {}, inputs: {} },
      galleryKeys = ['images', 'video', 'loggo'];

    Object.keys(controls).forEach(keyName => {
      /* if galleries set gallery items else set valid inputs items */
      let galObj = (galleryKeys.indexOf(keyName) >= 0) ? this.mapValidated(keyName, formItems) : [];

      (galObj.length) ? valItems['gallery'][keyName] = galObj : controls[keyName].valid ? valItems['inputs'][keyName] = controls[keyName].value : '';
    });
    return valItems;
  }

  protected mapValidated(keyName, formItems: FormGroup) {
    return (<FormArray>formItems.get(keyName)).controls.filter(item => item.valid).map(item => item.value);
  }
}
