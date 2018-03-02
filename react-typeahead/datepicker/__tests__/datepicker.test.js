import test from 'tape';
import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import InputMoment from 'input-moment';
import moment from 'moment';

import DatePicker from '../datepicker';

configure({ adapter: new Adapter() });

test('shallow render test of structured query date picker', (t) => {
	function updateDateValue(value) {
		t.ok(moment(value).isSameOrBefore(Date.now()),
			'Update date value did not send a date value that was the same or before current date');
	}

	function onOptionSelected(option) {
		t.ok(moment(option).isSameOrBefore(Date.now()),
			'Update date option did not send a date value that was the same or before current date');
	}

	const wrapper = shallow(
		<DatePicker
			onOptionSelected={onOptionSelected}
			updateDateValue={updateDateValue}
		/>);

	t.equal(wrapper.find(InputMoment).length, 1,
		'An input moment was not rendered on default library');

	t.ok(moment(wrapper.state('dateTime')).isSameOrBefore(Date.now()),
		'Date set in date picker is not same or before on construction');

	wrapper.find(InputMoment).simulate('change', moment());

	wrapper.instance().handleSave();

	t.end();
});

