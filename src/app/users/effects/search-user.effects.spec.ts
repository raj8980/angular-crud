import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { SearchUserEffects } from './search-user.effects';

describe('SearchUserEffects', () => {
  let actions$: Observable<any>;
  let effects: SearchUserEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchUserEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(SearchUserEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
