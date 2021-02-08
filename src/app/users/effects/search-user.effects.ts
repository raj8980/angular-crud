import { UsersService } from './../services/users.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as searchUserActions from '../actions/search-users.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';



@Injectable()
export class SearchUserEffects {
  constructor(private actions$: Actions,private usersService:UsersService) {}

  @Effect()
  loadSearchUsers$:Observable<Action>=this.actions$.pipe(
    ofType(searchUserActions.loadSearchUserss),
    mergeMap(
      action=>this.usersService.searchUserDetails("").pipe(
        map(users=>(searchUserActions.loadSearchUserssSuccess({data:users}))),
        catchError(err=>of(searchUserActions.loadSearchUserssFailure({error:err})))
      )
    )
  )
}
