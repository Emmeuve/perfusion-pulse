/**
 * Definiciones de tipos centralizadas para Perfusion Pulse
 * Usadas en toda la aplicación para type-safety
 */

// ============================================
// TIPOS DE PACIENTE
// ============================================

export interface PatientPersonalData {
  id?: string;
  firstName: string;
  lastName: string;
  age: number;
  sex?: 'M' | 'F' | 'Otro';
  weight: number; // kg
  height: number; // cm
  diagnosis: string;
  morbidAntecedents?: string;
  allergies?: string;
  surgeryType?: string;
  hospitalOrigin?: string;
  hospitalRecipient?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PatientECMOData extends PatientPersonalData {
  ecmoType: 'VA' | 'VV' | 'VAV';
  cannulaArterial?: string;
  cannulaVenous?: string;
  oxygenatorUsed?: string;
  primingVolume?: number;
  initialHematocrit?: number;
  targetHematocrit?: number;
}

// ============================================
// CÁLCULOS - CEC ADULTO
// ============================================

export interface CECAdultCalculationInput {
  weight: number;
  height: number;
  targetHematocrit: number;
  primingVolume: number;
  volumeOption: string;
  customVolume?: number;
  cardiacIndexOption: string;
  customCardiacIndex?: number;
}

export interface CECAdultCalculationResult {
  surfaceArea: number;
  totalVolume: number;
  flow: number;
  postPrimingHct: number;
  cerebralFlow: number;
  coronaryFlow: number;
  calculatedAt: Date;
}

export interface CECAdultReport extends CECAdultCalculationResult {
  patientData: PatientPersonalData;
  recommendations?: string[];
}

// ============================================
// CÁLCULOS - CEC PEDIÁTRICIO
// ============================================

export interface CECPediatricCalculationInput extends CECAdultCalculationInput {
  ageYears: number;
  zScoreAnnulus?: number;
}

export interface CECPediatricCalculationResult extends CECAdultCalculationResult {
  zScore?: number;
  recommendedVolume: number;
}

// ============================================
// CÁLCULOS - ECMO
// ============================================

export interface ECMOCalculationInput {
  weight: number;
  height: number;
  ecmoType: 'VA' | 'VV' | 'VAV';
  patientHematocrit: number;
  primingVolume: number;
  patientBloodVolume?: number;
}

export interface ECMOCalculationResult {
  recommendedFlow: number;
  hematocritAfterPriming: number;
  calculatedAt: Date;
}

// ============================================
// ANÁLISIS HEMODINÁMICO (GDP)
// ============================================

export interface HemodynamicInput {
  hemoglobin: number; // g/dL
  SaO2: number; // %
  SvO2: number; // %
  cardiacOutput: number; // L/min
  PaO2?: number; // mmHg
  PvO2?: number; // mmHg
}

export interface HemodynamicResult {
  DO2: number; // ml O2/min
  VO2: number; // ml O2/min
  CEO2: number; // %
  CaO2: number; // ml O2/100ml
  CvO2: number; // ml O2/100ml
  cardiacIndex: number; // L/min/m²
  bsa: number; // m²
}

// ============================================
// CORRECCIÓN DE ELECTROLITOS
// ============================================

export interface ElectrolyteCorrection {
  type: 'potassium' | 'bicarbonate';
  actualValue: number;
  desiredValue: number;
  weight: number;
  deficit: number;
  solutionConcentration?: number;
  volumeToAdminister?: number;
}

// ============================================
// CONVERSIONES
// ============================================

export type ConversionType = 
  | 'mg_to_ug'
  | 'ug_to_mg'
  | 'inch_to_fr'
  | 'fr_to_inch'
  | 'meq_to_mg'
  | 'mg_to_meq'
  | 'cm_to_inch'
  | 'inch_to_cm'
  | 'kg_to_lb'
  | 'lb_to_kg';

export interface ConversionRequest {
  type: ConversionType;
  value: number;
  substance?: string; // Para conversiones de mEq a mg
}

export interface ConversionResult {
  original: number;
  converted: number;
  originalUnit: string;
  convertedUnit: string;
}

// ============================================
// TRANSPORTE ECMO MÓVIL
// ============================================

export type ECMOMobileEventType = 
  | 'hospital_departure'
  | 'airport_arrival_origin'
  | 'origin_hospital_arrival'
  | 'ecmo_start'
  | 'origin_hospital_departure'
  | 'airport_arrival_destination'
  | 'destination_hospital_arrival';

export interface ECMOMobileTimelineEvent {
  id: string;
  eventType: ECMOMobileEventType;
  displayName: string;
  scheduledTime: Date;
  actualTime?: Date;
  isCompleted: boolean;
  notes?: string;
}

export interface ECMOMobileChecklist {
  id: string;
  itemId: string;
  title: string;
  description: string;
  isRequired: boolean;
  isChecked: boolean;
  category: string;
  notes?: string;
}

export interface ECMOMobileTransport {
  id: string;
  patientData: PatientECMOData;
  hospitalOrigin: string;
  hospitalRecipient: string;
  checklistItems: ECMOMobileChecklist[];
  timelineEvents: ECMOMobileTimelineEvent[];
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  generatedReport?: ELSOReport;
  createdAt: Date;
  updatedAt: Date;
}

export interface ELSOReport {
  transportId: string;
  patientData: PatientECMOData;
  startTime: Date;
  endTime: Date;
  timeline: ECMOMobileTimelineEvent[];
  checklist: ECMOMobileChecklist[];
  complications?: string[];
  notes?: string;
  generatedAt: Date;
}

// ============================================
// CÁNULAS Y OXIGENADORES
// ============================================

export interface CannulaRecommendation {
  cannulaId: string;
  name: string;
  type: string;
  manufacturer: string;
  fr: number;
  flow: number;
  pressureDrop: number;
  comments?: string;
}

export interface OxygenatorRecommendation {
  oxgenatorId: string;
  name: string;
  manufacturer: string;
  maxFlow: number;
  minFlow: number;
  primingVolume: number;
  surfaceArea: number;
}

// ============================================
// RESPUESTAS DE API/FIREBASE
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface FirebaseUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

// ============================================
// ESTADO DE APLICACIÓN
// ============================================

export interface AppState {
  currentUser: FirebaseUser | null;
  isLoading: boolean;
  error: string | null;
  notification?: Notification;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
  dismissible?: boolean;
}

// ============================================
// VALIDACIÓN DE FORMULARIOS
// ============================================

export interface FormField {
  name: string;
  value: any;
  error?: string;
  isValid?: boolean;
  isTouched?: boolean;
}

export interface FormState {
  [fieldName: string]: FormField;
}

// ============================================
// CONSTANTES Y ENUMS
// ============================================

export enum AgeGroup {
  NEONATAL = 'neonatal',
  PEDIATRIC = 'pediatric',
  ADULT = 'adult',
}

export enum ECMOType {
  VA = 'VA',
  VV = 'VV',
  VAV = 'VAV',
}

export enum SurgeryType {
  BYPASS = 'BYPASS',
  VALVE_REPLACEMENT = 'VALVE_REPLACEMENT',
  VALVE_REPAIR = 'VALVE_REPAIR',
  CORONARY_ARTERY = 'CORONARY_ARTERY',
  HEART_TRANSPLANT = 'HEART_TRANSPLANT',
  AORTIC_ANEURYSM = 'AORTIC_ANEURYSM',
  CONGENITAL = 'CONGENITAL',
  OTHER = 'OTHER',
}

export enum PatientStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
  CANCELLED = 'CANCELLED',
}

// ============================================
// UTILIDADES DE TIPO
// ============================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// ============================================
// TABLA DE REFERENCIA
// ============================================

export interface ReferenceTable {
  id: string;
  name: string;
  category: string;
  data: Array<{ [key: string]: string | number }>;
  headers: string[];
  lastUpdated: Date;
}