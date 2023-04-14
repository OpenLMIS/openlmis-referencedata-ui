import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';

import { Component } from "../../__mocks__/test.js";


import AdminDataExportPage from '../../admin-data-export/components/AdminDataExportPage/AdminDataExportPage.jsx'

jest.mock('../../react-components/utils/angular-utils', () => 'Angular Utils Mock')

describe('MyComponent', () => {
    it('renders correctly', () => {
        const { container, getByText } = render(<Component />);
        expect(getByText('Mocked Component')).toBeTruthy();


        expect(container).toMatchSnapshot()
    });
});

describe('Unit tests for the AdminDataExportPage.', () => {

    describe('Should match snapshot -', () => {
        test('create.', async () => {
            const { container, getByTestId } = render(
                <AdminDataExportPage />
            )

            expect(container).toMatchSnapshot()
        })
    })

})
