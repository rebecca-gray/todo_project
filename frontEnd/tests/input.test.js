import React from 'react';
import renderer from 'react-test-renderer';
import Input from "../src/input";

it('test to see if the input component renders correctly', () => {
    const mockSubmit = jest.fn();
    const tree = renderer
    .create(<Input handleSubmit={mockSubmit} />)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });
