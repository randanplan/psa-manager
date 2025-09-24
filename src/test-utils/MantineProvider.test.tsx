import { describe, it, expect } from 'vitest';
import { Button } from '@mantine/core';
import { render, screen } from '../test-utils';

describe('MantineProvider Test', () => {
  it('should render Mantine components without MantineProvider error', () => {
    render(<Button>Test Button</Button>);
    
    expect(screen.getByRole('button', { name: /test button/i })).toBeInTheDocument();
  });
  
  it('should handle Mantine hooks correctly', () => {
    const TestComponent = () => {
      return <Button variant="filled" color="blue">Mantine Button</Button>;
    };
    
    render(<TestComponent />);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Mantine Button')).toBeInTheDocument();
  });
});