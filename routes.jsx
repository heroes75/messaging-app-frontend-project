import App from "./src/App";
import Conversations from "./src/Conponents/Conversations";
import LoginPage from "./src/Conponents/LoginPage";
import SignupPage from "./src/Conponents/SignupPage";


const routes = [
    {
        element: <App/>,
        path: '/',
        children: [
            {
                element: <Conversations/>,
                path: '/conversation'
            }
        ]

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