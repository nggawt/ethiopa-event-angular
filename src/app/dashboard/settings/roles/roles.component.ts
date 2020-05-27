import { Component, OnInit, Input, TemplateRef, ViewChild, ViewContainerRef, ElementRef, Renderer2 } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { Observable } from 'rxjs';
import { filter,tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Admin, AdminUser } from 'src/app/types/admin-type';
import { HelpersService } from 'src/app/services/helpers/helpers.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';


declare var $: any;

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  admin$: Observable<{}>;
  roles: FormGroup;
  user: AdminUser;
  checkBoxChanged: { [key: string]: string } = {};

  num: number = 0;

  /* Hold selected authority object */
  selecteddAuth: {
    id?: number,
    name: string,
    slug: string,
    permissions?: { [key: string]: boolean }, 
    up?: { [key: string]: boolean },
    dl?: { [key: string]: boolean }
  };

  tempRef: any;

  constructor(private http: HttpService, 
    private router: Router, 
    public helpFn: HelpersService,
    private viewContainer: ViewContainerRef, 
    private render: Renderer2,
    private auth: AuthService) { }

  ngOnInit() {

    this.admin$ = this.auth.userObs.pipe(filter(item => typeof item == "boolean" || typeof item == "object"),
      tap(admin => {
        if (admin) {
          this.user = admin.user;
          this.formInit();
        }
      }));
  }

  get f() { return this.roles.controls; }

  private formInit() {
    this.roles = new FormGroup({
      "name": new FormControl(null, [Validators.required, Validators.minLength(3), this.authRoleExisst.bind(this)]),
      'authority': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      "allowed": new FormArray([], [Validators.required])
    });
  }

  authRoleExisst(control: FormControl) {
    let isExisst = false;
    this.user.roles.forEach(element => {
      element.name == control.value ? isExisst = true : '';
    });
    return isExisst ? { name: "authority is exisst" } : null;
  }

  checked(item) {
    item.value = !item.value;
  }

  create(path) {
    this.http.requestUrl = location.pathname;
    localStorage.setItem('url_back', this.http.requestUrl);
    console.log(this.http.requestUrl);
    this.router.navigate([path]);
  }

  protected getFormArray() {
    return (<FormArray>this.roles.get('allowed'));
  }

  newRole(roleAllowed: HTMLInputElement) {
    if (!roleAllowed || roleAllowed.value.length < 2) return;

    if (!this.selecteddAuth.up) this.selecteddAuth.up = {};
    if (!(roleAllowed.value in this.selecteddAuth.up)) {
      this.selecteddAuth.up[roleAllowed.value] = false;
    } else {
      console.log("exisst key: ", roleAllowed.value);
    }
  }


  get hasItems() {
    console.log(this.num++);
    return Object.keys(this.selecteddAuth.up).length ? true : false;
  }

  onSelecedAuthChange(evt) {
    let target: HTMLInputElement | HTMLSelectElement = evt instanceof HTMLInputElement ? evt : evt.target,
      authItems = (this.selecteddAuth && target.value == this.selecteddAuth.name) ? this.selecteddAuth :
        Object.assign({}, this.getAuth(target.value));

    if (Object.keys(authItems).length) {
      authItems['up'] = this.selecteddAuth.up;
      this.selecteddAuth = authItems;
    } else {
      this.newAuth(target);
    }
    this.checkBoxChanged = {};
    console.log(typeof evt, this.selecteddAuth, authItems);
  }

  onCheckChanged(event, authName: string) {
    console.log("called!: ", authName);

    /* isRm = (this.checkBoxChanged[event.target.value] == "rm"),
    inCheckBox = (event.target.value in this.checkBoxChanged), */
    let auth = this.getAuth(authName),
      isUp = (this.checkBoxChanged[event.target.value] == "up"),
      inSelected = (event.target.value in this.selecteddAuth.up),
      authCheck = auth && auth.permissions && (event.target.checked == auth.permissions[event.target.value]);
    if (isUp || authCheck || inSelected) {
      this.checkBoxChanged[event.target.value] = "rm";
      return;
    }

    // let isEquel = auth && auth.permissions && (! authCheck && ! (event.target.value in this.checkBoxChanged));
    if (!authCheck) {
      this.checkBoxChanged[event.target.value] = "up";
      return;
    }
    // this.checkBoxChanged[event.target.value] = "rm";
  }

  getAuth(authName: string) {
    return this.user.roles.find(item => item.name == authName);
  }

  newAuth(target: HTMLInputElement | HTMLSelectElement) {
    this.selecteddAuth = {
      name: target.value,
      slug: target.value,
      permissions: this.selecteddAuth.permissions,
      up: this.selecteddAuth.up
    };
  }

  updateChecked(input: HTMLInputElement){
    let auth = this.getAuth(this.selecteddAuth.name);

    if(! auth || ! (input.value in this.selecteddAuth.permissions)){
      this.selecteddAuth.up[input.value] = ! this.selecteddAuth.up[input.value];
    }else{
      input.checked = this.selecteddAuth.up[input.value];
    } 
  }

  removePermission(permissionName: string, checkBox) {

    let currPerm = this.selecteddAuth.permissions,
      newlPerm = this.selecteddAuth.up;

    if(Object.keys(currPerm).length){
      this.selecteddAuth.dl[permissionName] = true;
      this.selecteddAuth.permissions = this.rmRole(currPerm, permissionName);
    }
    this.selecteddAuth.up = Object.keys(newlPerm).length ? this.rmRole(newlPerm, permissionName) : newlPerm;
    // checkBox.disabled = null;
    console.log("exist permission: ", this.selecteddAuth.permissions, " selected  permission: ", this.selecteddAuth.up);
  }

  rmRole(permissions: { [key: string]: boolean }, permName: string) {

    // delete this.checkBoxChanged[permName];
    return Object.keys(permissions).reduce((ob: {}, obCurr: string) => {
      (obCurr != permName) ? ob[obCurr] = permissions[obCurr] : ob = ob;
      return ob;
    }, {})
  }

  addPermission(checkBox: HTMLInputElement) {

    this.selecteddAuth.up[checkBox.value] = checkBox.checked;
    this.checkBoxChanged[checkBox.value] = "rm";
    checkBox.disabled = true;
    console.log(" selected permission: ", this.selecteddAuth);
  }

  initRoleComponent(data, tempref: TemplateRef<ElementRef>) {
    // temp.createEmbeddedView()
    data['up'] = {};
    data['dl'] = {};
    this.selecteddAuth = Object.assign({}, data);
    this.tempRef = this.viewContainer.createEmbeddedView(tempref);
    let body: HTMLBodyElement = <HTMLBodyElement>document.body;
    let addRolePanel: HTMLDivElement = $("#addRolePanel")[0];
    this.setStyles(addRolePanel, body);

    console.log(data, typeof this.user, this.tempRef, tempref.elementRef.nativeElement);
  }

  setStyles(elem: HTMLDivElement, body) {
    elem.id = this.helpFn.rendId('id');

    // this.render.setStyle(body, "position", 'relative');
    this.render.setStyle(elem, "zIndex", '999');
    this.render.addClass(elem, "position-fixed");
    this.render.addClass(elem, "text-right");
    // this.render.addClass(elem, "mx-auto");
    this.render.setStyle(elem, "top", '10%');
    this.render.setStyle(elem, "width", '35%');
    this.render.setStyle(elem, "margin-right", '35%');
    this.render.insertBefore(body, elem, body.firstElementChild.nextElementSibling);
  }

  revoke() {
    this.viewContainer.clear();
    this.checkBoxChanged = {};
    // $("#addRolePanel")[0].parentElement.removeChild()
    console.log(this.viewContainer.element.nativeElement);
  }

  addRoleItem() {
    console.log("selecteddAuth: ", this.selecteddAuth);
    let upLen = this.selecteddAuth.up && (Object.keys(this.selecteddAuth.up).length),
        dlLen = this.selecteddAuth.dl && (Object.keys(this.selecteddAuth.dl).length);
    if (upLen || dlLen) {
      let auth = this.getAuth(this.selecteddAuth.name), url = "roles";
      if (auth) {
        url = url+"/"+auth.id+"?_method="+ ((upLen + dlLen) > 1? "PUT": "PATCH");
        auth.permissions = { ...this.selecteddAuth.permissions, ...this.selecteddAuth.up };
        // this.selecteddAuth = Object.assign({}, auth);
        let obSend: {} | any = { name: auth.name, slug: auth.slug, permissions: this.selecteddAuth.permissions };
        if(upLen) obSend.up = this.selecteddAuth.up;
        if(dlLen) obSend.dl = this.selecteddAuth.dl;

        console.log(auth, obSend);
        this.send(url, obSend);
      } else {
        // this.selecteddAuth.permissions = this.selecteddAuth.up;
        auth = { name: this.selecteddAuth.name, slug: this.selecteddAuth.slug, permissions: this.selecteddAuth.up };
        this.user.roles.push(auth);

        this.send(url, auth);
      }
    }

    this.revoke();
  }

  updateRole(auth: {} | any, permission: {} | any, method: string){
    console.log(auth, permission);
    let obSend: {} | any = { name: auth.name, slug: auth.slug, [method]: {[permission.key]: permission.value} };
    let url = "roles/"+auth.id+"?_method="+ "PATCH";
    this.send(url, obSend);
  }

  send(url, auth){
    this.http.store(url, auth).
        subscribe((response: any) => {
          console.log(response);
          this.selecteddAuth = response;
        }, (err) => console.log(err));
  }
}
