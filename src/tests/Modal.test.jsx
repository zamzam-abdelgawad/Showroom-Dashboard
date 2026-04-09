import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../shared/components/ui/Modal';

describe('Modal Component', () => {
  it('renders nothing when not open', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('renders content when open', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );
    
    // Find the SVG close button (or its parent button)
    // The close button has an X icon inside, we can find it by accessible name if provided, or by class
    const closeBtn = screen.getByRole('button', { name: /close/i, hidden: true }).closest('button');
    if(closeBtn) {
       fireEvent.click(closeBtn);
       expect(handleClose).toHaveBeenCalledTimes(1);
    } else {
       // fallback if no aria-label
       const closeButtons = document.querySelectorAll('button');
       fireEvent.click(closeButtons[0]); // usually the first button inside the modal header
       expect(handleClose).toHaveBeenCalledTimes(1);
    }
  });
});
