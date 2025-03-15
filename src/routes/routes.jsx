import Layout from "../components/Layout";
import Home from "../pages/Home";


const routes = [
{
    path: '/',
    element:<Layout/>,
    Children:[
        {
            path: '/',
            element:<Home/>
        },{
          
        }
    ]
}
]

export default routes;