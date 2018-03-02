import React, { Component } from 'react';

class ExampleTable extends Component {

	render() {
		const { data } = this.props;

		return (
			<table>
				<tbody>
					<tr>
						<td>test</td>
						<td>test 2</td>
					</tr>
				</tbody>
			</table>
		);
	}
}

export default ExampleTable;
