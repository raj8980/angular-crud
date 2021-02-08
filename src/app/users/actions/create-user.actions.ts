import { success } from './../models/success';
import { createAction, props } from '@ngrx/store';

export const loadCreateUsers = createAction('[CreateUser] Load CreateUsers',props<{form:Object}>());

export const loadCreateUsersSuccess = createAction('[CreateUser] Load CreateUsers Success',props<{ data: Object }>());

export const loadCreateUsersFailure = createAction('[CreateUser] Load CreateUsers Failure',props<{ error: String }>());
