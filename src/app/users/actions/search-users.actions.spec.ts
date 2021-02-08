import * as fromSearchUsers from './search-users.actions';

describe('loadSearchUserss', () => {
  it('should return an action', () => {
    expect(fromSearchUsers.loadSearchUserss().type).toBe('[SearchUsers] Load SearchUserss');
  });
});
