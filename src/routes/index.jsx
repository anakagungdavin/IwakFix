import { createBrowserRouter } from "react-router";
import App from "../App";
import ProdukRoutes from "./produkRoutes";
import RequireAuth from "../utils/requireAuth";

const router = createBrowserRouter([
    {
        path:'/admin',
        element: <RequireAuth/>,
        children: [
            ...ProdukRoutes,
        ]
    },
    {
        path: '/',
        element: <App/>
    }
])
export default router