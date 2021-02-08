import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State} from '../reducer/create-user.reducer';

const getUserFeatureState=createFeatureSelector<State>('createUserState');

export  const getUser=createSelector(
    getUserFeatureState,
    state=>state.user
)

export const getError=createSelector(
    getUserFeatureState,
    state=>state.error
)
