import React, { Component } from 'react';
import moment from 'moment';
import InputMoment from 'input-moment';

class DatePicker extends Component {

	constructor(props) {
		super(props);

		this.state = {
			datetime: moment()
		};
	}

	componentDidMount() {
		const { updateDateValue } = this.props;
		const { datetime } = this.state;

		updateDateValue(datetime.format('YYYY-MM-DD HH:mm'));
	}

	handleChange = (newdatetime) => {
		this.setState({
			datetime: newdatetime
		});

		this.props.updateDateValue(newdatetime.format('YYYY-MM-DD HH:mm'));
	}

	handleSave = () => {
		const { onOptionSelected } = this.props;
		const { datetime } = this.state;

		onOptionSelected(datetime.toISOString());
	}

	render() {
		const { datetime } = this.state;

		return (
			<div className="datepicker">
				<InputMoment
					moment={datetime}
					minStep={5}
					onChange={this.handleChange}
					onSave={this.handleSave}
					prevMonthIcon="fa fa-angle-left"
					nextMonthIcon="fa fa-angle-right"
				/>
			</div>
		);
	}
}

export default DatePicker;
