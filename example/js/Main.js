import React, { Component } from 'react';

import ExampleTable from './ExampleTable';
import { dummyData } from './exampleData';

class Main extends Component {

	constructor(props) {
		super(props);

		this.state = {
			data: dummyData().get()
		};
	}

	render() {
		const { data } = this.state;

		return (
			<ExampleTable data={data} />
		);
	}
}

export default Main;
