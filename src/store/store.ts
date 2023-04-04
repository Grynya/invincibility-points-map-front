import { configureStore } from '@reduxjs/toolkit'
import envReducer from "./env.reducer";

export default configureStore({
    reducer: envReducer
})