import React from "react";
import App from './App'
import './css/styles.css'
import { createRoot } from 'react-dom/client';
import store from "./store/store";
import {Provider} from "react-redux";

const root = createRoot(document.getElementById("root")!);
root.render(
    <Provider store={store}>
    <App />
    </Provider>
);