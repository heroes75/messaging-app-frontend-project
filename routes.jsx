import App from "./src/App";
import Conversations from "./src/Components/Conversations";
import Friendship from "./src/Components/Friendship";
import LoginPage from "./src/Components/LoginPage";
import Messages from "./src/Components/Messages";
import Notifications from "./src/Components/Notification";
import ProfilePage from "./src/Components/ProfilePage";
import SignupPage from "./src/Components/SignupPage";
import Call from "./src/Components/Calls";


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
                        element: <Messages/>,
                        path: ':conversationId',
                        children: [
                            {
                                element: <Call />,
                                path: '/conversation/:conversationId/video'
                            }
                        ]
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