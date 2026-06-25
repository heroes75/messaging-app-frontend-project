import App from "./src/App";
import Conversations from "./src/Components/Conversations";
import Friendship from "./src/Components/Friendship";
import LoginPage from "./src/Components/LoginPage";
import ProfilePage from "./src/Components/ProfilePage";
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
            {
                element: <ProfilePage/>,
                path: 'profile/:ProfileId'
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