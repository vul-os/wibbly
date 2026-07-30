import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { Progress as LoadingComponent } from './components/ui/progress';
// Layouts
import BlankLayout from './components/layout/blank-layout';

// Loading message mapping
const getLoadingMessage = (pathname) => {
  if (pathname.includes('/viz')) return 'Loading 3D visualizer...';
  if (pathname === '/') return 'Loading plant...';
  return 'Loading...';
};

// Custom Suspense wrapper with dynamic message
const CustomSuspense = ({ children }) => {
  const location = useLocation();
  const message = getLoadingMessage(location.pathname);

  return (
    <Suspense fallback={<LoadingComponent message={message} />}>
      {children}
    </Suspense>
  );
};

// Lazy imports
const lazyImport = (importFn) => {
  const Component = lazy(importFn);
  return Component;
};

// Lazy loaded components
const NotFound = lazyImport(() => import('./pages/not-found'));

// 3D Visualization
const PalmworksViz = lazyImport(() => import('./pages/viz'));

const AppRoutes = () => {
  return (
    <CustomSuspense>
      <Routes>
        <Route element={<BlankLayout />}>
          <Route path="/" element={<PalmworksViz />} />
        </Route>

        {/* 3D Plant Visualization */}
        <Route element={<BlankLayout />}>
          <Route path="/viz" element={<PalmworksViz />} />
        </Route>

        {/* Global catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </CustomSuspense>
  );
};

export default AppRoutes;
