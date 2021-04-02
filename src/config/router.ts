import {Route} from "../types/config";
import {test} from "../controllers";
const routes: Array<Route> = [
    {type: "get", path: "/", handler: test}
];
export default routes;
