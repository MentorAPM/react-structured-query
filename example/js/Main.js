import React, { Component } from 'react';

import ExampleTable from './ExampleTable';
import { dummyData } from './exampleData';

class Main extends Component {

	constructor(props) {
		super(props);

		this.state = {
			data: dummyData()
		};
	}

	onTokenAdd = (searchTokens) => {
		const query = searchTokens.map(token => {
			return { [token.id]: { [token.operator]: token.value } };
		});

		this.setState({
			data: dummyData(query)
		});
	}

	onTokenRemove = (searchTokens) => {
		const query = searchTokens.map(token => {
			return { [token.id]: { [token.operator]: token.value } };
		});

		this.setState({
			data: query.length > 0 ? dummyData(query) : dummyData()
		});
	}

	render() {
		const { data } = this.state;

		return (
			<ExampleTable
				data={data}
				onTokenAdd={this.onTokenAdd}
				onTokenRemove={this.onTokenRemove}
			/>
		);
	}
}

export default Main;
