import { State } from './../reducer/search-user.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { state } from '@angular/animations';

const getSearchUserFeatureState=createFeatureSelector<State>('searchUserState');

export const getUser=createSelector(
    getSearchUserFeatureState,
    state=>state.users
)

export const getError=createSelector(
    getSearchUserFeatureState,
    state=>state.error
)