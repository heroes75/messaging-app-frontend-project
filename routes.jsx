import App from "./src/App";
import LoginPage from "./src/Conponents/LoginPage";
import SignupPage from "./src/Conponents/SignupPage";


const routes = [
    {
        element: <App/>,
        path: '/'
    },
    {
        path: '/signup',
        element: <SignupPage />
    },
    {
        path: '/login',
        element: <LoginPage/>
    }
]

export default routes