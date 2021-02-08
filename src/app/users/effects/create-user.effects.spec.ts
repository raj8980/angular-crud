import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { CreateUserEffects } from './create-user.effects';

describe('CreateUserEffects', () => {
  let actions$: Observable<any>;
  let effects: CreateUserEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CreateUserEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(CreateUserEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
