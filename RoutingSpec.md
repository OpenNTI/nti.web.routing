# NT Routing

https://reacttraining.com/react-router/

## Static Routing

To make it easier to reuse components in different contexts, it is beneficial to have a static list of the routes.
We can use the static list to determine how to route to different objects in multiple different contexts.

*Example*:

An assignment list item component that is re-used in the course overview and the course assignments list.
In the course overview the list item links to `/assignment/{assignment id}`,
and in the course assignment link to `/{assignment id}`

### Route

#### Definition:

```javascript
Route.for({
	path: '/path/',
	component: cmp,
	routes: [],
	getRouteFor: function(obj) {}
});
```

**path**: (required)
	the path to match for the route, parts can be defined as :name to define route params (https://reacttraining.com/react-router/web/example/url-params)

**component**: (required)
	the component to render when the path is matched. Gets passed the *match* as a prop (https://reacttraining.com/react-router/web/api/match).

**routes**:
	a list of routes under this route, used when determining paths to object

	> if the component statically defines a routes, that will be used

**getRouteFor**:
	a method to get the path for a given object, or null if this route doesn't handle that type of object

### Router

```javascript
Router.for(route1, route2, ...);
```

**route1, route2, etc.**:
	the list of routes to make a router for

returns a class will render the react-router cmps for the routes given.

exposes context methods for getting a route to an object and the current route


