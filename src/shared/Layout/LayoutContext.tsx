import * as React from 'react';
import {createContext, ReactChild, useContext, useEffect, useState} from 'react';
// import debounce from 'lodash.debounce'

const LayoutContext = createContext<LayoutContextProps>({} as LayoutContextProps);

interface IProps {
  children: ReactChild
  mobileBreakpoint?: number
}

interface LayoutContextProps {
  isMobileWidth: boolean
}

export const LayoutProvider = ({mobileBreakpoint = 700, children}: IProps) => {
  const [mobileWidth, setMobileWidth] = useState(getWidth());

  useEffect(() => {
    window.addEventListener('resize', () => setMobileWidth(getWidth()));
    // window.addEventListener('resize', debounce(() => setMobileWidth(getWidth()), 600))
  }, []);

  return (
    <LayoutContext.Provider value={{
      isMobileWidth: mobileWidth < mobileBreakpoint,
    }}>
      {children}
    </LayoutContext.Provider>
  );
};

function getWidth(): number {
  return window.innerWidth;
}

export const useLayoutContext = (): LayoutContextProps => {
  return useContext<LayoutContextProps>(LayoutContext);
};
