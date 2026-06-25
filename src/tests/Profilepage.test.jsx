import { render, screen, waitFor } from "@testing-library/react";
import { beforeAll, describe, expect, test, vi } from "vitest";
import ProfilePage from "../Components/ProfilePage";
import userEvent from "@testing-library/user-event";


beforeAll(() => {
    HTMLDialogElement.prototype.show = vi.fn(function mock() {
        this.setAttribute('open', 'true');
    })
})
describe('render four components', () => {
    test('should render the  firstName, lastName and bio', async () => {
        window.fetch = vi.fn(() => Promise.resolve({json: () => ({profile: null})}))
        render(<ProfilePage/>)
        const firstName =await screen.findByTestId('firstName')
        const lastName = await screen.findByTestId('lastName')
        const bio = await screen.findByTestId('bio')
        const button = await screen.queryByRole('button', {name: 'Edit'})
        screen.debug()
        expect(firstName.textContent).toBe('')
        expect(lastName.textContent).toBe('')
        expect(bio.textContent).toBe('')
        expect(button).toBe(null)
    })

    test('should render the corresponding fetch profile', async () => {
        const firstName = 'alfred'
        const lastName = 'mamadou'
        const bio = 'the last best'
        window.fetch = vi.fn(() => Promise.resolve({json: () => {
            return {profile: {firstName, lastName, bio}, isYourProfile: true}}
        }))
        render(<ProfilePage/>)
        const firstNameElement =await screen.findByTestId('firstName')
        const lastNameElement = await screen.findByTestId('lastName')
        const bioElement = await screen.findByTestId('bio')
        const button = await screen.findByRole('button', {name: 'Edit'})
        expect(firstNameElement.textContent).toBe(firstName)
        expect(lastNameElement.textContent).toBe(lastName)
        expect(bioElement.textContent).toBe(bio)
        expect(button).toBeInTheDocument()
    })
})

describe('should render the dialog element when clicking on edit button', () => {
    const firstName = 'alfred'
    const lastName = 'mamadou'
    const bio = 'the last best'
    test('idem',async () => {
        window.fetch = vi.fn(() => Promise.resolve({json: () => {
            return {profile: {firstName, lastName, bio}, isYourProfile: true}}
        }))
        render(<ProfilePage/>)
        const user = userEvent.setup()
        const edit = await screen.findByRole('button', {name: 'Edit'})
        await user.click(edit)
        screen.debug()
        await waitFor(() => {
            expect(screen.getByLabelText('dialog').open).toBe(true)
        })
    })
})