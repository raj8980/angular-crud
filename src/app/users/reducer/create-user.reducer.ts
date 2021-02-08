import { success } from './../models/success';
import { user } from './../models/user';
import { Action, createReducer, on } from '@ngrx/store';
import * as CreateUserActions from '../actions/create-user.actions';

export const createUserFeatureKey = 'createUserState';

export interface State {
  user:Object;
  error:String;
}

export const initialState: State = {
  user:'',
  error:''
};


export const customReducer = createReducer(
  initialState,
  on(CreateUserActions.loadCreateUsers),
  on(CreateUserActions.loadCreateUsersSuccess,(state,check)=>({...state,users:check.data,error:''})),
  on(CreateUserActions.loadCreateUsersFailure,(state,check)=>({...state,users:'',error:check.error})),
);

export function reducer(state: State | undefined, action: Action): any {
  return customReducer(state, action);
}

