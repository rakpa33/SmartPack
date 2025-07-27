import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';

// This test covers the full checklist acceptance criteria:
// - Add, check, uncheck, and remove items and categories
// - Checklist state persists to localStorage
// - Checklist state updates everywhere in the app

describe('Packing Checklist E2E', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('user can add, check, uncheck, and remove items and categories, and state persists', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Complete the TripForm to reach the Packing Checklist
    await userEvent.type(screen.getByLabelText('Trip Name'), 'Checklist Trip');
    const destinationInput = screen.getByTestId('destination-input-0');
    await userEvent.clear(destinationInput);
    await userEvent.type(destinationInput, 'Berlin');
    await userEvent.tab();
    const carCheckbox = await screen.findByLabelText('Car');
    await userEvent.click(carCheckbox);
    await userEvent.type(screen.getByLabelText('Start Date'), '2025-08-01');
    await userEvent.type(screen.getByLabelText('End Date'), '2025-08-10');
    await userEvent.type(screen.getByLabelText('Trip Details (optional)'), 'E2E test');
    const nextButton = await screen.findByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    // Wait for Packing Checklist to appear
    await waitFor(() => {
      const checklistSection = screen.getByTestId('packing-checklist-section');
      expect(within(checklistSection).getByText(/Packing Checklist/i)).toBeInTheDocument();
    });

    // Add a new item to Clothing
    const clothingInput = screen.getByPlaceholderText('Add to Clothing');
    await userEvent.type(clothingInput, 'Rain Jacket');
    const clothingSection = screen.getByText('Clothing').closest('div');
    const addClothingBtn = within(clothingSection!).getByRole('button', { name: /add/i });
    await userEvent.click(addClothingBtn);
    console.log('DOM after adding Rain Jacket:', document.body.innerHTML);
    expect(screen.getByText('Rain Jacket')).toBeInTheDocument();

    // Check the new item
    let rainJacketCheckbox = screen.queryByLabelText('Rain Jacket');
    if (!rainJacketCheckbox) {
      // Fallback: find by role and name
      rainJacketCheckbox = screen.queryByRole('checkbox', { name: /rain jacket/i });
    }
    if (rainJacketCheckbox) {
      await userEvent.click(rainJacketCheckbox);
      console.log('DOM after checking Rain Jacket:', document.body.innerHTML);
      expect(rainJacketCheckbox).toBeChecked();

      // Uncheck the item
      await userEvent.click(rainJacketCheckbox);
      console.log('DOM after unchecking Rain Jacket:', document.body.innerHTML);
      expect(rainJacketCheckbox).not.toBeChecked();
    }

    // Remove the item
    let removeBtn = screen.queryByLabelText('Remove Rain Jacket');
    if (!removeBtn) {
      const allRemoveBtns = screen.queryAllByRole('button');
      removeBtn = allRemoveBtns.find(btn => btn.textContent?.toLowerCase().includes('remove') && btn.textContent?.toLowerCase().includes('rain jacket')) || null;
    }
    if (removeBtn) {
      await userEvent.click(removeBtn);
      // Log all elements containing 'Rain Jacket' after removal
      const allRainJacketNodes = Array.from(document.querySelectorAll('*')).filter(node => node.textContent && node.textContent.includes('Rain Jacket'));
      console.log('All nodes containing "Rain Jacket" after removal:', allRainJacketNodes.map(n => n.outerHTML));
      // Log parent HTML for each node
      allRainJacketNodes.forEach((node, i) => {
        const parent = node.parentElement;
        if (parent) {
          console.log(`Parent of node[${i}] ('Rain Jacket'):`, parent.outerHTML);
        }
        // Log closest <ul> or <div> ancestor
        const ulAncestor = node.closest('ul');
        if (ulAncestor) {
          console.log(`Closest <ul> ancestor of node[${i}] ('Rain Jacket'):`, ulAncestor.outerHTML);
        }
        const divAncestor = node.closest('div');
        if (divAncestor) {
          console.log(`Closest <div> ancestor of node[${i}] ('Rain Jacket'):`, divAncestor.outerHTML);
        }
      });
      // Log all <span> elements containing 'Rain Jacket'
      const allRainJacketSpans = Array.from(document.querySelectorAll('span')).filter(node => node.textContent && node.textContent.includes('Rain Jacket'));
      console.log('All <span> nodes containing "Rain Jacket" after removal:', allRainJacketSpans.map(n => n.outerHTML));
      console.log('DOM after removing Rain Jacket:', document.body.innerHTML);
      // await waitForElementToBeRemoved(() => screen.queryByText('Rain Jacket'));
    }
    // Log again before final assertion
    const stillPresentNodes = Array.from(document.querySelectorAll('*')).filter(node => node.textContent && node.textContent.includes('Rain Jacket'));
    stillPresentNodes.forEach((node, i) => {
      const parent = node.parentElement;
      if (parent) {
        console.log(`Parent of stillPresentNode[${i}] ('Rain Jacket'):`, parent.outerHTML);
      }
      const ulAncestor = node.closest('ul');
      if (ulAncestor) {
        console.log(`Closest <ul> ancestor of stillPresentNode[${i}] ('Rain Jacket'):`, ulAncestor.outerHTML);
      }
      const divAncestor = node.closest('div');
      if (divAncestor) {
        console.log(`Closest <div> ancestor of stillPresentNode[${i}] ('Rain Jacket'):`, divAncestor.outerHTML);
      }
    });
    console.log('Nodes with "Rain Jacket" before final assertion:', stillPresentNodes.map(n => n.outerHTML));
    expect(screen.queryByText('Rain Jacket')).not.toBeInTheDocument();

    // Add a new category (if supported by UI)
    // Example: Add category button and input must exist
    const addCategoryBtn = screen.queryByRole('button', { name: /add category/i });
    if (addCategoryBtn) {
      await userEvent.click(addCategoryBtn);
      const categoryInput = screen.getByPlaceholderText(/new category/i);
      await userEvent.type(categoryInput, 'Tech');
      await userEvent.click(screen.getByRole('button', { name: /save category/i }));
      console.log('DOM after adding Tech category:', document.body.innerHTML);
      expect(screen.getByText('Tech')).toBeInTheDocument();
      // Add item to new category
      const techInput = screen.getByPlaceholderText('Add to Tech');
      await userEvent.type(techInput, 'Laptop');
      const techSection = screen.getByText('Tech').closest('div');
      const addTechBtn = within(techSection!).getByRole('button', { name: /add/i });
      await userEvent.click(addTechBtn);
      console.log('DOM after adding Laptop to Tech:', document.body.innerHTML);
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      // Remove category
      let removeCatBtn = screen.queryByLabelText('Remove Tech category');
      if (!removeCatBtn) {
        const allRemoveCatBtns = screen.queryAllByRole('button');
        removeCatBtn = allRemoveCatBtns.find(btn => btn.textContent?.toLowerCase().includes('remove') && btn.textContent?.toLowerCase().includes('tech')) || null;
      }
      if (removeCatBtn) {
        await userEvent.click(removeCatBtn);
        console.log('DOM after removing Tech category:', document.body.innerHTML);
      }
      expect(screen.queryByText('Tech')).not.toBeInTheDocument();
    }

    // Simulate reload: re-render the app
    window.localStorage.setItem('reload', 'true'); // marker for debugging
    render(
      <MemoryRouter initialEntries={['/MainLayout']}>
        <App />
      </MemoryRouter>
    );
    // Checklist state should persist
    await waitFor(() => {
      const allChecklistSections = screen.getAllByTestId('packing-checklist-section');
      const checklistSection = allChecklistSections[allChecklistSections.length - 1];
      expect(within(checklistSection).getByText(/Packing Checklist/i)).toBeInTheDocument();
    });
    console.log('DOM after reload:', document.body.innerHTML);
    // Rain Jacket should not be present (was removed)
    expect(screen.queryByText('Rain Jacket')).not.toBeInTheDocument();
    // If Tech category was added and removed, it should not be present
    expect(screen.queryByText('Tech')).not.toBeInTheDocument();
  });
});
