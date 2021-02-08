import { createAction, props } from '@ngrx/store';
import { SearchUsers } from '../models/searchUsers';


export const loadSearchUserss = createAction('[SearchUsers] Load SearchUserss');

export const loadSearchUserssSuccess = createAction('[SearchUsers] Load SearchUserss Success',props<{ data: SearchUsers[]}>());

export const loadSearchUserssFailure = createAction('[SearchUsers] Load SearchUserss Failure',props<{ error: string }>());
