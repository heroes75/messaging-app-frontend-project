import App from "./src/App";
import Conversations from "./src/Components/Conversations";
import Friendship from "./src/Components/Friendship";
import LoginPage from "./src/Components/LoginPage";
import SignupPage from "./src/Components/SignupPage";


const routes = [
    {
        element: <App/>,
        path: '/',
        children: [
            {
                element: <Conversations/>,
                path: '/conversation'
            },
            {
                element: <Friendship/>,
                path: '/friendship'
            },
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