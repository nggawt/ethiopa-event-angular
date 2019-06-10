import { Observable } from 'rxjs';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export interface CanDeactivateComponent {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
export class CanDeactivateGuardService implements CanDeactivate<CanDeactivateComponent> {

  canDeactivate(component: CanDeactivateComponent, currRute: ActivatedRouteSnapshot,
                currState: RouterStateSnapshot, nextState?: RouterStateSnapshot):
                Observable<boolean> | Promise<boolean> | boolean {
      return component.canDeactivate();
  }
}
