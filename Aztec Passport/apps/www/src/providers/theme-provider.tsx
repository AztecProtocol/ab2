import React, { type PropsWithChildren } from 'react';

import { ThemeProvider as NextThemeProvider } from 'next-themes';

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  return (
    <NextThemeProvider
      attribute='class'
      defaultTheme='light'
      enableColorScheme={false}
      enableSystem={false}
      forcedTheme='light'
    >
      {children}
    </NextThemeProvider>
  );
};
