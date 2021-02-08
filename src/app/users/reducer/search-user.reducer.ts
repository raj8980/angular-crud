

import { Action, createReducer, on } from '@ngrx/store';
import { CreateUserEffects } from '../effects/create-user.effects';
import { user } from '../models/user';
import * as SearchUserActions from '../actions/search-users.actions';
import { SearchUsers } from '../models/searchUsers';


export const searchUserFeatureKey = 'searchUserState';

export interface State {
  users:SearchUsers[];
  error:String;
}

export const initialState: State = {
  users:[],
  error:''
};


export const reducer = createReducer(
  initialState,
  on(SearchUserActions.loadSearchUserss),
  on(SearchUserActions.loadSearchUserssSuccess,(state,check)=>({...state,users:check.data,error:''})), 
  
  on(SearchUserActions.loadSearchUserssFailure,(state,check)=>({...state,users:[],error:check.error}))
);

