
import { Action, createReducer, on } from '@ngrx/store';
import * as CreateUserActions from '../actions/create-user.actions';

export const createUserFeatureKey = 'createUserState';

interface  user{
  statusCode:number,
  rowno:number
}
export interface State {
  user:user;
  error:String;
}

export const initialState: State = {
  user:{
    statusCode:0,
    rowno:0
  },
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

