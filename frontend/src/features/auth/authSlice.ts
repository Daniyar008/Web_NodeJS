import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type Role = 'student' | 'teacher' | 'parent' | 'institution'

type AuthState = {
    token: string | null
    role: Role | null
}

const initialState: AuthState = {
    token: null,
    role: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signIn(state, action: PayloadAction<{ token: string; role: Role }>) {
            state.token = action.payload.token
            state.role = action.payload.role
        },
        signOut(state) {
            state.token = null
            state.role = null
        },
    },
})

export const { signIn, signOut } = authSlice.actions
export const authReducer = authSlice.reducer
