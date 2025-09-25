/* eslint-disable react-refresh/only-export-components */
import type { ReactElement } from 'react';
import { render as rtlRender, type RenderOptions } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

// Custom render function that wraps components with MantineProvider
function render(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <MantineProvider defaultColorScheme="light">
      <Notifications />
      {children}
    </MantineProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything from @testing-library/react except render
export * from '@testing-library/react';

// Export our custom render method
export { render };