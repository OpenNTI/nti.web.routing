import React from 'react';
import ReactDom from 'react-dom';

import {Router, LinkTo, Route} from '../../src';

function Root () {
	return (
		<div>
			<LinkTo.Path to="/sub">Sub</LinkTo.Path>
			<h1>Root</h1>
		</div>
	);
}

function CmpA () {
	return (
		<div>
			<LinkTo.Name name="root">Root</LinkTo.Name>
			<LinkTo.Name name="sub-root">Sub Root</LinkTo.Name>

			<h2>Nested A</h2>
		</div>
	);
}


function CmpB () {
	return (
		<div>
			<LinkTo.Name name="root">Root</LinkTo.Name>
			<LinkTo.Name name="sub-root">Sub Root</LinkTo.Name>

			<h2>Nested B</h2>
		</div>
	);
}

function SubCmp () {
	return (
		<div>
			<LinkTo.Path to="a">A</LinkTo.Path>
			<LinkTo.Path to="b">B</LinkTo.Path>

			<h2>Sub Root</h2>
		</div>
	);
}

const Sub = Router.for(
	Route({path: '/a', component: CmpA}),
	Route({path: '/b', component: CmpB}),
	Route({path: '/', component: SubCmp, name: 'sub-root'})
);

const Test = Router.for(
	Route({path: '/sub', component: Sub}),
	Route({path: '/', component: Root, name: 'root'})
);

ReactDom.render(
	React.createElement(Test, {}),
	document.getElementById('content')
);
