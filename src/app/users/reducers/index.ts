import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from 'src/environments/environment';
import * as fromCreateUser from '../reducer/create-user.reducer';
import * as fromSearchUser from '../reducer/search-user.reducer';


export const adminFeatureKey = 'admin';

export interface State {

  [fromCreateUser.createUserFeatureKey]: fromCreateUser.State;
  [fromSearchUser.searchUserFeatureKey]: fromSearchUser.State;
}

export const reducers: ActionReducerMap<State> = {

  [fromCreateUser.createUserFeatureKey]: fromCreateUser.reducer,
  [fromSearchUser.searchUserFeatureKey]: fromSearchUser.reducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
