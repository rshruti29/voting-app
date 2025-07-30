import Register from "./Register"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from "./Login"
import './App.css'
import Dashboard from "./Dashboard"
import { AuthProvider } from "./Authcontext"
import CreatePoll from "./CreatePoll"   

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Register />
        },
        {
            path: "/login",
            element: <Login />
        },
        {
            path: "/dash",
            element: <Dashboard />
        },
         {
            path: "/create",
            element: <CreatePoll/>
        }
    ])

    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    )
}

export default App
