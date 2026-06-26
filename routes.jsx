import App from "./src/App";
import Conversations from "./src/Components/Conversations";
import Friendship from "./src/Components/Friendship";
import LoginPage from "./src/Components/LoginPage";
import Notifications from "./src/Components/Notification";
import ProfilePage from "./src/Components/ProfilePage";
import SignupPage from "./src/Components/SignupPage";


const routes = [
    {
        element: <App/>,
        path: '/',
        children: [
            {
                element: <Conversations/>,
                path: '/conversation',
                children: [
                    {
                        element: ''
                    }
                ]
            },
            {
                element: <Friendship/>,
                path: '/friendship'
            },
            {
                element: <ProfilePage/>,
                path: 'profile/:profileId'
            },
            {
                element: <Notifications/>,
                path: '/notification'
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