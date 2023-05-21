import {useEffect, useState} from "react";
import {Navigate, Outlet} from "react-router";
import authService from "../service/AuthService";
import {store} from "../store/store";
import Loading from "../components/Loading";

const ProtectedUserRoute = () => {
    const [state, setState] = useState('loading');

    useEffect(() => {
        (async function () {
            try {
                const token = store.getState().token;
                const user = store.getState().user;
                if (token && user) {
                    const isUserLogged = await authService.isLoggedIn(token.accessToken);
                    setState(isUserLogged && authService.isAdmin(user) ? 'loggedin' : 'redirect');
                }
            } catch {
                setState('redirect');
            }
        })();
    }, []);

    if (state === 'loading') {
        return <Loading/>;
    }
    return state === 'loggedin' ? <Outlet/> : <Navigate to="/login"/>;
}

export default ProtectedUserRoute;