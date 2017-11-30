import React from 'react';
import ReactDom from 'react-dom';

import {Router, LinkTo, Route, View} from '../../src';

const TEST_MIME_TYPE = 'test-mime-type';

function Root () {
	return (
		<View.WithTitle title="Cmp Root">
			<div>
				<LinkTo.Path to="/sub">Sub</LinkTo.Path>
				<h1>Root</h1>
			</div>
		</View.WithTitle>
	);
}

function CmpA () {
	return (
		<View.WithTitle title="Cmp A">
			<div>
				<LinkTo.Name name="root">Root</LinkTo.Name>
				<LinkTo.Name name="sub-root">Sub Root</LinkTo.Name>
				<LinkTo.Object object={{MimeType: TEST_MIME_TYPE}}>Object</LinkTo.Object>

				<h2>Nested A</h2>
			</div>
		</View.WithTitle>
	);
}


function CmpB () {
	return (
		<View.WithTitle title="Cmp B">
			<div>
				<LinkTo.Name name="root">Root</LinkTo.Name>
				<LinkTo.Name name="sub-root">Sub Root</LinkTo.Name>

				<h2>Nested B</h2>
			</div>
		</View.WithTitle>
	);
}

function SubCmp () {
	return (
		<View.WithTitle title="Cmp Sub">
			<div>
				<LinkTo.Path to="a">A</LinkTo.Path>
				<LinkTo.Path to="b">B</LinkTo.Path>

				<h2>Sub Root</h2>
			</div>
		</View.WithTitle>
	);
}

const Sub = Router.for([
	Route({path: '/a', component: CmpA}),
	Route({path: '/b', component: CmpB, getRouteFor: (obj) => {
		if (obj.MimeType === TEST_MIME_TYPE) {
			return '/b';
		}
	}}),
	Route({path: '/', component: SubCmp, name: 'sub-root'})
], null);

const Test = Router.for([
	Route({path: '/sub', component: Sub}),
	Route({path: '/', component: Root, name: 'root'})
], null, 'root');

ReactDom.render(
	React.createElement(Test, {}),
	document.getElementById('content')
);
