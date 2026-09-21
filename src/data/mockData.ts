import { Inspection, ReinspectionRecord } from '../types/inspection';

export const INITIAL_INSPECTIONS: Inspection[] = [
  {
    id: 'INS-1001',
    productName: 'Rice',
    brand: 'SunFresh',
    category: 'Grains & Cereals',
    batchNumber: 'L-001',
    lotSize: 500,
    companyName: 'ABC Foods Pvt Ltd',
    companyEmail: 'compliance@abcfoods.com',
    location: 'Coimbatore',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    inspectionDate: '07 Sep 2026',
    officerName: 'K. Senthil Kumar',
    officerBadge: 'LM-OFF-TN-1082',
    officerZone: 'South Zone - Zone 4',
    officerPhone: '+91 94432 78190',
    aiComplianceResult: 'Non-Compliant',
    aiComplianceScore: 62,
    supervisorDecision: 'Pending Review',
    supervisorComment: 'Missing country of origin declaration and gravimetric shortage below MPE limit under Schedule-IV. Verification notice generated.',
    priority: 'High',
    retailOutlet: 'ABC Wholesale & Grain Depo, Ganapathy, Coimbatore',
    measurements: {
      grossWeight: {
        declared: 1.050,
        measured: 1.050,
        unit: 'kg',
        deviationPercent: 0.0,
        passed: true,
        notes: 'Pouch tare weight: 0.060 kg'
      },
      netWeight: {
        declared: 1.0,
        measured: 0.990,
        unit: 'kg',
        maxPermissibleError: 15.0,
        deviationPercent: -1.0,
        passed: false,
        notes: 'Measured net quantity 0.990 kg is below declared net quantity 1 kg'
      },
      dimensions: {
        length: 280,
        width: 190,
        height: 45,
        unit: 'mm',
        volumeCc: 2394,
        passed: true
      },
      tareWeight: {
        measured: 0.060,
        unit: 'kg'
      }
    },
    evidence: [
      {
        id: 'ev-1001-pkg',
        type: 'front',
        title: 'SunFresh Rice 1kg Package Evidence',
        url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
        captureResolution: '4032 x 3024 (12 MP)',
        timestamp: '2026-09-07 10:45:12 AM',
        annotations: [
          { x: 18, y: 15, width: 64, height: 25, label: 'SunFresh Rice Brand Identity', confidence: 99.4, valid: true },
          { x: 20, y: 55, width: 35, height: 20, label: 'Net Quantity: 1 kg', confidence: 98.7, valid: true },
          { x: 55, y: 55, width: 35, height: 20, label: 'MRP ₹70', confidence: 99.1, valid: true },
          { x: 25, y: 78, width: 50, height: 18, label: 'Missing Country of Origin', confidence: 96.5, valid: false }
        ]
      }
    ],
    ocrResults: [
      {
        id: 'ocr-1001-1',
        field: 'Product Name',
        detectedText: 'Rice',
        standardValue: 'Rice',
        confidence: 99.4,
        ruleRef: 'Rule 6(1)(a)',
        status: 'verified'
      },
      {
        id: 'ocr-1001-2',
        field: 'Manufacturer & Address',
        detectedText: 'ABC Foods Pvt Ltd',
        standardValue: 'ABC Foods Pvt Ltd',
        confidence: 98.6,
        ruleRef: 'Rule 6(1)(b)',
        status: 'verified'
      },
      {
        id: 'ocr-1001-3',
        field: 'Net Quantity',
        detectedText: '1 kg',
        standardValue: '1 kg',
        confidence: 99.2,
        ruleRef: 'Rule 6(1)(c)',
        status: 'verified'
      },
      {
        id: 'ocr-1001-4',
        field: 'MRP (Retail Price)',
        detectedText: '₹70',
        standardValue: '₹70',
        confidence: 99.5,
        ruleRef: 'Rule 6(1)(e)',
        status: 'verified'
      },
      {
        id: 'ocr-1001-5',
        field: 'Date of Manufacture / Packing',
        detectedText: '07/2026',
        standardValue: '07/2026',
        confidence: 98.1,
        ruleRef: 'Rule 6(1)(d)',
        status: 'verified'
      },
      {
        id: 'ocr-1001-6',
        field: 'Consumer Care Details',
        detectedText: '1800-XXXXXX',
        standardValue: '1800-XXXXXX',
        confidence: 97.4,
        ruleRef: 'Rule 6(1)(h)',
        status: 'verified'
      },
      {
        id: 'ocr-1001-7',
        field: 'Country of Origin',
        detectedText: 'Not Found',
        standardValue: 'Missing',
        confidence: 98.9,
        ruleRef: 'Rule 6(10)',
        status: 'error'
      }
    ],
    rules: [
      {
        id: 'r-1001-1',
        ruleName: 'Mandatory Country of Origin Declaration',
        ruleNumber: 'Rule 6(10) / Notification GSR 559(E)',
        status: 'FAIL',
        reason: 'Missing Country of Origin declaration (where applicable).',
        confidence: 98.9,
        severity: 'Critical',
        category: 'Statutory Declaration'
      },
      {
        id: 'r-1001-2',
        ruleName: 'Schedule-IV Net Quantity MPE Verification',
        ruleNumber: 'Rule 18 / Schedule-IV',
        status: 'FAIL',
        reason: 'Measured net quantity is below declared quantity; final legal decision is based on applicable MPE and lot criteria.',
        confidence: 97.5,
        severity: 'Major',
        category: 'Gravimetric Tolerance'
      },
      {
        id: 'r-1001-3',
        ruleName: 'Manufacturer / Packer Complete Address',
        ruleNumber: 'Rule 6(1)(b)',
        status: 'PASS',
        reason: 'ABC Foods Pvt Ltd manufacturer declaration present and verified.',
        confidence: 98.6,
        severity: 'Minor',
        category: 'Packer Identification'
      },
      {
        id: 'r-1001-4',
        ruleName: 'Maximum Retail Price (MRP) Declaration',
        ruleNumber: 'Rule 6(1)(e)',
        status: 'PASS',
        reason: 'MRP ₹70 (inclusive of all taxes) clearly declared.',
        confidence: 99.5,
        severity: 'Minor',
        category: 'Price Compliance'
      }
    ],
    auditTimeline: [
      {
        id: 'aud-1001-1',
        title: 'Inspection Created',
        timestamp: '07 Sep 2026 10:30 AM',
        actor: 'K. Senthil Kumar',
        role: 'Legal Metrology Inspector',
        description: 'Physical inspection initiated at ABC Wholesale, Ganapathy, Coimbatore.',
        status: 'completed'
      },
      {
        id: 'aud-1001-2',
        title: 'Images Uploaded',
        timestamp: '07 Sep 2026 10:45 AM',
        actor: 'PackSure Edge Mobile',
        role: 'Field Terminal',
        description: 'High-res primary display panel and barcode photos synchronized.',
        status: 'completed'
      },
      {
        id: 'aud-1001-3',
        title: 'OCR Completed',
        timestamp: '07 Sep 2026 10:46 AM',
        actor: 'PackSure Vision AI Engine',
        role: 'Automated Service',
        description: 'Extracted 7 core statutory fields; detected missing Country of Origin.',
        status: 'completed'
      },
      {
        id: 'aud-1001-4',
        title: 'Supervisor Review',
        timestamp: '07 Sep 2026 15:10 PM',
        actor: 'Amit K. Deshmukh',
        role: 'Zonal Metrology Supervisor',
        description: 'Report sent to supervisor for review and formal compounding notice drafting.',
        status: 'in-progress'
      }
    ]
  },
  {
    id: 'INS-2026-0841',
    productName: 'Britannia Good Day Butter Cookies 100g',
    brand: 'Britannia Industries Ltd',
    category: 'Biscuits & Bakery',
    batchNumber: 'BG-2026-A492',
    companyName: 'Britannia Industries Limited',
    companyEmail: 'compliance@britannia.co.in',
    location: 'Reliance Smart Superstore, Andheri East, Mumbai',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    inspectionDate: '2026-09-12 11:42 AM',
    officerName: 'Rajesh V. Sharma',
    officerBadge: 'LM-OFF-MH-4019',
    officerZone: 'West Zone - Region 2',
    officerPhone: '+91 98201 44521',
    aiComplianceResult: 'Non-Compliant',
    aiComplianceScore: 68,
    supervisorDecision: 'Pending Review',
    supervisorComment: '',
    priority: 'High',
    retailOutlet: 'Reliance Smart Point (Store #412)',
    measurements: {
      grossWeight: {
        declared: 106.0,
        measured: 105.8,
        unit: 'g',
        deviationPercent: -0.19,
        passed: true,
        notes: 'Gross weight within packaging tolerance'
      },
      netWeight: {
        declared: 100.0,
        measured: 99.4,
        unit: 'g',
        maxPermissibleError: 4.5, // 4.5% or 4.5g under Schedule-IV
        deviationPercent: -0.6,
        passed: true,
        notes: 'Net weight within Max Permissible Error (MPE) limit of 4.5g'
      },
      dimensions: {
        length: 145,
        width: 58,
        height: 52,
        unit: 'mm',
        volumeCc: 437.3,
        passed: true
      },
      tareWeight: {
        measured: 6.4,
        unit: 'g'
      }
    },
    evidence: [
      {
        id: 'ev-1',
        type: 'front',
        title: 'Primary Display Panel (Front Packaging Label)',
        url: 'https://images.openfoodfacts.org/images/products/890/106/309/2822/front_en.4.400.jpg',
        captureResolution: '4032 x 3024 (12 MP)',
        timestamp: '2026-09-12 11:38:12 AM',
        annotations: [
          { x: 16, y: 14, width: 68, height: 26, label: 'Brand & Generic Name: Good Day Butter Cookies', confidence: 99.2, valid: true },
          { x: 62, y: 68, width: 32, height: 18, label: 'Net Weight: "100 g"', confidence: 96.4, valid: true },
          { x: 8, y: 12, width: 18, height: 18, label: 'Vegetarian Dot Indicator', confidence: 99.1, valid: true },
          { x: 14, y: 45, width: 44, height: 24, label: 'Butter Rich Cookies Visual', confidence: 97.5, valid: true }
        ]
      },
      {
        id: 'ev-1-decl',
        type: 'back',
        title: 'Mandatory Declarations & Packer Address Label',
        url: 'https://images.openfoodfacts.org/images/products/890/106/309/2822/ingredients_en.12.400.jpg',
        captureResolution: '4032 x 3024 (12 MP)',
        timestamp: '2026-09-12 11:38:22 AM',
        annotations: [
          { x: 10, y: 10, width: 80, height: 35, label: 'Mfd & Pkd: Britannia Industries Ltd., Kolkata', confidence: 98.4, valid: true },
          { x: 12, y: 48, width: 76, height: 24, label: 'Consumer Care Cell & Email', confidence: 94.7, valid: true },
          { x: 50, y: 72, width: 45, height: 22, label: 'Missing Unit Sale Price (USP) Violation', confidence: 98.6, valid: false }
        ]
      },
      {
        id: 'ev-1-nutri',
        type: 'label',
        title: 'Nutrition Facts & Ingredients Panel Label',
        url: 'https://images.openfoodfacts.org/images/products/890/106/309/2822/nutrition_en.14.400.jpg',
        captureResolution: '4032 x 3024 (12 MP)',
        timestamp: '2026-09-12 11:38:35 AM',
        annotations: [
          { x: 8, y: 12, width: 84, height: 48, label: 'Nutritional Information per 100g', confidence: 97.8, valid: true },
          { x: 10, y: 64, width: 80, height: 28, label: 'Ingredients: Refined Wheat Flour, Butter 2%', confidence: 96.2, valid: true }
        ]
      }
    ],
    ocrResults: [
      {
        id: 'ocr-1',
        field: 'Manufacturer / Packer Declaration',
        detectedText: 'Mfd & Pkd by: Britannia Industries Ltd., 5/1A Hungerford Street, Kolkata - 700017, WB.',
        standardValue: 'Compliant with Rule 6(1)(a)',
        confidence: 98.4,
        ruleRef: 'Rule 6(1)(a)',
        status: 'verified'
      },
      {
        id: 'ocr-2',
        field: 'Generic / Common Product Name',
        detectedText: 'BUTTER COOKIES / BISCUITS',
        standardValue: 'Compliant with Rule 6(1)(b)',
        confidence: 99.1,
        ruleRef: 'Rule 6(1)(b)',
        status: 'verified'
      },
      {
        id: 'ocr-3',
        field: 'Net Quantity Declaration',
        detectedText: 'Net Qty: 100 g (Height: 2.8 mm)',
        standardValue: 'Min 2.0 mm required for <= 200g',
        confidence: 96.7,
        ruleRef: 'Rule 6(1)(c)',
        status: 'verified',
        charHeightMm: 2.8,
        minHeightReqMm: 2.0
      },
      {
        id: 'ocr-4',
        field: 'Month & Year of Manufacture',
        detectedText: 'MFD: 08/2026 | BEST BEFORE 6 MONTHS FROM PKG',
        standardValue: 'Compliant with Rule 6(1)(d)',
        confidence: 97.2,
        ruleRef: 'Rule 6(1)(d)',
        status: 'verified'
      },
      {
        id: 'ocr-5',
        field: 'Maximum Retail Price (MRP)',
        detectedText: 'MRP Rs. 25.00 (INCL. OF ALL TAXES)',
        standardValue: 'Compliant with Rule 6(1)(e)',
        confidence: 99.5,
        ruleRef: 'Rule 6(1)(e)',
        status: 'verified'
      },
      {
        id: 'ocr-6',
        field: 'Unit Sale Price (USP)',
        detectedText: '[NOT DETECTED / ABSENT ON LABEL]',
        standardValue: 'Rs. 0.25 / g required per Rule 6(1)(n)',
        confidence: 95.1,
        ruleRef: 'Rule 6(1)(n)',
        status: 'error'
      },
      {
        id: 'ocr-7',
        field: 'Consumer Care Helpline Details',
        detectedText: 'Feedback: feedback@britindia.com / Toll Free: 1800-4254449',
        standardValue: 'Compliant with Rule 6(1)(f)',
        confidence: 96.0,
        ruleRef: 'Rule 6(1)(f)',
        status: 'verified'
      },
      {
        id: 'ocr-8',
        field: 'Country of Origin',
        detectedText: 'Country of Origin: India',
        standardValue: 'Compliant with Rule 6(10)',
        confidence: 99.8,
        ruleRef: 'Rule 6(10)',
        status: 'verified'
      }
    ],
    rules: [
      {
        id: 'r-1',
        ruleName: 'Name and Address of Manufacturer / Packer',
        ruleNumber: 'Rule 6(1)(a)',
        status: 'PASS',
        reason: 'Complete registered office address and manufacturing unit clearly visible and verified.',
        confidence: 98.4,
        severity: 'Critical',
        category: 'Identity'
      },
      {
        id: 'r-2',
        ruleName: 'Generic or Common Name of Commodity',
        ruleNumber: 'Rule 6(1)(b)',
        status: 'PASS',
        reason: 'Unambiguous generic designation "Butter Cookies" prominently displayed on principal display panel.',
        confidence: 99.1,
        severity: 'Major',
        category: 'Identity'
      },
      {
        id: 'r-3',
        ruleName: 'Net Quantity Declaration & Numeral Size',
        ruleNumber: 'Rule 6(1)(c) & Sch-II',
        status: 'PASS',
        reason: 'Declared net weight 100g. Numeral font height is 2.8 mm, comfortably exceeding 2.0 mm statutory threshold.',
        confidence: 96.7,
        severity: 'Critical',
        category: 'Weights & Measures'
      },
      {
        id: 'r-4',
        ruleName: 'Month and Year of Manufacture / Packing',
        ruleNumber: 'Rule 6(1)(d)',
        status: 'PASS',
        reason: 'Clear two-digit month and four-digit year declaration (08/2026).',
        confidence: 97.2,
        severity: 'Major',
        category: 'Date Marking'
      },
      {
        id: 'r-5',
        ruleName: 'Retail Sale Price (MRP Inclusive of all Taxes)',
        ruleNumber: 'Rule 6(1)(e)',
        status: 'PASS',
        reason: 'Clear price printing with mandatory wording "incl. of all taxes" without price alteration or sticker smudging.',
        confidence: 99.5,
        severity: 'Critical',
        category: 'Pricing'
      },
      {
        id: 'r-6',
        ruleName: 'Unit Sale Price (USP) Declaration',
        ruleNumber: 'Rule 6(1)(n)',
        status: 'FAIL',
        reason: 'Mandatory Unit Sale Price (e.g. ₹0.25 per g) is completely missing from the principal display panel & price declaration. Violation under PCR Amendment Rules.',
        confidence: 95.1,
        severity: 'Critical',
        category: 'Pricing'
      },
      {
        id: 'r-7',
        ruleName: 'Consumer Care Contact Details',
        ruleNumber: 'Rule 6(1)(f)',
        status: 'PASS',
        reason: 'Officer-verified email, toll-free number and physical contact address provided.',
        confidence: 96.0,
        severity: 'Major',
        category: 'Consumer Redressal'
      }
    ],
    auditTimeline: [
      {
        id: 'aud-1',
        title: 'Inspection Created',
        timestamp: '2026-09-12 11:36:20 AM',
        actor: 'Officer Rajesh V. Sharma',
        role: 'Field Inspector (LM-OFF-MH-4019)',
        description: 'New physical inspection record opened at Reliance Smart Superstore via PackSure Mobile App v3.4.2. Device GPS tagged (19.1136° N, 72.8697° E).',
        digitalHash: 'SHA-256: 8f4b17...c38e',
        status: 'completed'
      },
      {
        id: 'aud-2',
        title: 'Images Uploaded',
        timestamp: '2026-09-12 11:40:05 AM',
        actor: 'PackSure Mobile Sync Engine',
        role: 'Automated Ingestion',
        description: 'High-resolution package evidence photograph securely uploaded with EXIF and cryptographic timestamping.',
        digitalHash: 'SHA-256: a1e92d...47bb',
        status: 'completed'
      },
      {
        id: 'aud-3',
        title: 'OCR Completed',
        timestamp: '2026-09-12 11:40:32 AM',
        actor: 'PackSure AI OCR & LayoutLM',
        role: 'Machine Learning Subsystem',
        description: 'Completed text recognition, key-value bounding box detection, and character height measurement at 97.2% average confidence.',
        digitalHash: 'SHA-256: e3c190...881f',
        status: 'completed'
      },
      {
        id: 'aud-4',
        title: 'Rule Evaluation Completed',
        timestamp: '2026-09-12 11:41:15 AM',
        actor: 'LM-PCR Rule Engine v2026.3',
        role: 'Automated Regulatory Engine',
        description: 'Evaluated 7 statutory rules under Legal Metrology Act 2009 & Packaged Commodities Rules 2011. 1 Critical Violation flagged (Rule 6(1)(n)).',
        digitalHash: 'SHA-256: d085bc...fa22',
        status: 'completed'
      },
      {
        id: 'aud-5',
        title: 'Supervisor Review',
        timestamp: '2026-09-13 09:15:00 AM',
        actor: 'Supervisor Amit K. Deshmukh',
        role: 'Legal Metrology Supervisor',
        description: 'Inspection dossier opened for supervisory audit and decision determination.',
        status: 'in-progress'
      },
      {
        id: 'aud-6',
        title: 'Final Decision',
        timestamp: 'Awaiting Supervisor Action',
        actor: 'Supervisor Portal',
        role: 'Authorized Officer',
        description: 'Awaiting formal legal metrology action (Confirmation, Reinspection order, or Notice issuance under Section 39).',
        status: 'pending'
      }
    ]
  },
  {
    id: 'INS-2026-0840',
    productName: 'Tata Salt Vacuum Evaporated Iodised Salt 1kg',
    brand: 'Tata Consumer Products Ltd',
    category: 'Staples & Seasonings',
    batchNumber: 'TS-2026-SEP-09',
    companyName: 'Tata Consumer Products Limited',
    companyEmail: 'regulatory.consumer@tataconsumer.com',
    location: 'DMart Hypermarket, Borivali West, Mumbai',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    inspectionDate: '2026-09-12 02:15 PM',
    officerName: 'Sunita P. Jadhav',
    officerBadge: 'LM-OFF-MH-3108',
    officerZone: 'North Zone - Sector 4',
    officerPhone: '+91 97654 33210',
    aiComplianceResult: 'Compliant',
    aiComplianceScore: 98,
    supervisorDecision: 'Confirmed Compliant',
    supervisorComment: 'Inspected and verified against physical sample. All statutory declarations comply with Legal Metrology Rules 2011 and FSSAI packaging mandates.',
    supervisorReviewDate: '2026-09-12 04:30 PM',
    supervisorName: 'Amit K. Deshmukh',
    priority: 'Low',
    retailOutlet: 'DMart Hypermarket (Store #108)',
    measurements: {
      grossWeight: {
        declared: 1012.0,
        measured: 1014.2,
        unit: 'g',
        deviationPercent: 0.22,
        passed: true,
        notes: 'Pouch packaging weight 13.8g accounted for'
      },
      netWeight: {
        declared: 1000.0,
        measured: 1000.4,
        unit: 'g',
        maxPermissibleError: 15.0, // 15g under Schedule IV for 1000g
        deviationPercent: 0.04,
        passed: true,
        notes: 'Strict compliance with net weight declaration'
      },
      dimensions: {
        length: 220,
        width: 140,
        height: 48,
        unit: 'mm',
        volumeCc: 1478.4,
        passed: true
      },
      tareWeight: {
        measured: 13.8,
        unit: 'g'
      }
    },
    evidence: [
      {
        id: 'ev-2-front',
        type: 'front',
        title: 'Primary Display Panel (Tata Salt 1kg Pouch Label)',
        url: 'https://images.openfoodfacts.org/images/products/890/404/390/1015/front_en.34.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-12 02:11:10 PM',
        annotations: [
          { x: 18, y: 12, width: 64, height: 25, label: 'Tata Salt Identity & Desh Ka Namak', confidence: 99.8, valid: true },
          { x: 28, y: 64, width: 44, height: 20, label: 'Net Quantity: "1 kg"', confidence: 99.4, valid: true },
          { x: 75, y: 12, width: 18, height: 18, label: 'FSSAI License Mark', confidence: 99.0, valid: true }
        ]
      },
      {
        id: 'ev-2-back',
        type: 'back',
        title: 'Back Declarations & Manufacturer Address Label',
        url: 'https://images.openfoodfacts.org/images/products/890/404/390/1015/ingredients_en.36.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-12 02:11:25 PM',
        annotations: [
          { x: 10, y: 10, width: 80, height: 32, label: 'Tata Consumer Products Ltd, Kolkata', confidence: 99.1, valid: true },
          { x: 12, y: 46, width: 76, height: 24, label: 'Ingredients: Edible Common Salt, Potassium Iodate', confidence: 98.8, valid: true },
          { x: 15, y: 72, width: 70, height: 20, label: 'MRP ₹28.00 (USP ₹0.028 / g)', confidence: 99.6, valid: true }
        ]
      },
      {
        id: 'ev-2-nutri',
        type: 'label',
        title: 'Nutritional & Iodine Enrichment Panel Label',
        url: 'https://images.openfoodfacts.org/images/products/890/404/390/1015/nutrition_en.38.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-12 02:11:38 PM',
        annotations: [
          { x: 12, y: 15, width: 76, height: 45, label: 'Nutritional Facts & 15 PPM Iodine Guarantee', confidence: 98.2, valid: true },
          { x: 14, y: 64, width: 72, height: 26, label: 'Storage & Quality Certifications', confidence: 97.9, valid: true }
        ]
      },
      {
        id: 'ev-2-pkg',
        type: 'side',
        title: 'Barcode & Batch Laser Stamp',
        url: 'https://images.openfoodfacts.org/images/products/890/404/390/1015/packaging_en.40.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-12 02:11:45 PM',
        annotations: [
          { x: 20, y: 25, width: 60, height: 40, label: 'EAN-13 Barcode 8904043901015', confidence: 99.2, valid: true },
          { x: 18, y: 68, width: 64, height: 22, label: 'Batch No: TS-2026-B812 & Pkd Date', confidence: 98.7, valid: true }
        ]
      }
    ],
    ocrResults: [
      {
        id: 'ocr-11',
        field: 'Manufacturer / Packer Declaration',
        detectedText: 'Tata Consumer Products Ltd., 1, Bishop Lefroy Road, Kolkata 700020',
        standardValue: 'Compliant with Rule 6(1)(a)',
        confidence: 99.4,
        ruleRef: 'Rule 6(1)(a)',
        status: 'verified'
      },
      {
        id: 'ocr-12',
        field: 'Generic Name of Commodity',
        detectedText: 'IODISED SALT (VACUUM EVAPORATED)',
        standardValue: 'Compliant with Rule 6(1)(b)',
        confidence: 99.7,
        ruleRef: 'Rule 6(1)(b)',
        status: 'verified'
      },
      {
        id: 'ocr-13',
        field: 'Net Quantity Declaration',
        detectedText: 'Net Weight: 1 kg (Numeral height: 4.2 mm)',
        standardValue: 'Min 4.0 mm required for 1kg package',
        confidence: 99.2,
        ruleRef: 'Rule 6(1)(c)',
        status: 'verified',
        charHeightMm: 4.2,
        minHeightReqMm: 4.0
      },
      {
        id: 'ocr-14',
        field: 'Unit Sale Price (USP)',
        detectedText: 'Unit Sale Price: Rs. 0.028 / g (incl. taxes)',
        standardValue: 'Compliant with Rule 6(1)(n)',
        confidence: 98.8,
        ruleRef: 'Rule 6(1)(n)',
        status: 'verified'
      },
      {
        id: 'ocr-15',
        field: 'Maximum Retail Price',
        detectedText: 'MRP Rs. 28.00 (INCL. OF ALL TAXES)',
        standardValue: 'Compliant with Rule 6(1)(e)',
        confidence: 99.6,
        ruleRef: 'Rule 6(1)(e)',
        status: 'verified'
      }
    ],
    rules: [
      {
        id: 'r-11',
        ruleName: 'Name and Address of Manufacturer / Packer',
        ruleNumber: 'Rule 6(1)(a)',
        status: 'PASS',
        reason: 'Registered manufacturer name, corporate entity, and production unit properly declared.',
        confidence: 99.4,
        severity: 'Critical',
        category: 'Identity'
      },
      {
        id: 'r-12',
        ruleName: 'Generic or Common Name of Commodity',
        ruleNumber: 'Rule 6(1)(b)',
        status: 'PASS',
        reason: 'Unambiguous commodity designation printed on principal display face.',
        confidence: 99.7,
        severity: 'Major',
        category: 'Identity'
      },
      {
        id: 'r-13',
        ruleName: 'Net Quantity & Numeral Size Standards',
        ruleNumber: 'Rule 6(1)(c) & Sch-II',
        status: 'PASS',
        reason: 'Numeral height 4.2 mm meets statutory requirement (> 4.0 mm for 1kg).',
        confidence: 99.2,
        severity: 'Critical',
        category: 'Weights & Measures'
      },
      {
        id: 'r-14',
        ruleName: 'Unit Sale Price (USP) Declaration',
        ruleNumber: 'Rule 6(1)(n)',
        status: 'PASS',
        reason: 'USP explicitly stated as ₹0.028 / g adjacent to MRP in compliant font.',
        confidence: 98.8,
        severity: 'Critical',
        category: 'Pricing'
      },
      {
        id: 'r-15',
        ruleName: 'MRP Declaration',
        ruleNumber: 'Rule 6(1)(e)',
        status: 'PASS',
        reason: 'Maximum retail price compliant with inclusive taxes declaration.',
        confidence: 99.6,
        severity: 'Critical',
        category: 'Pricing'
      }
    ],
    auditTimeline: [
      {
        id: 'aud-11',
        title: 'Inspection Created',
        timestamp: '2026-09-12 02:10:00 PM',
        actor: 'Officer Sunita P. Jadhav',
        role: 'Field Inspector (LM-OFF-MH-3108)',
        description: 'Routine market surveillance inspection initiated at DMart Borivali West.',
        digitalHash: 'SHA-256: 41ad02...7719',
        status: 'completed'
      },
      {
        id: 'aud-12',
        title: 'Images Uploaded',
        timestamp: '2026-09-12 02:14:15 PM',
        actor: 'PackSure Mobile Sync Engine',
        role: 'Automated Ingestion',
        description: '5 high-resolution calibrated images uploaded with cryptographic watermark.',
        digitalHash: 'SHA-256: 89ee14...10cc',
        status: 'completed'
      },
      {
        id: 'aud-13',
        title: 'OCR Completed',
        timestamp: '2026-09-12 02:14:48 PM',
        actor: 'PackSure AI OCR',
        role: 'Machine Learning Subsystem',
        description: 'All 8 statutory fields extracted with 99.1% average confidence score.',
        digitalHash: 'SHA-256: ffa208...32e1',
        status: 'completed'
      },
      {
        id: 'aud-14',
        title: 'Rule Evaluation Completed',
        timestamp: '2026-09-12 02:15:30 PM',
        actor: 'LM-PCR Rule Engine v2026.3',
        role: 'Automated Regulatory Engine',
        description: 'All 7 legal rules passed without non-conformities.',
        digitalHash: 'SHA-256: 31209b...55bb',
        status: 'completed'
      },
      {
        id: 'aud-15',
        title: 'Supervisor Review',
        timestamp: '2026-09-12 04:25:00 PM',
        actor: 'Supervisor Amit K. Deshmukh',
        role: 'Legal Metrology Supervisor',
        description: 'Inspected visual package evidence, verified weight scale calibration slip.',
        digitalHash: 'SHA-256: bba901...187a',
        status: 'completed'
      },
      {
        id: 'aud-16',
        title: 'Final Decision',
        timestamp: '2026-09-12 04:30:00 PM',
        actor: 'Supervisor Amit K. Deshmukh',
        role: 'Legal Metrology Supervisor',
        description: 'Official confirmation: Confirmed Compliant. Compliance certificate generated.',
        digitalHash: 'SHA-256: 12de99...43cf',
        status: 'completed'
      }
    ]
  },
  {
    id: 'INS-2026-0839',
    productName: 'Maggi 2-Minute Special Masala Instant Noodles 70g',
    brand: 'Nestlé India Ltd',
    category: 'Packaged Food & Snacks',
    batchNumber: 'MG-IN-260901',
    companyName: 'Nestlé India Limited',
    companyEmail: 'wecare@in.nestle.com',
    location: 'Nature Basket Gourmet Store, Bandra West, Mumbai',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    inspectionDate: '2026-09-12 04:50 PM',
    officerName: 'Rajesh V. Sharma',
    officerBadge: 'LM-OFF-MH-4019',
    officerZone: 'West Zone - Region 2',
    officerPhone: '+91 98201 44521',
    aiComplianceResult: 'Partially Compliant',
    aiComplianceScore: 82,
    supervisorDecision: 'Pending Review',
    supervisorComment: '',
    priority: 'Medium',
    retailOutlet: 'Nature Basket (Store #33)',
    measurements: {
      grossWeight: {
        declared: 74.0,
        measured: 73.6,
        unit: 'g',
        deviationPercent: -0.54,
        passed: true,
        notes: 'Pouch wrapper 3.8g'
      },
      netWeight: {
        declared: 70.0,
        measured: 69.8,
        unit: 'g',
        maxPermissibleError: 3.15, // 4.5% of 70g
        deviationPercent: -0.28,
        passed: true,
        notes: 'Within Schedule-IV MPE'
      },
      dimensions: {
        length: 130,
        width: 105,
        height: 25,
        unit: 'mm',
        volumeCc: 341.2,
        passed: true
      },
      tareWeight: {
        measured: 3.8,
        unit: 'g'
      }
    },
    evidence: [
      {
        id: 'ev-3-front',
        type: 'front',
        title: 'Primary Display Panel (Maggi 70g Packet Label)',
        url: 'https://images.openfoodfacts.org/images/products/890/105/890/1511/front_en.26.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-12 04:45:10 PM',
        annotations: [
          { x: 14, y: 16, width: 68, height: 28, label: 'Maggi Brand & 2-Minute Noodles Identity', confidence: 99.3, valid: true },
          { x: 68, y: 76, width: 24, height: 16, label: 'Net Weight "70g" (Font 1.82mm - Non-Compliant)', confidence: 94.2, valid: false },
          { x: 10, y: 20, width: 80, height: 28, label: 'MRP ₹ 15.00 (USP ₹0.21/g)', confidence: 98.9, valid: true }
        ]
      },
      {
        id: 'ev-3-decl',
        type: 'back',
        title: 'Mandatory Ingredients & Nestle Packer Declaration',
        url: 'https://images.openfoodfacts.org/images/products/890/105/890/1511/ingredients_en.11.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-12 04:45:22 PM',
        annotations: [
          { x: 12, y: 12, width: 76, height: 38, label: 'Mfd by: Nestlé India Limited, New Delhi 110001', confidence: 98.4, valid: true },
          { x: 14, y: 52, width: 72, height: 26, label: 'FSSAI Lic. No. 10012011000168', confidence: 99.1, valid: true },
          { x: 16, y: 78, width: 68, height: 18, label: 'Consumer Care Toll-Free 1800 103 1947', confidence: 97.9, valid: true }
        ]
      },
      {
        id: 'ev-3-nutri',
        type: 'label',
        title: 'Nutritional Compass & Mineral Claims Label',
        url: 'https://images.openfoodfacts.org/images/products/890/105/890/1511/nutrition_en.20.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-12 04:45:34 PM',
        annotations: [
          { x: 10, y: 15, width: 80, height: 48, label: 'Nutritional Values per Serve / 100g', confidence: 98.1, valid: true },
          { x: 12, y: 65, width: 76, height: 26, label: 'Iron & Carbohydrate RDA Percentages', confidence: 96.5, valid: true }
        ]
      }
    ],
    ocrResults: [
      {
        id: 'ocr-21',
        field: 'Net Quantity Declaration Numeral Height',
        detectedText: 'Net Weight: 70 g (Numeral Height: 1.82 mm)',
        standardValue: 'Minimum 2.0 mm required for Net Wt <= 200g (Schedule-II)',
        confidence: 94.2,
        ruleRef: 'Rule 6(1)(c) & Sch-II',
        status: 'warning',
        charHeightMm: 1.82,
        minHeightReqMm: 2.0
      },
      {
        id: 'ocr-22',
        field: 'Unit Sale Price',
        detectedText: 'USP: Rs. 0.21 / g (incl. of all taxes)',
        standardValue: 'Compliant with Rule 6(1)(n)',
        confidence: 98.9,
        ruleRef: 'Rule 6(1)(n)',
        status: 'verified'
      },
      {
        id: 'ocr-23',
        field: 'Consumer Care Contact Details',
        detectedText: 'Nestle Consumer Services, P.O. Box 21, New Delhi-110001 / wecare@in.nestle.com',
        standardValue: 'Compliant with Rule 6(1)(f)',
        confidence: 98.4,
        ruleRef: 'Rule 6(1)(f)',
        status: 'verified'
      }
    ],
    rules: [
      {
        id: 'r-21',
        ruleName: 'Minimum Height of Numerals for Net Quantity',
        ruleNumber: 'Rule 6(1)(c) & Sch-II',
        status: 'FAIL',
        reason: 'Font height of numeral "70" is measured at 1.82 mm, which is below the mandatory minimum of 2.0 mm specified under Second Schedule Table-I.',
        confidence: 94.2,
        severity: 'Major',
        category: 'Typography & Readability'
      },
      {
        id: 'r-22',
        ruleName: 'Unit Sale Price (USP)',
        ruleNumber: 'Rule 6(1)(n)',
        status: 'PASS',
        reason: 'Declared Unit Sale Price is formatted per statutory standard (₹0.21 / g).',
        confidence: 98.9,
        severity: 'Critical',
        category: 'Pricing'
      },
      {
        id: 'r-23',
        ruleName: 'MRP Inclusive of Taxes',
        ruleNumber: 'Rule 6(1)(e)',
        status: 'PASS',
        reason: 'Clear MRP ₹15.00 with inclusive statement.',
        confidence: 99.2,
        severity: 'Critical',
        category: 'Pricing'
      }
    ],
    auditTimeline: [
      {
        id: 'aud-21',
        title: 'Inspection Created',
        timestamp: '2026-09-12 04:42:00 PM',
        actor: 'Officer Rajesh V. Sharma',
        role: 'Field Inspector (LM-OFF-MH-4019)',
        description: 'Random retail audit triggered at Nature Basket Bandra West.',
        status: 'completed'
      },
      {
        id: 'aud-22',
        title: 'Images Uploaded',
        timestamp: '2026-09-12 04:48:40 PM',
        actor: 'PackSure Mobile Sync Engine',
        role: 'Automated Ingestion',
        description: 'Captured macro imagery of principal display panel and numeral measurements.',
        status: 'completed'
      },
      {
        id: 'aud-23',
        title: 'OCR Completed',
        timestamp: '2026-09-12 04:49:12 PM',
        actor: 'PackSure AI OCR',
        role: 'Machine Learning Subsystem',
        description: 'Computer vision micron measurement detected 1.82 mm font height on 70g numeral.',
        status: 'completed'
      },
      {
        id: 'aud-24',
        title: 'Rule Evaluation Completed',
        timestamp: '2026-09-12 04:49:55 PM',
        actor: 'LM-PCR Rule Engine v2026.3',
        role: 'Automated Regulatory Engine',
        description: 'Partially Compliant: Second Schedule font threshold violation flagged.',
        status: 'completed'
      },
      {
        id: 'aud-25',
        title: 'Supervisor Review',
        timestamp: 'Pending',
        actor: 'Supervisor Portal',
        role: 'Supervisor Queue',
        description: 'Awaiting review of borderline font height determination.',
        status: 'pending'
      },
      {
        id: 'aud-26',
        title: 'Final Decision',
        timestamp: 'Pending',
        actor: 'Supervisor Portal',
        role: 'Authorized Officer',
        description: 'Pending determination.',
        status: 'pending'
      }
    ]
  },
  {
    id: 'INS-2026-0838',
    productName: 'Fortune Sunlite Refined Sunflower Oil 1L Pouch',
    brand: 'Adani Wilmar Ltd',
    category: 'Edible Oils & Fats',
    batchNumber: 'FS-2026-0881',
    companyName: 'Adani Wilmar Limited',
    companyEmail: 'regulatory@adaniwilmar.in',
    location: 'Avenue Supermarts, Thane West, Maharashtra',
    district: 'Thane',
    state: 'Maharashtra',
    inspectionDate: '2026-09-11 11:20 AM',
    officerName: 'Pooja R. Kulkarni',
    officerBadge: 'LM-OFF-MH-5120',
    officerZone: 'Central Zone - Region 1',
    officerPhone: '+91 98332 11984',
    aiComplianceResult: 'Non-Compliant',
    aiComplianceScore: 54,
    supervisorDecision: 'Confirmed Non-Compliant',
    supervisorComment: 'Notice under Section 39 of Legal Metrology Act issued. Pouch declared volume in liters without mandatory mass in grams/kg at 30°C for edible oils, in direct contravention of Rule 12(2) & 13.',
    supervisorReviewDate: '2026-09-11 03:45 PM',
    supervisorName: 'Amit K. Deshmukh',
    priority: 'High',
    retailOutlet: 'Avenue Supermarts (DMart Thane)',
    measurements: {
      grossWeight: {
        declared: 925.0,
        measured: 902.0,
        unit: 'g',
        deviationPercent: -2.48,
        passed: false,
        notes: 'Significant deficit in declared equivalent mass at standard 30 deg Celsius'
      },
      netWeight: {
        declared: 910.0,
        measured: 888.5,
        unit: 'g',
        maxPermissibleError: 15.0,
        deviationPercent: -2.36,
        passed: false,
        notes: 'Violates Schedule IV Max Permissible Error'
      },
      dimensions: {
        length: 250,
        width: 160,
        height: 45,
        unit: 'mm',
        volumeCc: 1800.0,
        passed: true
      },
      tareWeight: {
        measured: 13.5,
        unit: 'g'
      }
    },
    evidence: [
      {
        id: 'ev-4-front',
        type: 'front',
        title: 'Primary Display Panel (Fortune Sunflower Oil 1L Pouch Label)',
        url: 'https://images.openfoodfacts.org/images/products/890/600/728/0242/front_en.18.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-11 11:15:20 AM',
        annotations: [
          { x: 18, y: 14, width: 64, height: 26, label: 'Fortune Sunlite Refined Sunflower Oil Brand', confidence: 99.4, valid: true },
          { x: 28, y: 68, width: 44, height: 22, label: 'Missing Equivalent Mass (g/kg at 30°C) Non-Compliant', confidence: 96.8, valid: false },
          { x: 12, y: 18, width: 76, height: 26, label: 'MRP ₹ 145.00 Declared', confidence: 99.1, valid: true }
        ]
      },
      {
        id: 'ev-4-decl',
        type: 'back',
        title: 'Manufacturer Declarations & Adani Wilmar Details',
        url: 'https://images.openfoodfacts.org/images/products/890/600/728/0242/ingredients_en.13.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-11 11:15:32 AM',
        annotations: [
          { x: 12, y: 12, width: 76, height: 36, label: 'Adani Wilmar Ltd, Fortune House, Ahmedabad', confidence: 98.1, valid: true },
          { x: 14, y: 52, width: 72, height: 24, label: 'Refined Edible Oil Rule 12 Compliance Defect', confidence: 97.4, valid: false }
        ]
      },
      {
        id: 'ev-4-nutri',
        type: 'label',
        title: 'Nutrition Facts & Fortification (Vit A & D) Panel Label',
        url: 'https://images.openfoodfacts.org/images/products/890/600/728/0242/nutrition_en.22.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-11 11:15:45 AM',
        annotations: [
          { x: 10, y: 14, width: 80, height: 46, label: 'Energy, SFA, MUFA, PUFA per 100g', confidence: 98.3, valid: true },
          { x: 12, y: 64, width: 76, height: 26, label: 'Added Vitamin A & D2 Fortification (+F Logo)', confidence: 97.9, valid: true }
        ]
      },
      {
        id: 'ev-4-pkg',
        type: 'side',
        title: 'Batch Code, Packaging Date & Barcode Stamp',
        url: 'https://images.openfoodfacts.org/images/products/890/600/728/0242/packaging_en.11.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-11 11:15:58 AM',
        annotations: [
          { x: 18, y: 22, width: 64, height: 42, label: 'EAN Barcode 8906007280242', confidence: 98.9, valid: true },
          { x: 15, y: 68, width: 70, height: 24, label: 'Batch No: ADW-2026-SO-088 Stamp', confidence: 97.8, valid: true }
        ]
      }
    ],
    ocrResults: [
      {
        id: 'ocr-31',
        field: 'Edible Oil Dual Declaration (Volume & Mass)',
        detectedText: 'Net Volume: 1 Litre [Mass in grams missing]',
        standardValue: 'Mandatory dual declaration in Litres AND equivalent mass in kg/g at 30°C',
        confidence: 96.8,
        ruleRef: 'Rule 12(2) & 13',
        status: 'error'
      },
      {
        id: 'ocr-32',
        field: 'Manufacturer Address',
        detectedText: 'Adani Wilmar Ltd, Fortune House, Near Navrangpura Rly Crossing, Ahmedabad 380009',
        standardValue: 'Compliant with Rule 6(1)(a)',
        confidence: 99.1,
        ruleRef: 'Rule 6(1)(a)',
        status: 'verified'
      }
    ],
    rules: [
      {
        id: 'r-31',
        ruleName: 'Manner of Declaration of Quantity for Edible Oils',
        ruleNumber: 'Rule 12(2) & Rule 13',
        status: 'FAIL',
        reason: 'Edible oils must declare quantity in volume (litres) AND equivalent mass (grams/kg) at 30°C. Only volume is declared.',
        confidence: 96.8,
        severity: 'Critical',
        category: 'Weights & Measures'
      },
      {
        id: 'r-32',
        ruleName: 'Max Permissible Error on Net Quantity',
        ruleNumber: 'Schedule IV',
        status: 'FAIL',
        reason: 'Measured net mass is 888.5g against expected standard 910g for 1L sunflower oil, exceeding allowed MPE of 15g.',
        confidence: 98.2,
        severity: 'Critical',
        category: 'Weights & Measures'
      }
    ],
    auditTimeline: [
      {
        id: 'aud-31',
        title: 'Inspection Created',
        timestamp: '2026-09-11 11:12:00 AM',
        actor: 'Officer Pooja R. Kulkarni',
        role: 'Field Inspector (LM-OFF-MH-5120)',
        description: 'Physical inspection and digital tare mass testing completed.',
        status: 'completed'
      },
      {
        id: 'aud-32',
        title: 'Images Uploaded',
        timestamp: '2026-09-11 11:18:20 AM',
        actor: 'PackSure Mobile Sync Engine',
        role: 'Automated Ingestion',
        description: '5 high resolution photos uploaded.',
        status: 'completed'
      },
      {
        id: 'aud-33',
        title: 'OCR Completed',
        timestamp: '2026-09-11 11:19:05 AM',
        actor: 'PackSure AI OCR',
        role: 'Machine Learning Subsystem',
        description: 'Missing mass declaration identified.',
        status: 'completed'
      },
      {
        id: 'aud-34',
        title: 'Rule Evaluation Completed',
        timestamp: '2026-09-11 11:19:40 AM',
        actor: 'LM-PCR Rule Engine v2026.3',
        role: 'Automated Regulatory Engine',
        description: 'Double failure: Rule 12(2) & Schedule IV MPE breached.',
        status: 'completed'
      },
      {
        id: 'aud-35',
        title: 'Supervisor Review',
        timestamp: '2026-09-11 03:30:00 PM',
        actor: 'Supervisor Amit K. Deshmukh',
        role: 'Legal Metrology Supervisor',
        description: 'Case audited and verified against laboratory scale readings.',
        status: 'completed'
      },
      {
        id: 'aud-36',
        title: 'Final Decision',
        timestamp: '2026-09-11 03:45:00 PM',
        actor: 'Supervisor Amit K. Deshmukh',
        role: 'Legal Metrology Supervisor',
        description: 'Confirmed Non-Compliant. Formal Legal Notice under Section 39 forwarded to Legal Cell.',
        status: 'completed'
      }
    ]
  },
  {
    id: 'INS-2026-0837',
    productName: 'Cadbury Dairy Milk Silk Chocolate 150g',
    brand: 'Mondelez India Foods Pvt Ltd',
    category: 'Confectionery & Sweets',
    batchNumber: 'CD-2026-B982',
    companyName: 'Mondelez India Foods Private Limited',
    companyEmail: 'consumercomplaints@mdlz.com',
    location: 'Haiko Supermarket, Powai, Mumbai',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    inspectionDate: '2026-09-10 03:10 PM',
    officerName: 'Sanjay S. Patil',
    officerBadge: 'LM-OFF-MH-2940',
    officerZone: 'Central Zone - Region 3',
    officerPhone: '+91 98190 66723',
    aiComplianceResult: 'Non-Compliant',
    aiComplianceScore: 62,
    supervisorDecision: 'Order Reinspection',
    supervisorComment: 'Price declaration in lot B982 had thermal print smudging where the last numeral was ambiguous. Reinspection ordered for fresh warehouse lot B985 to confirm production line printer alignment.',
    supervisorReviewDate: '2026-09-10 05:20 PM',
    supervisorName: 'Amit K. Deshmukh',
    priority: 'Medium',
    retailOutlet: 'Haiko Supermarket (Powai Store)',
    reinspectionHistory: {
      isReinspection: false,
      childInspectionId: 'RE-INS-2026-0837-B',
      originalBatch: 'CD-2026-B982',
      newBatch: 'CD-2026-B985',
      orderReason: 'Thermal printer ink smudge in price declaration panel made retail price illegible.'
    },
    measurements: {
      grossWeight: {
        declared: 158.0,
        measured: 157.9,
        unit: 'g',
        deviationPercent: -0.06,
        passed: true,
        notes: 'Foil and carton tare accounted'
      },
      netWeight: {
        declared: 150.0,
        measured: 150.2,
        unit: 'g',
        maxPermissibleError: 4.5,
        deviationPercent: 0.13,
        passed: true,
        notes: 'Weight passed'
      },
      dimensions: {
        length: 195,
        width: 85,
        height: 14,
        unit: 'mm',
        volumeCc: 232.0,
        passed: true
      },
      tareWeight: {
        measured: 7.7,
        unit: 'g'
      }
    },
    evidence: [
      {
        id: 'ev-5-front',
        type: 'front',
        title: 'Primary Display Panel (Cadbury Dairy Milk Silk 150g Wrapper Label)',
        url: 'https://images.openfoodfacts.org/images/products/762/220/114/8782/front_en.27.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-10 03:05:10 PM',
        annotations: [
          { x: 18, y: 18, width: 64, height: 30, label: 'Cadbury Dairy Milk Silk Brand Identity', confidence: 99.7, valid: true },
          { x: 14, y: 55, width: 72, height: 35, label: 'Smudged MRP Inkjet Area "Rs. 1?5.00" Defect', confidence: 64.2, valid: false }
        ]
      },
      {
        id: 'ev-5-decl',
        type: 'back',
        title: 'Mondelez Manufacturer Declarations & Ingredients Label',
        url: 'https://images.openfoodfacts.org/images/products/762/220/114/8782/ingredients_en.11.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-10 03:05:25 PM',
        annotations: [
          { x: 12, y: 12, width: 76, height: 38, label: 'Mondelez India Foods Pvt Ltd, Mumbai 400018', confidence: 99.2, valid: true },
          { x: 14, y: 54, width: 72, height: 28, label: 'Cocoa Butter & Milk Solids Ingredients', confidence: 98.1, valid: true }
        ]
      },
      {
        id: 'ev-5-nutri',
        type: 'label',
        title: 'Nutritional Values & Allergen Statement Label',
        url: 'https://images.openfoodfacts.org/images/products/762/220/114/8782/nutrition_en.29.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-10 03:05:38 PM',
        annotations: [
          { x: 10, y: 14, width: 80, height: 52, label: 'Energy, Protein, Total Fat per 100g', confidence: 98.6, valid: true },
          { x: 12, y: 68, width: 76, height: 24, label: 'Allergen Advice: Contains Milk, Soya', confidence: 97.9, valid: true }
        ]
      }
    ],
    ocrResults: [
      {
        id: 'ocr-41',
        field: 'Maximum Retail Price Readability',
        detectedText: 'MRP Rs. 1[SMUDGE]5.00 (INCL. TAXES)',
        standardValue: 'Must be clearly legible and unsmudged per Rule 6(1)(e)',
        confidence: 64.2,
        ruleRef: 'Rule 6(1)(e)',
        status: 'error'
      },
      {
        id: 'ocr-42',
        field: 'Unit Sale Price',
        detectedText: 'USP: Rs. 1.16 / g',
        standardValue: 'Compliant with Rule 6(1)(n)',
        confidence: 97.4,
        ruleRef: 'Rule 6(1)(n)',
        status: 'verified'
      }
    ],
    rules: [
      {
        id: 'r-41',
        ruleName: 'Clarity and Legibility of Retail Sale Price',
        ruleNumber: 'Rule 6(1)(e)',
        status: 'FAIL',
        reason: 'MRP numeral is obscured by ink smudging on thermal printer ribbon, making it ambiguous whether price is ₹125, ₹175 or ₹195.',
        confidence: 64.2,
        severity: 'Critical',
        category: 'Pricing'
      },
      {
        id: 'r-42',
        ruleName: 'Net Quantity & Numeral Height',
        ruleNumber: 'Rule 6(1)(c)',
        status: 'PASS',
        reason: '150g numeral height 3.1mm exceeds 2.0mm threshold.',
        confidence: 99.0,
        severity: 'Critical',
        category: 'Weights & Measures'
      }
    ],
    auditTimeline: [
      {
        id: 'aud-41',
        title: 'Inspection Created',
        timestamp: '2026-09-10 03:02:00 PM',
        actor: 'Officer Sanjay S. Patil',
        role: 'Field Inspector (LM-OFF-MH-2940)',
        description: 'Routine retail inspection initiated.',
        status: 'completed'
      },
      {
        id: 'aud-42',
        title: 'Images Uploaded',
        timestamp: '2026-09-10 03:08:15 PM',
        actor: 'PackSure Mobile Sync Engine',
        role: 'Automated Ingestion',
        description: 'Uploaded 5 photos including macro capture of smudged MRP.',
        status: 'completed'
      },
      {
        id: 'aud-43',
        title: 'OCR Completed',
        timestamp: '2026-09-10 03:08:50 PM',
        actor: 'PackSure AI OCR',
        role: 'Machine Learning Subsystem',
        description: 'Low confidence character classification (64.2%) on price numeral.',
        status: 'completed'
      },
      {
        id: 'aud-44',
        title: 'Rule Evaluation Completed',
        timestamp: '2026-09-10 03:09:25 PM',
        actor: 'LM-PCR Rule Engine v2026.3',
        role: 'Automated Regulatory Engine',
        description: 'Rule 6(1)(e) failed due to illegibility.',
        status: 'completed'
      },
      {
        id: 'aud-45',
        title: 'Supervisor Review',
        timestamp: '2026-09-10 05:15:00 PM',
        actor: 'Supervisor Amit K. Deshmukh',
        role: 'Legal Metrology Supervisor',
        description: 'Reviewed illegibility issue.',
        status: 'completed'
      },
      {
        id: 'aud-46',
        title: 'Final Decision',
        timestamp: '2026-09-10 05:20:00 PM',
        actor: 'Supervisor Amit K. Deshmukh',
        role: 'Legal Metrology Supervisor',
        description: 'Order Reinspection: New Lot B985 ordered for verification of print clarity.',
        status: 'completed'
      }
    ]
  },
  {
    id: 'RE-INS-2026-0837-B',
    productName: 'Cadbury Dairy Milk Silk Chocolate 150g (Reinspection Lot)',
    brand: 'Mondelez India Foods Pvt Ltd',
    category: 'Confectionery & Sweets',
    batchNumber: 'CD-2026-B985',
    companyName: 'Mondelez India Foods Private Limited',
    companyEmail: 'consumercomplaints@mdlz.com',
    location: 'Haiko Supermarket, Powai, Mumbai',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    inspectionDate: '2026-09-12 10:15 AM',
    officerName: 'Sanjay S. Patil',
    officerBadge: 'LM-OFF-MH-2940',
    officerZone: 'Central Zone - Region 3',
    officerPhone: '+91 98190 66723',
    aiComplianceResult: 'Compliant',
    aiComplianceScore: 99,
    supervisorDecision: 'Confirmed Compliant',
    supervisorComment: 'Reinspection completed on replacement batch CD-2026-B985. Thermal print ribbon recalibration verified. Clear legible printing of MRP ₹175.00 and USP ₹1.17/g. Case successfully closed.',
    supervisorReviewDate: '2026-09-12 01:30 PM',
    supervisorName: 'Amit K. Deshmukh',
    priority: 'Low',
    retailOutlet: 'Haiko Supermarket (Powai Store)',
    reinspectionHistory: {
      isReinspection: true,
      parentInspectionId: 'INS-2026-0837',
      originalBatch: 'CD-2026-B982',
      newBatch: 'CD-2026-B985',
      orderReason: 'Follow-up inspection after rectification of thermal printer smudging.'
    },
    measurements: {
      grossWeight: {
        declared: 158.0,
        measured: 158.2,
        unit: 'g',
        deviationPercent: 0.13,
        passed: true,
        notes: 'Carton and foil packaging verified'
      },
      netWeight: {
        declared: 150.0,
        measured: 150.4,
        unit: 'g',
        maxPermissibleError: 4.5,
        deviationPercent: 0.27,
        passed: true,
        notes: 'Net weight verified compliant'
      },
      dimensions: {
        length: 195,
        width: 85,
        height: 14,
        unit: 'mm',
        volumeCc: 232.0,
        passed: true
      },
      tareWeight: {
        measured: 7.8,
        unit: 'g'
      }
    },
    evidence: [
      {
        id: 'ev-6-front',
        type: 'front',
        title: 'Reinspected Primary Display Panel (Silk 150g Corrected Batch)',
        url: 'https://images.openfoodfacts.org/images/products/762/220/114/8782/front_en.27.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-12 10:10:00 AM',
        annotations: [
          { x: 18, y: 18, width: 64, height: 30, label: 'Silk Logo & Brand Identity Validated', confidence: 99.8, valid: true },
          { x: 14, y: 55, width: 72, height: 32, label: 'Corrected High-Contrast MRP ₹ 175.00 (USP ₹1.17/g)', confidence: 99.6, valid: true }
        ]
      },
      {
        id: 'ev-6-decl',
        type: 'back',
        title: 'Reinspected Mondelez Manufacturer & Batch Stamp',
        url: 'https://images.openfoodfacts.org/images/products/762/220/114/8782/nutrition_en.29.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-12 10:10:18 AM',
        annotations: [
          { x: 12, y: 15, width: 76, height: 40, label: 'Mondelez India Declaration Confirmed', confidence: 99.4, valid: true },
          { x: 15, y: 60, width: 70, height: 30, label: 'Batch CD-2026-B985 Crisp Inkjet Verification', confidence: 99.3, valid: true }
        ]
      }
    ],
    ocrResults: [
      {
        id: 'ocr-51',
        field: 'Maximum Retail Price Readability',
        detectedText: 'MRP Rs. 175.00 (INCL. OF ALL TAXES)',
        standardValue: 'Compliant with Rule 6(1)(e)',
        confidence: 99.6,
        ruleRef: 'Rule 6(1)(e)',
        status: 'verified'
      },
      {
        id: 'ocr-52',
        field: 'Unit Sale Price',
        detectedText: 'USP: Rs. 1.17 / g (incl. of all taxes)',
        standardValue: 'Compliant with Rule 6(1)(n)',
        confidence: 99.4,
        ruleRef: 'Rule 6(1)(n)',
        status: 'verified'
      }
    ],
    rules: [
      {
        id: 'r-51',
        ruleName: 'Clarity and Legibility of Retail Sale Price',
        ruleNumber: 'Rule 6(1)(e)',
        status: 'PASS',
        reason: 'Recalibrated laser/thermal print is razor sharp. No smudging detected. Full price ₹175.00 verified.',
        confidence: 99.6,
        severity: 'Critical',
        category: 'Pricing'
      },
      {
        id: 'r-52',
        ruleName: 'Unit Sale Price (USP)',
        ruleNumber: 'Rule 6(1)(n)',
        status: 'PASS',
        reason: 'USP ₹1.17 / g prominently visible in compliant font.',
        confidence: 99.4,
        severity: 'Critical',
        category: 'Pricing'
      }
    ],
    auditTimeline: [
      {
        id: 'aud-51',
        title: 'Inspection Created',
        timestamp: '2026-09-12 10:05:00 AM',
        actor: 'Officer Sanjay S. Patil',
        role: 'Field Inspector (LM-OFF-MH-2940)',
        description: 'Linked reinspection visit for fresh lot CD-2026-B985.',
        status: 'completed'
      },
      {
        id: 'aud-52',
        title: 'Images Uploaded',
        timestamp: '2026-09-12 10:13:00 AM',
        actor: 'PackSure Mobile Sync Engine',
        role: 'Automated Ingestion',
        description: '5 high-definition images captured and matched with previous inspection profile.',
        status: 'completed'
      },
      {
        id: 'aud-53',
        title: 'OCR Completed',
        timestamp: '2026-09-12 10:13:45 AM',
        actor: 'PackSure AI OCR',
        role: 'Machine Learning Subsystem',
        description: 'OCR confidence 99.5% on newly printed price declarations.',
        status: 'completed'
      },
      {
        id: 'aud-54',
        title: 'Rule Evaluation Completed',
        timestamp: '2026-09-12 10:14:20 AM',
        actor: 'LM-PCR Rule Engine v2026.3',
        role: 'Automated Regulatory Engine',
        description: '100% compliance score. Previous defect resolved.',
        status: 'completed'
      },
      {
        id: 'aud-55',
        title: 'Supervisor Review',
        timestamp: '2026-09-12 01:25:00 PM',
        actor: 'Supervisor Amit K. Deshmukh',
        role: 'Legal Metrology Supervisor',
        description: 'Comparison with parent inspection INS-2026-0837 completed.',
        status: 'completed'
      },
      {
        id: 'aud-56',
        title: 'Final Decision',
        timestamp: '2026-09-12 01:30:00 PM',
        actor: 'Supervisor Amit K. Deshmukh',
        role: 'Legal Metrology Supervisor',
        description: 'Confirmed Compliant. Case officially resolved with positive audit log.',
        status: 'completed'
      }
    ]
  },
  {
    id: 'INS-2026-0836',
    productName: "Haldiram's Nagpur Aloo Bhujia 200g",
    brand: 'Haldiram Foods International Pvt Ltd',
    category: 'Namkeen & Snacks',
    batchNumber: 'HL-2026-NGP-114',
    companyName: 'Haldiram Foods International Private Limited',
    companyEmail: 'care@haldirams.com',
    location: 'Metro Cash & Carry, Bhandup, Mumbai',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    inspectionDate: '2026-09-10 11:30 AM',
    officerName: 'Pooja R. Kulkarni',
    officerBadge: 'LM-OFF-MH-5120',
    officerZone: 'Central Zone - Region 1',
    officerPhone: '+91 98332 11984',
    aiComplianceResult: 'Compliant',
    aiComplianceScore: 96,
    supervisorDecision: 'Confirmed Compliant',
    supervisorComment: 'Fully compliant package. All declarations in compliance with Rule 6 and Second Schedule.',
    supervisorReviewDate: '2026-09-10 02:40 PM',
    supervisorName: 'Amit K. Deshmukh',
    priority: 'Low',
    retailOutlet: 'Metro Cash & Carry (Wholesale Outlet)',
    measurements: {
      grossWeight: {
        declared: 208.0,
        measured: 209.4,
        unit: 'g',
        deviationPercent: 0.67,
        passed: true,
        notes: 'Foil pouch packaging 8.2g'
      },
      netWeight: {
        declared: 200.0,
        measured: 201.2,
        unit: 'g',
        maxPermissibleError: 9.0, // 4.5% of 200g
        deviationPercent: 0.6,
        passed: true,
        notes: 'Net weight within tolerance'
      },
      dimensions: {
        length: 210,
        width: 150,
        height: 35,
        unit: 'mm',
        volumeCc: 1102.5,
        passed: true
      },
      tareWeight: {
        measured: 8.2,
        unit: 'g'
      }
    },
    evidence: [
      {
        id: 'ev-7-front',
        type: 'front',
        title: 'Primary Display Panel (Haldirams Aloo Bhujia 200g Pouch Label)',
        url: 'https://images.openfoodfacts.org/images/products/890/400/440/0731/front_en.28.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-10 11:25:10 AM',
        annotations: [
          { x: 14, y: 14, width: 68, height: 28, label: 'Haldirams Nagpur Aloo Bhujia Brand', confidence: 99.4, valid: true },
          { x: 55, y: 68, width: 38, height: 20, label: 'Net Weight: "200 g" Declared', confidence: 99.1, valid: true },
          { x: 10, y: 18, width: 80, height: 26, label: 'MRP ₹ 50.00 (USP ₹0.25/g)', confidence: 99.3, valid: true }
        ]
      },
      {
        id: 'ev-7-decl',
        type: 'back',
        title: 'Haldiram Foods Manufacturer Address & FSSAI Label',
        url: 'https://images.openfoodfacts.org/images/products/890/400/440/0731/ingredients_en.32.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-10 11:25:25 AM',
        annotations: [
          { x: 12, y: 12, width: 76, height: 38, label: 'Haldiram Foods International Pvt Ltd, Nagpur 440035', confidence: 98.7, valid: true },
          { x: 14, y: 52, width: 72, height: 28, label: 'Ingredients: Potato Flakes, Edible Vegetable Oil, Spices', confidence: 98.4, valid: true }
        ]
      },
      {
        id: 'ev-7-nutri',
        type: 'label',
        title: 'Nutritional Facts & Value Per 100g Label',
        url: 'https://images.openfoodfacts.org/images/products/890/400/440/0731/nutrition_en.30.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-10 11:25:38 AM',
        annotations: [
          { x: 10, y: 15, width: 80, height: 50, label: 'Energy 580 kcal, Total Fat 42g per 100g', confidence: 98.6, valid: true }
        ]
      },
      {
        id: 'ev-7-pkg',
        type: 'side',
        title: 'Barcode & Batch HL-2026-NGP-114 Stamp',
        url: 'https://images.openfoodfacts.org/images/products/890/400/440/0731/packaging_en.34.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-10 11:25:50 AM',
        annotations: [
          { x: 18, y: 22, width: 64, height: 40, label: 'Barcode 8904004400731', confidence: 98.5, valid: true },
          { x: 16, y: 68, width: 68, height: 22, label: 'Batch HL-2026-NGP-114 & Pkd Date Stamp', confidence: 98.9, valid: true }
        ]
      }
    ],
    ocrResults: [
      {
        id: 'ocr-61',
        field: 'Manufacturer / Packer Declaration',
        detectedText: 'Haldiram Foods International Pvt Ltd, 145/146, Old Pardi Naka, Bhandara Road, Nagpur 440035',
        standardValue: 'Compliant with Rule 6(1)(a)',
        confidence: 99.1,
        ruleRef: 'Rule 6(1)(a)',
        status: 'verified'
      },
      {
        id: 'ocr-62',
        field: 'Net Quantity & Numeral Height',
        detectedText: 'Net Wt: 200 g (Numeral height 3.2 mm)',
        standardValue: 'Compliant with Rule 6(1)(c)',
        confidence: 98.8,
        ruleRef: 'Rule 6(1)(c)',
        status: 'verified',
        charHeightMm: 3.2,
        minHeightReqMm: 2.0
      }
    ],
    rules: [
      {
        id: 'r-61',
        ruleName: 'Full Identity Declarations',
        ruleNumber: 'Rule 6(1)(a)-(b)',
        status: 'PASS',
        reason: 'Manufacturer, registered office, generic name compliant.',
        confidence: 99.1,
        severity: 'Critical',
        category: 'Identity'
      },
      {
        id: 'r-62',
        ruleName: 'Net Quantity and Numeral Heights',
        ruleNumber: 'Rule 6(1)(c)',
        status: 'PASS',
        reason: '3.2mm font height complies with Schedule II requirements.',
        confidence: 98.8,
        severity: 'Critical',
        category: 'Weights & Measures'
      }
    ],
    auditTimeline: [
      {
        id: 'aud-61',
        title: 'Inspection Created',
        timestamp: '2026-09-10 11:20:00 AM',
        actor: 'Officer Pooja R. Kulkarni',
        role: 'Field Inspector (LM-OFF-MH-5120)',
        description: 'Wholesale hub inspection recorded.',
        status: 'completed'
      },
      {
        id: 'aud-62',
        title: 'Images Uploaded',
        timestamp: '2026-09-10 11:28:15 AM',
        actor: 'PackSure Mobile Sync Engine',
        role: 'Automated Ingestion',
        description: 'Evidence images verified.',
        status: 'completed'
      },
      {
        id: 'aud-63',
        title: 'OCR Completed',
        timestamp: '2026-09-10 11:28:50 AM',
        actor: 'PackSure AI OCR',
        role: 'Machine Learning Subsystem',
        description: 'All statutory strings detected accurately.',
        status: 'completed'
      },
      {
        id: 'aud-64',
        title: 'Rule Evaluation Completed',
        timestamp: '2026-09-10 11:29:20 AM',
        actor: 'LM-PCR Rule Engine v2026.3',
        role: 'Automated Regulatory Engine',
        description: 'Full pass on all evaluated PCR rules.',
        status: 'completed'
      },
      {
        id: 'aud-65',
        title: 'Supervisor Review',
        timestamp: '2026-09-10 02:35:00 PM',
        actor: 'Supervisor Amit K. Deshmukh',
        role: 'Legal Metrology Supervisor',
        description: 'Audit verified.',
        status: 'completed'
      },
      {
        id: 'aud-66',
        title: 'Final Decision',
        timestamp: '2026-09-10 02:40:00 PM',
        actor: 'Supervisor Amit K. Deshmukh',
        role: 'Legal Metrology Supervisor',
        description: 'Confirmed Compliant.',
        status: 'completed'
      }
    ]
  },
  {
    id: 'INS-2026-0835',
    productName: 'Aashirvaad Shudh Chakki Atta 5kg',
    brand: 'ITC Limited',
    category: 'Flour & Staples',
    batchNumber: 'ITC-ATT-2026-88',
    companyName: 'ITC Limited',
    companyEmail: 'itccares@itc.in',
    location: 'Spar Hypermarket, Seawoods Grand Central, Navi Mumbai',
    district: 'Thane',
    state: 'Maharashtra',
    inspectionDate: '2026-09-09 01:15 PM',
    officerName: 'Sunita P. Jadhav',
    officerBadge: 'LM-OFF-MH-3108',
    officerZone: 'North Zone - Sector 4',
    officerPhone: '+91 97654 33210',
    aiComplianceResult: 'Non-Compliant',
    aiComplianceScore: 58,
    supervisorDecision: 'Order Reinspection',
    supervisorComment: 'Sample bag measured 4918g net against 5000g declared. The shortfall of 82g exceeds the maximum permissible error of 50g (1% for 5kg pack per Schedule-IV). Ordered lot reinspection at manufacturer depot before filing Section 36 prosecution.',
    supervisorReviewDate: '2026-09-09 04:10 PM',
    supervisorName: 'Amit K. Deshmukh',
    priority: 'High',
    retailOutlet: 'Spar Hypermarket (Seawoods)',
    measurements: {
      grossWeight: {
        declared: 5045.0,
        measured: 4960.0,
        unit: 'g',
        deviationPercent: -1.68,
        passed: false,
        notes: 'Underweight: 85g below gross weight expectation'
      },
      netWeight: {
        declared: 5000.0,
        measured: 4918.0,
        unit: 'g',
        maxPermissibleError: 50.0, // 1% or 50g
        deviationPercent: -1.64,
        passed: false,
        notes: 'Violates Schedule-IV MPE. Shortfall of 82g exceeds allowable error 50g.'
      },
      dimensions: {
        length: 420,
        width: 290,
        height: 95,
        unit: 'mm',
        volumeCc: 11571.0,
        passed: true
      },
      tareWeight: {
        measured: 42.0,
        unit: 'g'
      }
    },
    evidence: [
      {
        id: 'ev-8-front',
        type: 'front',
        title: 'Primary Display Panel (Aashirvaad Atta 5kg Bag Label)',
        url: 'https://images.openfoodfacts.org/images/products/890/172/512/1129/front_en.30.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-09 01:10:00 PM',
        annotations: [
          { x: 14, y: 14, width: 68, height: 28, label: 'Aashirvaad Shudh Chakki Atta 100% Whole Wheat', confidence: 99.2, valid: true },
          { x: 50, y: 68, width: 42, height: 20, label: 'Net Quantity: "5 kg" Declared', confidence: 99.4, valid: true },
          { x: 10, y: 18, width: 80, height: 26, label: 'MRP ₹ 245.00 (USP ₹49.00/kg)', confidence: 99.5, valid: true }
        ]
      },
      {
        id: 'ev-8-decl',
        type: 'back',
        title: 'ITC Limited Manufacturer & Packer Declarations Label',
        url: 'https://images.openfoodfacts.org/images/products/890/172/512/1129/ingredients_en.34.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-09 01:10:20 PM',
        annotations: [
          { x: 12, y: 12, width: 76, height: 38, label: 'Mfd by: ITC Limited, 37 J.L. Nehru Road, Kolkata 700071', confidence: 98.9, valid: true },
          { x: 14, y: 54, width: 72, height: 28, label: 'Storage Instructions: Store in cool and dry place', confidence: 98.6, valid: true }
        ]
      },
      {
        id: 'ev-8-nutri',
        type: 'label',
        title: 'Dietary Fiber & Whole Grain Nutrition Facts Label',
        url: 'https://images.openfoodfacts.org/images/products/890/172/512/1129/nutrition_en.32.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-09 01:10:35 PM',
        annotations: [
          { x: 10, y: 15, width: 80, height: 48, label: 'Dietary Fibre 11.2g per 100g, Protein 10.8g', confidence: 98.7, valid: true }
        ]
      },
      {
        id: 'ev-8-pkg',
        type: 'side',
        title: 'Batch Code, Barcode & Bag Stitching Stamp',
        url: 'https://images.openfoodfacts.org/images/products/890/172/512/1129/packaging_en.41.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-09 01:10:48 PM',
        annotations: [
          { x: 18, y: 20, width: 64, height: 40, label: 'EAN Barcode 8901725121129', confidence: 99.0, valid: true },
          { x: 16, y: 65, width: 68, height: 24, label: 'Batch ITC-ATT-2026-88', confidence: 98.2, valid: true }
        ]
      }
    ],
    ocrResults: [
      {
        id: 'ocr-71',
        field: 'Net Quantity Declaration',
        detectedText: 'Net Qty: 5 kg',
        standardValue: '5000g standard package',
        confidence: 99.4,
        ruleRef: 'Rule 6(1)(c)',
        status: 'verified'
      },
      {
        id: 'ocr-72',
        field: 'Measured Weight Non-Conformity',
        detectedText: 'Actual Net Weight: 4918 g (Deficit: 82 g)',
        standardValue: 'Schedule-IV Max Permissible Error: 50.0 g',
        confidence: 99.8,
        ruleRef: 'Schedule IV',
        status: 'error'
      }
    ],
    rules: [
      {
        id: 'r-71',
        ruleName: 'Max Permissible Error (MPE) on Net Quantity',
        ruleNumber: 'Schedule IV',
        status: 'FAIL',
        reason: 'Measured net weight is 4918g against declared 5000g. The shortfall of 82g violates the maximum allowable error limit of 50g for 5kg commodities.',
        confidence: 99.8,
        severity: 'Critical',
        category: 'Weights & Measures'
      }
    ],
    auditTimeline: [
      {
        id: 'aud-71',
        title: 'Inspection Created',
        timestamp: '2026-09-09 01:05:00 PM',
        actor: 'Officer Sunita P. Jadhav',
        role: 'Field Inspector (LM-OFF-MH-3108)',
        description: 'Gravimetric balance calibration test executed with certified weights.',
        status: 'completed'
      },
      {
        id: 'aud-72',
        title: 'Images Uploaded',
        timestamp: '2026-09-09 01:13:20 PM',
        actor: 'PackSure Mobile Sync Engine',
        role: 'Automated Ingestion',
        description: 'Scale read-out photos and package condition uploaded.',
        status: 'completed'
      },
      {
        id: 'aud-73',
        title: 'OCR Completed',
        timestamp: '2026-09-09 01:14:05 PM',
        actor: 'PackSure AI OCR',
        role: 'Machine Learning Subsystem',
        description: 'Completed text recognition.',
        status: 'completed'
      },
      {
        id: 'aud-74',
        title: 'Rule Evaluation Completed',
        timestamp: '2026-09-09 01:14:45 PM',
        actor: 'LM-PCR Rule Engine v2026.3',
        role: 'Automated Regulatory Engine',
        description: 'Critical Schedule-IV violation detected.',
        status: 'completed'
      },
      {
        id: 'aud-75',
        title: 'Supervisor Review',
        timestamp: '2026-09-09 04:05:00 PM',
        actor: 'Supervisor Amit K. Deshmukh',
        role: 'Legal Metrology Supervisor',
        description: 'Reviewed weights scale inspection calibration certificate.',
        status: 'completed'
      },
      {
        id: 'aud-76',
        title: 'Final Decision',
        timestamp: '2026-09-09 04:10:00 PM',
        actor: 'Supervisor Amit K. Deshmukh',
        role: 'Legal Metrology Supervisor',
        description: 'Order Reinspection: Reinspection lot ordered at central packaging mill.',
        status: 'completed'
      }
    ]
  },
  {
    id: 'INS-2026-0834',
    productName: 'Kellogg’s Real Almond & Honey Corn Flakes 300g',
    brand: 'Kellogg India Pvt Ltd',
    category: 'Breakfast Cereals',
    batchNumber: 'KLG-2026-AH-901',
    companyName: 'Kellogg India Private Limited',
    companyEmail: 'consumercontact@kellogg.com',
    location: 'Chitale Bandhu Store, Pune Station Road, Pune',
    district: 'Pune',
    state: 'Maharashtra',
    inspectionDate: '2026-09-09 10:45 AM',
    officerName: 'Vijay M. Kapse',
    officerBadge: 'LM-OFF-MH-1802',
    officerZone: 'West Zone - Pune Sector',
    officerPhone: '+91 94220 91823',
    aiComplianceResult: 'Partially Compliant',
    aiComplianceScore: 79,
    supervisorDecision: 'Pending Review',
    supervisorComment: '',
    priority: 'Medium',
    retailOutlet: 'Chitale Bandhu Mithai & Retail',
    measurements: {
      grossWeight: {
        declared: 335.0,
        measured: 334.2,
        unit: 'g',
        deviationPercent: -0.24,
        passed: true,
        notes: 'Outer box and metallized liner 34.6g'
      },
      netWeight: {
        declared: 300.0,
        measured: 299.6,
        unit: 'g',
        maxPermissibleError: 9.0, // 3% of 300g
        deviationPercent: -0.13,
        passed: true,
        notes: 'Within Schedule-IV MPE'
      },
      dimensions: {
        length: 240,
        width: 175,
        height: 60,
        unit: 'mm',
        volumeCc: 2520.0,
        passed: true
      },
      tareWeight: {
        measured: 34.6,
        unit: 'g'
      }
    },
    evidence: [
      {
        id: 'ev-9-front',
        type: 'front',
        title: 'Primary Display Panel (Kellogg’s Corn Flakes 300g Carton Label)',
        url: 'https://images.openfoodfacts.org/images/products/890/149/901/1039/front_en.3.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-09 10:40:00 AM',
        annotations: [
          { x: 15, y: 15, width: 70, height: 28, label: 'Kelloggs Real Almond & Honey Corn Flakes Brand', confidence: 99.4, valid: true },
          { x: 50, y: 70, width: 42, height: 20, label: 'Net Weight "300 g"', confidence: 98.8, valid: true },
          { x: 10, y: 20, width: 80, height: 25, label: 'MRP ₹ 185.00 (USP ₹0.62/g)', confidence: 98.2, valid: true }
        ]
      },
      {
        id: 'ev-9-decl',
        type: 'back',
        title: 'Kellogg India Packer Details & Missing Date Defect',
        url: 'https://images.openfoodfacts.org/images/products/890/149/901/1039/ingredients_en.5.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-09 10:40:18 AM',
        annotations: [
          { x: 12, y: 12, width: 76, height: 36, label: 'Kellogg India Pvt Ltd, Taloja, Raigad, Maharashtra', confidence: 98.5, valid: true },
          { x: 14, y: 52, width: 72, height: 32, label: 'Missing Month & Year of Packing on Top Flap (Rule 6(1)(d))', confidence: 93.4, valid: false }
        ]
      },
      {
        id: 'ev-9-nutri',
        type: 'label',
        title: 'Nutrition Facts & Essential Vitamins Panel Label',
        url: 'https://images.openfoodfacts.org/images/products/890/149/901/1039/nutrition_en.8.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-09 10:40:32 AM',
        annotations: [
          { x: 10, y: 14, width: 80, height: 50, label: 'Vitamins B1, B2, B3, B6, B12, Iron & Zinc Panel', confidence: 98.6, valid: true }
        ]
      }
    ],
    ocrResults: [
      {
        id: 'ocr-81',
        field: 'Date Marking / Best Before Statement',
        detectedText: 'BEST BEFORE WITHIN 9 MONTHS [No Packaging Date Specified]',
        standardValue: 'Must clearly state Month and Year of Manufacture per Rule 6(1)(d)',
        confidence: 93.4,
        ruleRef: 'Rule 6(1)(d)',
        status: 'warning'
      }
    ],
    rules: [
      {
        id: 'r-81',
        ruleName: 'Month and Year of Manufacture or Pre-packing',
        ruleNumber: 'Rule 6(1)(d)',
        status: 'FAIL',
        reason: 'The carton states "Best before within 9 months" but the actual Month & Year of packing inkjet code is missing on top flap.',
        confidence: 93.4,
        severity: 'Major',
        category: 'Date Marking'
      }
    ],
    auditTimeline: [
      {
        id: 'aud-81',
        title: 'Inspection Created',
        timestamp: '2026-09-09 10:35:00 AM',
        actor: 'Officer Vijay M. Kapse',
        role: 'Field Inspector (LM-OFF-MH-1802)',
        description: 'Surveillance audit at Pune retail outlet.',
        status: 'completed'
      },
      {
        id: 'aud-82',
        title: 'Images Uploaded',
        timestamp: '2026-09-09 10:43:10 AM',
        actor: 'PackSure Mobile Sync Engine',
        role: 'Automated Ingestion',
        description: 'Uploaded top flap and price panel images.',
        status: 'completed'
      },
      {
        id: 'aud-83',
        title: 'OCR Completed',
        timestamp: '2026-09-09 10:43:45 AM',
        actor: 'PackSure AI OCR',
        role: 'Machine Learning Subsystem',
        description: 'Top flap date string unread.',
        status: 'completed'
      },
      {
        id: 'aud-84',
        title: 'Rule Evaluation Completed',
        timestamp: '2026-09-09 10:44:20 AM',
        actor: 'LM-PCR Rule Engine v2026.3',
        role: 'Automated Regulatory Engine',
        description: 'Rule 6(1)(d) non-conformity flagged.',
        status: 'completed'
      },
      {
        id: 'aud-85',
        title: 'Supervisor Review',
        timestamp: 'Pending',
        actor: 'Supervisor Portal',
        role: 'Supervisor Queue',
        description: 'Awaiting review.',
        status: 'pending'
      },
      {
        id: 'aud-86',
        title: 'Final Decision',
        timestamp: 'Pending',
        actor: 'Supervisor Portal',
        role: 'Authorized Officer',
        description: 'Pending determination.',
        status: 'pending'
      }
    ]
  },
  {
    id: 'INS-2026-0833',
    productName: 'Amul Taaza Homogenised Toned Milk 500ml',
    brand: 'GCMMF (Amul)',
    category: 'Dairy & Beverages',
    batchNumber: 'AMUL-TZ-2026-09',
    companyName: 'Gujarat Co-operative Milk Marketing Federation Ltd',
    companyEmail: 'customercare@amul.coop',
    location: 'Amul Preferred Outlet, Dadar West, Mumbai',
    district: 'Mumbai City',
    state: 'Maharashtra',
    inspectionDate: '2026-09-08 09:30 AM',
    officerName: 'Rajesh V. Sharma',
    officerBadge: 'LM-OFF-MH-4019',
    officerZone: 'West Zone - Region 2',
    officerPhone: '+91 98201 44521',
    aiComplianceResult: 'Compliant',
    aiComplianceScore: 97,
    supervisorDecision: 'Confirmed Compliant',
    supervisorComment: 'Inspected Tetra Fino aseptically packed pouch. Volumetric displacement confirms 501.2 ml. Compliant in all declarations.',
    supervisorReviewDate: '2026-09-08 12:15 PM',
    supervisorName: 'Amit K. Deshmukh',
    priority: 'Low',
    retailOutlet: 'Amul Exclusive Parlour Dadar',
    measurements: {
      grossWeight: {
        declared: 518.0,
        measured: 518.6,
        unit: 'g',
        deviationPercent: 0.12,
        passed: true,
        notes: 'Tetra pack tare 17.4g'
      },
      netWeight: {
        declared: 500.0,
        measured: 501.2,
        unit: 'ml',
        maxPermissibleError: 15.0,
        deviationPercent: 0.24,
        passed: true,
        notes: 'Volume measured at 20°C standard test temperature'
      },
      dimensions: {
        length: 165,
        width: 90,
        height: 40,
        unit: 'mm',
        volumeCc: 594.0,
        passed: true
      },
      tareWeight: {
        measured: 17.4,
        unit: 'g'
      }
    },
    evidence: [
      {
        id: 'ev-10-front',
        type: 'front',
        title: 'Primary Display Panel (Amul Taaza 500ml Tetra Pack Label)',
        url: 'https://images.openfoodfacts.org/images/products/890/126/226/0121/front_en.52.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-08 09:25:00 AM',
        annotations: [
          { x: 15, y: 15, width: 70, height: 30, label: 'Amul Taaza Homogenised Toned Milk', confidence: 99.7, valid: true },
          { x: 20, y: 65, width: 60, height: 22, label: 'Net Volume: "500 ml" Compliant', confidence: 99.6, valid: true },
          { x: 10, y: 20, width: 80, height: 25, label: 'MRP ₹ 27.00 (USP ₹0.054/ml)', confidence: 99.8, valid: true }
        ]
      },
      {
        id: 'ev-10-decl',
        type: 'back',
        title: 'GCMMF Cooperative Dairy & FSSAI Declarations Label',
        url: 'https://images.openfoodfacts.org/images/products/890/126/226/0121/ingredients_en.54.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-08 09:25:20 AM',
        annotations: [
          { x: 12, y: 12, width: 76, height: 38, label: 'Mkt by: Gujarat Co-operative Milk Marketing Federation, Anand', confidence: 99.4, valid: true },
          { x: 14, y: 55, width: 72, height: 25, label: 'FSSAI License No. 10012021000071', confidence: 99.3, valid: true }
        ]
      },
      {
        id: 'ev-10-nutri',
        type: 'label',
        title: 'Nutritional Values & Fat 3.0% / SNF 8.5% Table Label',
        url: 'https://images.openfoodfacts.org/images/products/890/126/226/0121/nutrition_en.56.400.jpg',
        captureResolution: '4032 x 3024',
        timestamp: '2026-09-08 09:25:35 AM',
        annotations: [
          { x: 10, y: 14, width: 80, height: 48, label: 'Nutritional Information: Fat 3.0g, Protein 3.2g, Calcium 120mg', confidence: 99.2, valid: true }
        ]
      }
    ],
    ocrResults: [
      {
        id: 'ocr-91',
        field: 'Manufacturer & Marketing Society',
        detectedText: 'Gujarat Co-operative Milk Marketing Federation Ltd., Anand 388001, Gujarat',
        standardValue: 'Compliant with Rule 6(1)(a)',
        confidence: 99.4,
        ruleRef: 'Rule 6(1)(a)',
        status: 'verified'
      },
      {
        id: 'ocr-92',
        field: 'Unit Sale Price',
        detectedText: 'USP: Rs. 0.054 / ml (incl. of all taxes)',
        standardValue: 'Compliant with Rule 6(1)(n)',
        confidence: 99.8,
        ruleRef: 'Rule 6(1)(n)',
        status: 'verified'
      }
    ],
    rules: [
      {
        id: 'r-91',
        ruleName: 'Name & Address of Packer / Manufacturer',
        ruleNumber: 'Rule 6(1)(a)',
        status: 'PASS',
        reason: 'Complete federation address provided.',
        confidence: 99.4,
        severity: 'Critical',
        category: 'Identity'
      },
      {
        id: 'r-92',
        ruleName: 'Volume Declaration & Numeral Sizing',
        ruleNumber: 'Rule 6(1)(c)',
        status: 'PASS',
        reason: '500 ml numeral size 3.4mm exceeds 2.0mm required.',
        confidence: 99.5,
        severity: 'Critical',
        category: 'Weights & Measures'
      }
    ],
    auditTimeline: [
      {
        id: 'aud-91',
        title: 'Inspection Created',
        timestamp: '2026-09-08 09:20:00 AM',
        actor: 'Officer Rajesh V. Sharma',
        role: 'Field Inspector (LM-OFF-MH-4019)',
        description: 'Morning cold-chain retail inspection.',
        status: 'completed'
      },
      {
        id: 'aud-92',
        title: 'Images Uploaded',
        timestamp: '2026-09-08 09:28:10 AM',
        actor: 'PackSure Mobile Sync Engine',
        role: 'Automated Ingestion',
        description: 'Images uploaded.',
        status: 'completed'
      },
      {
        id: 'aud-93',
        title: 'OCR Completed',
        timestamp: '2026-09-08 09:28:40 AM',
        actor: 'PackSure AI OCR',
        role: 'Machine Learning Subsystem',
        description: 'All fields verified.',
        status: 'completed'
      },
      {
        id: 'aud-94',
        title: 'Rule Evaluation Completed',
        timestamp: '2026-09-08 09:29:10 AM',
        actor: 'LM-PCR Rule Engine v2026.3',
        role: 'Automated Regulatory Engine',
        description: 'All checks passed.',
        status: 'completed'
      },
      {
        id: 'aud-95',
        title: 'Supervisor Review',
        timestamp: '2026-09-08 12:10:00 PM',
        actor: 'Supervisor Amit K. Deshmukh',
        role: 'Legal Metrology Supervisor',
        description: 'Dossier inspected.',
        status: 'completed'
      },
      {
        id: 'aud-96',
        title: 'Final Decision',
        timestamp: '2026-09-08 12:15:00 PM',
        actor: 'Supervisor Amit K. Deshmukh',
        role: 'Legal Metrology Supervisor',
        description: 'Confirmed Compliant.',
        status: 'completed'
      }
    ]
  }
];

export const LINKED_REINSPECTIONS: ReinspectionRecord[] = [
  {
    id: 'RE-REC-101',
    originalInspectionId: 'INS-2026-0837',
    newInspectionId: 'RE-INS-2026-0837-B',
    productName: 'Cadbury Dairy Milk Silk Chocolate 150g',
    previousBatch: 'CD-2026-B982',
    newBatch: 'CD-2026-B985',
    orderedDate: '2026-09-10 05:20 PM',
    completedDate: '2026-09-12 01:30 PM',
    reason: 'Thermal printer ink smudge in price declaration panel made retail price illegible.',
    supervisorNotes: 'Mandatory follow-up visit scheduled within 48h to verify replacement stock and printer alignment at Haiko Supermarket depot.',
    assignedOfficer: 'Sanjay S. Patil (LM-OFF-MH-2940)',
    status: 'Re-analyzed - Resolved'
  },
  {
    id: 'RE-REC-102',
    originalInspectionId: 'INS-2026-0835',
    newInspectionId: 'RE-INS-2026-0835-B',
    productName: 'Aashirvaad Shudh Chakki Atta 5kg',
    previousBatch: 'ITC-ATT-2026-88',
    newBatch: 'Pending Fresh Lot',
    orderedDate: '2026-09-09 04:10 PM',
    reason: 'Weight deficit of 82g violates Schedule-IV maximum permissible error (50g allowed).',
    supervisorNotes: 'Officer assigned to perform 30-sample statistical gravimetric sampling at central packaging plant.',
    assignedOfficer: 'Sunita P. Jadhav (LM-OFF-MH-3108)',
    status: 'Samples Collected'
  }
];

export const VIOLATION_CATEGORIES_DATA = [
  {
    ruleCode: 'Rule 6(1)(n)',
    ruleName: 'Unit Sale Price (USP) Missing / Incompliant',
    count: 76,
    percentage: 35.3,
    severity: 'Critical',
    penaltyClause: 'Section 36(1) - ₹25,000 fine per lot'
  },
  {
    ruleCode: 'Rule 6(1)(c) & Sch-II',
    ruleName: 'Net Quantity Numeral Height Sub-Standard',
    count: 48,
    percentage: 22.3,
    severity: 'Major',
    penaltyClause: 'Section 36(1) - ₹25,000 fine'
  },
  {
    ruleCode: 'Rule 6(1)(e)',
    ruleName: 'MRP Illegible / Smudged / Missing Tax Statement',
    count: 37,
    percentage: 17.2,
    severity: 'Critical',
    penaltyClause: 'Section 36(2) - Up to ₹50,000 fine'
  },
  {
    ruleCode: 'Schedule IV',
    ruleName: 'Net Weight Shortfall (Exceeding MPE Threshold)',
    count: 29,
    percentage: 13.5,
    severity: 'Critical',
    penaltyClause: 'Section 30 - Prosecution & compounding'
  },
  {
    ruleCode: 'Rule 6(1)(d)',
    ruleName: 'Date of Packing / Expiry Month Ambiguity',
    count: 15,
    percentage: 7.0,
    severity: 'Major',
    penaltyClause: 'Section 36(1) - Warning notice'
  },
  {
    ruleCode: 'Rule 12(2) & 13',
    ruleName: 'Missing Dual Unit Declaration on Edible Oils',
    count: 10,
    percentage: 4.7,
    severity: 'Critical',
    penaltyClause: 'Section 39 - Seizure notice'
  }
];

export const REINSPECTION_RECORDS_MOCK: ReinspectionRecord[] = [
  {
    id: 'RE-REC-0101',
    originalInspectionId: 'INS-2026-0941',
    newInspectionId: 'RE-INS-2026-0941-L2',
    productName: 'Amul Salted Butter (500g Carton)',
    previousBatch: 'B240899',
    newBatch: 'B240905-REV',
    orderedDate: '2026-09-12 04:30 PM',
    reason: 'Underweight net mass outside Schedule-IV Maximum Permissible Error (MPE).',
    supervisorNotes: 'Supervisor ordered mandatory random sample re-audit of 30 units from replacement production line.',
    assignedOfficer: 'Sanjay S. Patil',
    status: 'In Review'
  },
  {
    id: 'RE-REC-0102',
    originalInspectionId: 'INS-2026-0938',
    newInspectionId: 'RE-INS-2026-0938-L2',
    productName: 'Aashirvaad Superior MP Sharbati Atta 5kg',
    previousBatch: 'ASH-2026-8802',
    newBatch: 'ASH-2026-8910',
    orderedDate: '2026-09-11 11:15 AM',
    reason: 'Rule 6(1)(n) Unit Sale Price (USP) omitted on retail pack.',
    supervisorNotes: 'Manufacturer submitted revised packaging cylinder artwork with ₹85.00/kg USP printed.',
    assignedOfficer: 'Sunita P. Jadhav',
    status: 'Re-analyzed - Resolved'
  },
  {
    id: 'RE-REC-0103',
    originalInspectionId: 'INS-2026-0935',
    newInspectionId: 'RE-INS-2026-0935-L2',
    productName: 'Fortune Sunlite Refined Sunflower Oil 1L Pouch',
    previousBatch: 'FS-2026-09-44A',
    newBatch: 'FS-2026-09-44B',
    orderedDate: '2026-09-10 03:00 PM',
    reason: 'Missing volume equivalence in millimetres at specified standard 30°C temperature under Rule 12.',
    supervisorNotes: 'Officer dispatched to Adani Wilmar distribution depot for spot testing.',
    assignedOfficer: 'Vijay M. Kapse',
    status: 'Pending Officer Visit'
  }
];

export const OFFICER_ACTIVITY_DATA = [
  {
    badge: 'LM-OFF-MH-4019',
    name: 'Rajesh V. Sharma',
    zone: 'West Zone - Region 2 (Mumbai Suburban)',
    totalInspected: 184,
    pendingAction: 8,
    flaggedViolations: 34,
    complianceRate: '81.5%',
    avgSpeedHours: 1.4,
    status: 'Active Field'
  },
  {
    badge: 'LM-OFF-MH-3108',
    name: 'Sunita P. Jadhav',
    zone: 'North Zone - Sector 4 (Thane & Navi Mumbai)',
    totalInspected: 162,
    pendingAction: 4,
    flaggedViolations: 26,
    complianceRate: '84.0%',
    avgSpeedHours: 1.1,
    status: 'Active Field'
  },
  {
    badge: 'LM-OFF-MH-2940',
    name: 'Sanjay S. Patil',
    zone: 'Central Zone - Region 3 (Powai & Ghatkopar)',
    totalInspected: 145,
    pendingAction: 6,
    flaggedViolations: 38,
    complianceRate: '73.8%',
    avgSpeedHours: 1.8,
    status: 'In Reinspection Depot'
  },
  {
    badge: 'LM-OFF-MH-5120',
    name: 'Pooja R. Kulkarni',
    zone: 'Central Zone - Region 1 (Dadar & Wadala)',
    totalInspected: 198,
    pendingAction: 5,
    flaggedViolations: 31,
    complianceRate: '84.3%',
    avgSpeedHours: 1.2,
    status: 'Active Field'
  },
  {
    badge: 'LM-OFF-MH-1802',
    name: 'Vijay M. Kapse',
    zone: 'West Zone - Pune Sector',
    totalInspected: 122,
    pendingAction: 1,
    flaggedViolations: 19,
    complianceRate: '84.4%',
    avgSpeedHours: 2.1,
    status: 'Active Field'
  }
];

export const COMPLIANCE_TREND_DATA = [
  { month: 'Apr 2026', total: 110, compliant: 88, violations: 22, rate: 80.0 },
  { month: 'May 2026', total: 135, compliant: 111, violations: 24, rate: 82.2 },
  { month: 'Jun 2026', total: 160, compliant: 126, violations: 34, rate: 78.8 },
  { month: 'Jul 2026', total: 192, compliant: 156, violations: 36, rate: 81.3 },
  { month: 'Aug 2026', total: 220, compliant: 184, violations: 36, rate: 83.6 },
  { month: 'Sep 2026 (MTD)', total: 165, compliant: 132, violations: 33, rate: 80.0 }
];
