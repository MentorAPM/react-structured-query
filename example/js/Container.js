import React, { Component } from 'react';

import ExampleTable from './ExampleTable';
import { dummyData } from './exampleData';

class Container extends Component {

	render() {
		return (
			<ExampleTable data={data} />
		);
	}
}

export default Container;
