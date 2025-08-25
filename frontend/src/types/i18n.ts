// Tipos para las traducciones de la aplicación
export interface CommonTranslations {
  search: string;
  dashboard: string;
  loading: string;
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  create: string;
  back: string;
  next: string;
  previous: string;
  submit: string;
  close: string;
  confirm: string;
  yes: string;
  no: string;
  actions: string;
}

export interface NavigationTranslations {
  home: string;
  brands: string;
  createBrand: string;
  settings: string;
  profile: string;
}

export interface HeaderTranslations {
  title: string;
  searchPlaceholder: string;
  userProfile: string;
}

export interface SidebarTranslations {
  dashboard: string;
  brands: string;
  reports: string;
  settings: string;
}

export interface BrandFormTranslations {
  name: string;
  description: string;
  category: string;
  status: string;
  registrationDate: string;
  expiryDate: string;
  owner: string;
  country: string;
  trademarkNumber: string;
}

export interface BrandStatusTranslations {
  active: string;
  pending: string;
  expired: string;
  cancelled: string;
}

export interface BrandActionsTranslations {
  view: string;
  edit: string;
  delete: string;
  renew: string;
}

export interface BrandsTranslations {
  title: string;
  createNew: string;
  listTitle: string;
  noBrands: string;
  form: BrandFormTranslations;
  status: BrandStatusTranslations;
  actions: BrandActionsTranslations;
}

export interface StepperTranslations {
  step1: string;
  step2: string;
  step3: string;
  step4: string;
}

export interface HomepageStatsTranslations {
  totalBrands: string;
  activeBrands: string;
  expiringSoon: string;
  pendingReview: string;
}

export interface HomepageTranslations {
  welcome: string;
  description: string;
  quickActions: string;
  recentBrands: string;
  stats: HomepageStatsTranslations;
}

export interface ErrorTranslations {
  required: string;
  invalidFormat: string;
  networkError: string;
  unauthorized: string;
  notFound: string;
}

export interface SuccessTranslations {
  brandCreated: string;
  brandUpdated: string;
  brandDeleted: string;
}

export interface AppTranslations {
  common: CommonTranslations;
  navigation: NavigationTranslations;
  header: HeaderTranslations;
  sidebar: SidebarTranslations;
  brands: BrandsTranslations;
  stepper: StepperTranslations;
  homepage: HomepageTranslations;
  errors: ErrorTranslations;
  success: SuccessTranslations;
}

// Tipo para el hook de traducción
export type TranslationKey = keyof AppTranslations;
export type NamespaceKey<T extends TranslationKey> = keyof AppTranslations[T];
