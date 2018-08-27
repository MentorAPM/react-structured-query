import React, { Component } from 'react';

import ExampleTable from './ExampleTable';
import StructuredQuery from '../../src';
import { dummyData } from './exampleData';

class Main extends Component {

	constructor(props) {
		super(props);

		this.initTokens = [{
			id: 'name',
			category: 'Name',
			operator: '==',
			value: 'Brandi Herrera',
			hidden: true
		}];

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
			<div className="container my-4">
				<StructuredQuery
					stringOperations={['==', '!=', 'left', 'right', 'like']}
					options={[
						{
							id: 'name',
							category: 'Name',
							type: 'string'
						},
						{
							id: 'address',
							category: 'Address',
							type: 'string'
						},
						{
							id: 'balance',
							category: 'Balance',
							type: 'string'
						},
						{
							id: 'age',
							category: 'Age',
							type: 'integer'
						},
						{
							id: 'phone',
							category: 'Phone Number',
							type: 'string'
						},
						{
							id: 'gender',
							category: 'Gender',
							type: 'enumoptions',
							options: ['male', 'female']
						},
						{
							id: 'registered',
							category: 'Register Date',
							type: 'datetime'
						}
					]}
					initTokens={this.initTokens}
					onTokenAdd={this.onTokenAdd}
					onTokenRemove={this.onTokenRemove}
				/>
				<ExampleTable data={data} />
			</div>
		);
	}
}

export default Main;
