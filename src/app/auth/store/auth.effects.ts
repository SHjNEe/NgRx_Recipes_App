import { Actions, ofType, createEffect } from "@ngrx/effects";
import { of, switchMap, map, withLatestFrom } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as AuthActions from "../store/auth.actions";
import { environment } from "src/environments/environment";
import { Effect } from "effect";
import { Router } from "@angular/router";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffect {
  authLogin = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http
          .post<AuthResponseData>(
            "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
              environment.firebaseAPIKey,
            {
              email: authData.payload.email,
              password: authData.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map((resData) => {
              const expirationDate = new Date(
                new Date().getTime() + +resData.expiresIn * 1000
              );
              return new AuthActions.Login({
                email: resData.email,
                userId: resData.localId,
                token: resData.idToken,
                expirationDate: expirationDate,
              });
            }),
            catchError((errorRes) => {
              let errorMessage = "An unknown error occurred!";
              if (!errorRes.error || !errorRes.error.error) {
                return of(new AuthActions.LoginFail(errorMessage));
              }
              switch (errorRes.error.error.message) {
                case "EMAIL_EXISTS":
                  errorMessage = "This email exists already";
                  break;
                case "EMAIL_NOT_FOUND":
                  errorMessage = "This email does not exist.";
                  break;
                case "INVALID_PASSWORD":
                  errorMessage = "This password is not correct.";
                  break;
              }
              return of(new AuthActions.LoginFail(errorMessage));
            })
          );
      })
    );
  });
  authSuccess = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.LOGIN),
        tap(() => {
          this.router.navigate(["/"]);
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
