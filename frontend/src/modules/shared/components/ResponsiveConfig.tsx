// Configuración responsive para mantener consistencia en toda la aplicación
export const RESPONSIVE_CONFIG = {
  // Breakpoints
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  
  // Espaciado responsive
  spacing: {
    mobile: {
      padding: 'p-3 sm:p-4',
      margin: 'm-2 sm:m-3',
      gap: 'gap-2 sm:gap-3',
      space: 'space-y-2 sm:space-y-3',
    },
    tablet: {
      padding: 'p-4 sm:p-6',
      margin: 'm-3 sm:m-4',
      gap: 'gap-3 sm:gap-4',
      space: 'space-y-3 sm:space-y-4',
    },
    desktop: {
      padding: 'p-6',
      margin: 'm-4',
      gap: 'gap-4',
      space: 'space-y-4',
    },
  },
  
  // Tamaños de texto responsive
  text: {
    h1: 'text-xl sm:text-2xl lg:text-3xl',
    h2: 'text-lg sm:text-xl lg:text-2xl',
    h3: 'text-base sm:text-lg lg:text-xl',
    body: 'text-sm sm:text-base',
    small: 'text-xs sm:text-sm',
    caption: 'text-xs',
  },
  
  // Layout responsive
  layout: {
    container: 'container mx-auto px-4 sm:px-6 lg:px-8',
    sidebar: 'w-64',
    main: 'flex-1',
    grid: {
      mobile: 'grid-cols-1',
      tablet: 'sm:grid-cols-2',
      desktop: 'lg:grid-cols-3 xl:grid-cols-4',
    },
  },
  
  // Componentes responsive
  components: {
    button: {
      mobile: 'px-3 py-2 text-sm',
      tablet: 'sm:px-4 sm:py-2.5 sm:text-base',
      desktop: 'lg:px-6 lg:py-3 lg:text-lg',
    },
    input: {
      mobile: 'px-3 py-2 text-sm',
      tablet: 'sm:px-4 sm:py-2.5 sm:text-base',
      desktop: 'lg:px-4 lg:py-3 lg:text-base',
    },
    card: {
      mobile: 'p-3 sm:p-4',
      tablet: 'sm:p-4 sm:p-6',
      desktop: 'lg:p-6',
    },
  },
};

// Hook para usar la configuración responsive
export const useResponsiveConfig = () => {
  return RESPONSIVE_CONFIG;
};

// Clases utilitarias responsive predefinidas
export const RESPONSIVE_CLASSES = {
  // Layout
  flexColRow: 'flex flex-col sm:flex-row',
  flexRowCol: 'flex flex-row flex-col sm:flex-row',
  
  // Espaciado
  padding: 'p-3 sm:p-4 lg:p-6',
  margin: 'm-2 sm:m-3 lg:m-4',
  gap: 'gap-2 sm:gap-3 lg:gap-4',
  space: 'space-y-2 sm:space-y-3 lg:space-y-4',
  
  // Texto
  title: 'text-lg sm:text-xl lg:text-2xl',
  subtitle: 'text-base sm:text-lg lg:text-xl',
  body: 'text-sm sm:text-base',
  
  // Grid
  grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  
  // Botones
  button: 'px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 text-sm sm:text-base',
  
  // Inputs
  input: 'px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base',
};
