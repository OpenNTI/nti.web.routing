import React from 'react';
import ReactDom from 'react-dom';

import {Router, LinkTo, Route} from '../../src';

function Links () {
	return (
		<div>
			<LinkTo.Path to="/a">A</LinkTo.Path>
			<LinkTo.Path to="/b">B</LinkTo.Path>
		</div>
	);
}

function CmpA () {
	return (
		<div>
			<Links />
			<span>Component A</span>
		</div>
	);
}

function CmpB () {
	return (
		<div>
			<Links />
			<span>Component B</span>
		</div>
	);
}

const Test = Router.for(
	Route({path: '/a', component: CmpA}),
	Route({path: '/b', component: CmpB})
);

ReactDom.render(
	React.createElement(Test, {}),
	document.getElementById('content')
);
