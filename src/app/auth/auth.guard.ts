import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap, take } from "rxjs/operators";
import { Store } from "@ngrx/store";
import * as fromApp from "../store/app.reducer";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private store: Store<fromApp.AppState>) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.store.select("auth").pipe(
      take(1),
      map((authState) => {
        const user = authState.user;
        const isAuth = !!user;
        if (isAuth) {
          return true;
        }
        return this.router.createUrlTree(["/auth"]);
      })
    );
  }
}
