import React from 'react';

const ExampleTable = ({data}) => (
	<table>
		<thead>
			<tr>
				<th>Name</th>
				<th>Address</th>
				<th>Balance</th>
				<th>Age</th>
				<th>Phone</th>
				<th>Gender</th>
				<th>Registered</th>
			</tr>
		</thead>
		<tbody>
		{ data.map((d, i) => (
			<tr key={i}>
				<td>{d.name}</td>
				<td>{d.address}</td>
				<td>{d.balance}</td>
				<td>{d.age}</td>
				<td>{d.phone}</td>
				<td>{d.gender}</td>
				<td>{d.registered}</td>
			</tr>
		))}
		</tbody>
	</table>
);

export default ExampleTable;
