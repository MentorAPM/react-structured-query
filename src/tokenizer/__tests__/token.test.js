import test from 'tape';
import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Token from '../token';

configure({ adapter: new Adapter() });

test('shallow render test of structured query token', (t) => {
	function onRemove(children) {
		t.deepEqual(children,
			{ category: 'test', operator: '==', value: 'test' },
			'Children value passed back to the on remove function is not correct');
	}

	const wrapper = shallow(<Token />);
	const children = { category: 'test', operator: '==', value: 'test' };

	t.equal(wrapper.text(), '  ',
		'Text is not correct on init render with no props');

	wrapper.setProps({
		children
	});

	t.equal(wrapper.text(), 'test == test',
		'Text is not correct on render with children prop and no remove function');

	wrapper.setProps({
		onRemove
	});

	wrapper.find('a').simulate('click', { preventDefault: () => { return; } });

	t.ok(wrapper.find('a').exists(),
		'Anchor html element does not exist when onRemove function is passed in');

	t.end();
});
