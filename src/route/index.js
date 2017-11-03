import {Route as BaseRoute, Redirect as BaseRedirect} from 'react-router-dom';

import RouteConfig from './RouteConfig';

Route.Path = BaseRoute;
Route.Redirect = BaseRedirect;
export default function Route (config) {
	return new RouteConfig(config);
}

