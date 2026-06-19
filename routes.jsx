import App from "./src/App";
import SignupPage from "./src/Conponents/SignupPage";


const routes = [
    {
        element: <App/>,
        path: '/'
    },
    {
        path: '/signup',
        element: <SignupPage />
    }
]

export default routes