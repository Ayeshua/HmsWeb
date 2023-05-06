import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	user: {},
	signupMsg: null,
};

export const loginSlice = createSlice({
	name: 'hms_login',
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		},
		setSignupMsg: (state, action) => {
			state.signupMsg = action.payload;
		},
	},
});

export const { setUser, setSignupMsg } = loginSlice.actions;
export default loginSlice.reducer;
