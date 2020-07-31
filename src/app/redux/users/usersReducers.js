// Actions Type
const UPDATE_USERS = 'UPDATE_USERS';

// Actions
export const updateUsersAction = (users) => ({
    type: UPDATE_USERS,
    payload: users,
});

// Reducers
export const usersReducer = (state = {users: []}, action) => {
    if (action.type === UPDATE_USERS) 
        return {
            users: action.payload
        };
    return state;
};