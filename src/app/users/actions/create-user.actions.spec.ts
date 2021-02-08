import * as fromCreateUser from './create-user.actions';

describe('loadCreateUsers', () => {
  it('should return an action', () => {
    expect(fromCreateUser.loadCreateUsers().type).toBe('[CreateUser] Load CreateUsers');
  });
});
