import { describe, it, expect, vi } from 'vitest';
import { Container, Title, Group } from '@mantine/core';
import { render, screen } from '../../test-utils';

// Mock Supabase before importing the Login component
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ data: [], error: null }),
      update: vi.fn().mockResolvedValue({ data: [], error: null }),
      delete: vi.fn().mockResolvedValue({ data: [], error: null }),
    }),
    auth: {
      signUp: vi.fn().mockResolvedValue({ data: null, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: null, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
  },
}));

// Mock the store to avoid Supabase initialization
vi.mock('../../store', () => ({
  useAuthStore: vi.fn(() => ({
    signIn: vi.fn(),
    signUp: vi.fn(),
    signInDemo: vi.fn(),
  })),
  useReportStore: vi.fn(() => ({
    loadSampleData: vi.fn(),
  })),
}));

import { Login } from '../../pages/Login';

describe('Component with Mantine hooks', () => {
  it('should render Login component without MantineProvider error', () => {
    // This test demonstrates that components using Mantine hooks can be tested 
    // without the "MantineProvider was not found in component tree" error
    render(<Login />);
    
    // Just verify that the component rendered (no MantineProvider error occurred)
    expect(screen.getByRole('heading', { name: /PSA-Manager/i })).toBeInTheDocument();
  });
  
  it('should render components that use Mantine theme context', () => {
    const ThemedComponent = () => (
      <Container size="xs">
        <Title order={1}>Test Title</Title>
        <Group>Test Group</Group>
      </Container>
    );
    
    render(<ThemedComponent />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});