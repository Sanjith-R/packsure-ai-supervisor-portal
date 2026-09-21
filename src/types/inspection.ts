export type ComplianceStatus = 'Compliant' | 'Non-Compliant' | 'Partially Compliant';

export type SupervisorDecision = 
  | 'Pending Review' 
  | 'Confirmed Compliant' 
  | 'Confirmed Non-Compliant' 
  | 'Order Reinspection';

export interface MeasurementDetail {
  declared: number;
  measured: number;
  unit: string;
  maxPermissibleError?: number;
  deviationPercent?: number;
  passed: boolean;
  notes?: string;
}

export interface PackageMeasurements {
  grossWeight: MeasurementDetail;
  netWeight: MeasurementDetail;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
    volumeCc: number;
    passed: boolean;
  };
  tareWeight: {
    measured: number;
    unit: string;
  };
}

export interface EvidenceAnnotation {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  confidence: number;
  valid: boolean;
}

export interface EvidenceImage {
  id: string;
  type: 'package' | 'front' | 'back' | 'side' | 'mrp' | 'label' | string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  captureResolution: string;
  timestamp: string;
  annotations: EvidenceAnnotation[];
}

export interface OcrExtraction {
  id: string;
  field: string;
  detectedText: string;
  standardValue: string;
  confidence: number;
  ruleRef: string;
  status: 'verified' | 'warning' | 'error';
  charHeightMm?: number;
  minHeightReqMm?: number;
}

export interface RuleEngineCard {
  id: string;
  ruleName: string;
  ruleNumber: string;
  status: 'PASS' | 'FAIL';
  reason: string;
  confidence: number;
  severity: 'Critical' | 'Major' | 'Minor';
  category: string;
}

export interface AuditTimelineEvent {
  id: string;
  title: 'Inspection Created' | 'Images Uploaded' | 'OCR Completed' | 'Rule Evaluation Completed' | 'Supervisor Review' | 'Final Decision' | string;
  timestamp: string;
  actor: string;
  role: string;
  description: string;
  digitalHash?: string;
  status: 'completed' | 'in-progress' | 'pending';
}

export interface ReinspectionRecord {
  id: string;
  originalInspectionId: string;
  newInspectionId: string;
  productName: string;
  previousBatch: string;
  newBatch: string;
  orderedDate: string;
  completedDate?: string;
  reason: string;
  supervisorNotes: string;
  assignedOfficer: string;
  status: 'Pending Officer Visit' | 'Samples Collected' | 'In Review' | 'Re-analyzed - Resolved' | 'Re-analyzed - Repeat Violation';
}

export interface Inspection {
  id: string;
  productName: string;
  brand: string;
  category: string;
  batchNumber: string;
  lotSize?: number;
  companyName: string;
  companyEmail: string;
  location: string;
  district: string;
  state: string;
  inspectionDate: string;
  officerName: string;
  officerBadge: string;
  officerZone: string;
  officerPhone?: string;
  aiComplianceResult: ComplianceStatus;
  aiComplianceScore: number;
  supervisorDecision: SupervisorDecision;
  supervisorComment?: string;
  supervisorReviewDate?: string;
  supervisorName?: string;
  priority: 'High' | 'Medium' | 'Low';
  retailOutlet: string;
  measurements: PackageMeasurements;
  evidence: EvidenceImage[];
  ocrResults: OcrExtraction[];
  rules: RuleEngineCard[];
  auditTimeline: AuditTimelineEvent[];
  reinspectionHistory?: {
    isReinspection: boolean;
    parentInspectionId?: string;
    childInspectionId?: string;
    originalBatch?: string;
    newBatch?: string;
    orderReason?: string;
  };
}

export interface OfficerProfile {
  badge: string;
  name: string;
  zone: string;
  totalInspected: number;
  pendingAction: number;
  flaggedViolations: number;
  complianceRate: string;
  avgSpeedHours: number;
  status: string;
  phone?: string;
  email?: string;
}

export interface DispatchAssignment {
  id: string;
  officerBadge: string;
  officerName: string;
  targetType: 'Statutory Re-inspection' | 'Routine Surveillance' | 'Consumer Complaint' | 'MRP & Dual-Sticker Drive' | 'Special Lot Verification';
  inspectionId?: string;
  productName: string;
  facilityName: string;
  location: string;
  zone: string;
  priority: 'Urgent (24h)' | 'High' | 'Routine';
  scheduledDate: string;
  instructions: string;
  dispatchedAt: string;
  dispatchedBy: string;
  status: 'Dispatched to Mobile' | 'Acknowledged' | 'In Progress' | 'Completed';
}

export type SidebarMenuItem = 
  | 'Dashboard'
  | 'Inspections'
  | 'Pending Reviews'
  | 'Reinspections'
  | 'Reports'
  | 'Officers'
  | 'Settings';
