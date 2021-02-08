import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { UsersService } from './../services/users.service';
import { Injectable } from '@angular/core';
import * as createUserActions from '../actions/create-user.actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';



@Injectable()
export class CreateUserEffects {



  constructor(private actions$: Actions , private usersService:UsersService) {}
  @Effect()
  loadUsers$: Observable<Action> = this.actions$.pipe(
    ofType(createUserActions.loadCreateUsers),
    mergeMap(
      action=>this.usersService.saveUserDetails(action.form).pipe(
        map(users=>(createUserActions.loadCreateUsersSuccess({data:users}))),
        catchError(err=>of(createUserActions.loadCreateUsersFailure({error:err})))
      )
    )
  );
}
