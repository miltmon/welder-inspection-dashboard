export type ClauseRef = {
  code: string;
  clause: string;
  id: string;
  text?: string;
  url?: string;
  confidence?: number;
};

export const P_NUMBER = [
  { p: "1", desc: "Carbon steel (Group 1-3)" },
  { p: "3", desc: "Low alloy steel" },
  { p: "4", desc: "Low alloy steel (Cr-Mo)" },
  { p: "5", desc: "Alloy steel (Cr-Mo-V, Mn-Mo-Ni)" },
  { p: "6", desc: "High alloy ferritic, martensitic, austenitic steel" },
  { p: "7", desc: "Iron-based alloys" },
  { p: "8", desc: "Austenitic stainless steel (300 series)" },
  { p: "9", desc: "Nickel-based alloys" },
  { p: "10", desc: "Specialty high alloy steels" },
  { p: "11", desc: "Duplex/super duplex stainless" },
  { p: "21", desc: "Aluminum and aluminum-based alloys" },
  { p: "22", desc: "Copper and copper-based alloys" },
  { p: "23", desc: "Nickel" },
  { p: "31", desc: "Titanium and titanium-based alloys" },
  { p: "41", desc: "Reactive and refractory alloys" },
];

export const F_NUMBER = [
  { f: "1", desc: "EXX20, EXX22, EXX24, EXX27, EXX28 (SMAW)" },
  { f: "2", desc: "EXX12, EXX13, EXX14 (SMAW)" },
  { f: "3", desc: "EXX10, EXX11 (SMAW)" },
  { f: "4", desc: "EXX15, EXX16, EXX18, EXX48 (Low hydrogen SMAW)" },
  { f: "5", desc: "EXXX5 (FCAW)" },
  { f: "6", desc: "ER70S, ER308, ER316 (GMAW/GTAW solid wire)" },
  { f: "7", desc: "Iron powder low hydrogen (SMAW)" },
  { f: "8", desc: "ER316/316L family (Stainless GMAW/GTAW)" },
  { f: "21", desc: "Aluminum filler metals (ER4XXX)" },
  { f: "22", desc: "Copper and copper alloy fillers" },
  { f: "23", desc: "Nickel-based filler metals" },
  { f: "31", desc: "Titanium filler metals" },
];

export const A_NUMBER = [
  { a: "1", desc: "Carbon steel weld metal (C ≤ 0.15%)" },
  { a: "2", desc: "Carbon-molybdenum weld metal" },
  { a: "3", desc: "Chromium-molybdenum weld metal (≤ 2% Cr)" },
  { a: "4", desc: "Chromium-molybdenum weld metal (2-3% Cr)" },
  { a: "5", desc: "Chromium-molybdenum weld metal (3-10% Cr)" },
  { a: "6", desc: "Martensitic stainless weld metal" },
  { a: "7", desc: "Ferritic stainless weld metal" },
  { a: "8", desc: "Austenitic stainless weld metal (308/309 family)" },
  { a: "9", desc: "Austenitic stainless weld metal (316/317 family)" },
  { a: "10", desc: "Nickel-based weld metal" },
  { a: "11", desc: "Duplex stainless weld metal" },
];

// Comprehensive clause database (expandable to full AWS D1.1 + ASME IX)
export const CLAUSE_DB: Record<string, ClauseRef> = {
  // Base Metal - P-Numbers
  "P1-CARBON": {
    code: "ASME IX",
    clause: "QW-420",
    id: "ASME-IX:QW-420",
    text: "P-Number 1: Carbon steel, Group 1-3",
    url: "https://www.asme.org/codes-standards/find-codes-standards/bpvc-ix-bpvc-section-ix-welding-brazing-fusing-qualifications"
  },
  "P8-STAINLESS": {
    code: "ASME IX",
    clause: "QW-420.8",
    id: "ASME-IX:QW-420.8",
    text: "P-Number 8: Austenitic stainless steel (300 series)",
    url: "https://www.asme.org/codes-standards/find-codes-standards/bpvc-ix-bpvc-section-ix-welding-brazing-fusing-qualifications"
  },
  "P21-ALUMINUM": {
    code: "ASME IX",
    clause: "QW-420.21",
    id: "ASME-IX:QW-420.21",
    text: "P-Number 21: Aluminum and aluminum-based alloys"
  },

  // Filler Metal - F-Numbers
  "F4-LOW-H": {
    code: "ASME IX",
    clause: "QW-432",
    id: "ASME-IX:QW-432.4",
    text: "F-Number 4: Low hydrogen electrodes (E7018 family)",
    url: "https://www.asme.org/codes-standards/find-codes-standards/bpvc-ix-bpvc-section-ix-welding-brazing-fusing-qualifications"
  },
  "F6-SOLID": {
    code: "ASME IX",
    clause: "QW-432",
    id: "ASME-IX:QW-432.6",
    text: "F-Number 6: Solid wire (ER70S, ER308, ER316)"
  },
  "F8-SS316": {
    code: "ASME IX",
    clause: "QW-432",
    id: "ASME-IX:QW-432.8",
    text: "F-Number 8: ER316/316L stainless steel filler"
  },

  // Welding Processes
  "SMAW-PROC": {
    code: "ASME IX",
    clause: "QW-409.1",
    id: "ASME-IX:QW-409.1",
    text: "SMAW (Shielded Metal Arc Welding) process requirements"
  },
  "GMAW-PROC": {
    code: "ASME IX",
    clause: "QW-409.2",
    id: "ASME-IX:QW-409.2",
    text: "GMAW (Gas Metal Arc Welding) process requirements"
  },
  "GTAW-PROC": {
    code: "ASME IX",
    clause: "QW-409.3",
    id: "ASME-IX:QW-409.3",
    text: "GTAW (Gas Tungsten Arc Welding) process requirements"
  },
  "FCAW-PROC": {
    code: "ASME IX",
    clause: "QW-409.4",
    id: "ASME-IX:QW-409.4",
    text: "FCAW (Flux-Cored Arc Welding) process requirements"
  },
  "SAW-PROC": {
    code: "ASME IX",
    clause: "QW-409.5",
    id: "ASME-IX:QW-409.5",
    text: "SAW (Submerged Arc Welding) process requirements"
  },

  // Essential Variables
  "ESS_VAR-THICK": {
    code: "ASME IX",
    clause: "QW-451",
    id: "ASME-IX:QW-451",
    text: "Essential variable: Base metal thickness qualification rules"
  },
  "ESS_VAR-POSITION": {
    code: "ASME IX",
    clause: "QW-461",
    id: "ASME-IX:QW-461",
    text: "Essential variable: Position of welding qualification"
  },
  "ESS_VAR-PREHEAT": {
    code: "ASME IX",
    clause: "QW-406",
    id: "ASME-IX:QW-406",
    text: "Essential variable: Preheat temperature requirements"
  },
  "ESS_VAR-PWHT": {
    code: "ASME IX",
    clause: "QW-407",
    id: "ASME-IX:QW-407",
    text: "Essential variable: Post-weld heat treatment (PWHT)"
  },

  // AWS D1.1 Specific
  "AWS-PREHEAT": {
    code: "AWS D1.1",
    clause: "Table 5.8",
    id: "AWS-D1.1:Table-5.8",
    text: "Minimum preheat and interpass temperatures"
  },
  "AWS-VISUAL": {
    code: "AWS D1.1",
    clause: "6.12",
    id: "AWS-D1.1:6.12",
    text: "Visual inspection acceptance criteria"
  },
  "AWS-PREQUALIFIED": {
    code: "AWS D1.1",
    clause: "5.1",
    id: "AWS-D1.1:5.1",
    text: "Prequalified welding procedure specifications"
  },
};

/**
 * Transform CODEX result to ClauseRef format
 */
function codexResultToClauseRef(result: any, index: number): ClauseRef {
  return {
    code: result.metadata.Code_Reference_Primary?.split(',')[0]?.trim() || result.metadata.clause_reference?.split(',')[0]?.trim() || 'AWS D1.1',
    clause: result.metadata.clause_reference || result.metadata.Code_Reference_Primary || '',
    id: result.metadata.NLM_ID || `codex-${index}`,
    text: result.text || result.metadata.question || '',
    confidence: result.score || 0.8,
    url: result.metadata.url
  };
}

/**
 * Extract keyword from field value for CODEX query
 */
function buildCodexQuery(fieldName: string, fieldValue: string, context?: { pNumber?: string; fNumber?: string; process?: string }): string {
  // Build a focused query from field context
  const keywords: string[] = [];
  
  if (fieldName.toLowerCase().includes('preheat')) {
    keywords.push('preheat', 'temperature');
    if (fieldValue && fieldValue !== 'None required' && fieldValue !== 'None') {
      keywords.push(fieldValue);
    }
  } else if (fieldName.toLowerCase().includes('base') || fieldName.toLowerCase().includes('metal')) {
    keywords.push('base metal', fieldValue);
    if (context?.pNumber) keywords.push(`P-${context.pNumber}`);
  } else if (fieldName.toLowerCase().includes('filler')) {
    keywords.push('filler metal', fieldValue);
    if (context?.fNumber) keywords.push(`F-${context.fNumber}`);
  } else if (fieldName.toLowerCase().includes('process')) {
    keywords.push('welding process', fieldValue || context?.process || '');
  } else if (fieldName.toLowerCase().includes('thickness')) {
    keywords.push('thickness', 'essential variable');
  } else if (fieldName.toLowerCase().includes('position')) {
    keywords.push('welding position', 'essential variable');
  } else if (fieldName.toLowerCase().includes('pwht')) {
    keywords.push('post weld heat treatment', 'PWHT');
  } else {
    keywords.push(fieldName, fieldValue);
  }
  
  return keywords.filter(Boolean).join(' ');
}

/**
 * Async clause suggestion with CODEX integration
 * Falls back to local mock if CODEX unavailable
 */
export async function suggestClauseAsync(
  fieldName: string,
  fieldValue: string,
  context?: { pNumber?: string; fNumber?: string; process?: string }
): Promise<ClauseRef[]> {
  // Import CODEX service dynamically to avoid issues in dev
  try {
    const { clauseLookup, getEmptyResultsMessage } = await import('../services/clausebot');
    
    // Build query from field context
    const query = buildCodexQuery(fieldName, fieldValue, context);
    
    if (!query.trim()) {
      // Fall back to local mock if query is empty
      return suggestClause(fieldName, fieldValue, context);
    }
    
    try {
      const codexResponse = await clauseLookup(query, 3);
      
      if (codexResponse.results && codexResponse.results.length > 0) {
        // Transform CODEX results to ClauseRef format
        return codexResponse.results.map((result, idx) => codexResultToClauseRef(result, idx));
      }
      
      // Empty results - try simplified query for preheat
      if (fieldName.toLowerCase().includes('preheat') && query.includes('clause')) {
        const simplifiedQuery = 'preheat temperature';
        const fallbackResponse = await clauseLookup(simplifiedQuery, 3);
        if (fallbackResponse.results && fallbackResponse.results.length > 0) {
          return fallbackResponse.results.map((result, idx) => codexResultToClauseRef(result, idx));
        }
      }
      
      // Fall back to local mock if CODEX returns empty
      return suggestClause(fieldName, fieldValue, context);
    } catch (error) {
      console.warn('CODEX lookup failed, using local mock:', error);
      return suggestClause(fieldName, fieldValue, context);
    }
  } catch (error) {
    // Service import failed (dev mode or service not available)
    console.warn('CODEX service not available, using local mock:', error);
    return suggestClause(fieldName, fieldValue, context);
  }
}

/**
 * Smart clause suggestion engine (mock/prototype version)
 * Replace with ClauseBot API call for production
 * Kept for synchronous fallback and development
 */
export function suggestClause(
  fieldName: string,
  fieldValue: string,
  context?: { pNumber?: string; fNumber?: string; process?: string }
): ClauseRef[] {
  const suggestions: ClauseRef[] = [];

  // Base metal suggestions
  if (fieldName === "base_metal" || fieldName === "Base Metal") {
    if (fieldValue.includes("304") || fieldValue.includes("316") || context?.pNumber === "8") {
      suggestions.push({ ...CLAUSE_DB["P8-STAINLESS"], confidence: 0.95 });
    } else if (fieldValue.includes("A36") || fieldValue.includes("A572") || context?.pNumber === "1") {
      suggestions.push({ ...CLAUSE_DB["P1-CARBON"], confidence: 0.92 });
    } else if (fieldValue.toLowerCase().includes("aluminum") || context?.pNumber === "21") {
      suggestions.push({ ...CLAUSE_DB["P21-ALUMINUM"], confidence: 0.88 });
    }
  }

  // Filler metal suggestions
  if (fieldName === "filler_metal" || fieldName === "Filler Metal") {
    if (fieldValue.includes("E7018") || context?.fNumber === "4") {
      suggestions.push({ ...CLAUSE_DB["F4-LOW-H"], confidence: 0.97 });
    } else if (fieldValue.includes("ER70S") || fieldValue.includes("ER308") || context?.fNumber === "6") {
      suggestions.push({ ...CLAUSE_DB["F6-SOLID"], confidence: 0.94 });
    } else if (fieldValue.includes("ER316") || context?.fNumber === "8") {
      suggestions.push({ ...CLAUSE_DB["F8-SS316"], confidence: 0.96 });
    }
  }

  // Process suggestions
  if (fieldName === "process" || fieldName === "Process" || fieldName === "welding_process") {
    const processUpper = (fieldValue || context?.process || "").toUpperCase();
    if (processUpper === "GTAW") {
      suggestions.push({ ...CLAUSE_DB["GTAW-PROC"], confidence: 1.0 });
    } else if (processUpper === "GMAW") {
      suggestions.push({ ...CLAUSE_DB["GMAW-PROC"], confidence: 1.0 });
    } else if (processUpper === "SMAW") {
      suggestions.push({ ...CLAUSE_DB["SMAW-PROC"], confidence: 1.0 });
    } else if (processUpper === "FCAW") {
      suggestions.push({ ...CLAUSE_DB["FCAW-PROC"], confidence: 1.0 });
    } else if (processUpper === "SAW") {
      suggestions.push({ ...CLAUSE_DB["SAW-PROC"], confidence: 1.0 });
    }
  }

  // Thickness always gets essential variable clause
  if (fieldName === "thickness" || fieldName === "Thickness Range" || fieldName.includes("thick")) {
    suggestions.push({ ...CLAUSE_DB["ESS_VAR-THICK"], confidence: 0.90 });
  }

  // Position always gets essential variable clause
  if (fieldName === "position" || fieldName === "Position" || fieldName.includes("position")) {
    suggestions.push({ ...CLAUSE_DB["ESS_VAR-POSITION"], confidence: 0.95 });
  }

  // Preheat
  if (fieldName.toLowerCase().includes("preheat")) {
    suggestions.push({ ...CLAUSE_DB["ESS_VAR-PREHEAT"], confidence: 0.88 });
    suggestions.push({ ...CLAUSE_DB["AWS-PREHEAT"], confidence: 0.85 });
  }

  // PWHT
  if (fieldName.toLowerCase().includes("pwht") || fieldName.toLowerCase().includes("heat treatment")) {
    suggestions.push({ ...CLAUSE_DB["ESS_VAR-PWHT"], confidence: 0.92 });
  }

  // If no specific suggestions, return generic essential variable clause
  if (suggestions.length === 0) {
    suggestions.push({
      code: "ASME IX",
      clause: "QW-250",
      id: "ASME-IX:QW-250",
      text: "General WPS requirements",
      confidence: 0.50
    });
  }

  return suggestions;
}

/**
 * Get P-Number from material description
 */
export function inferPNumber(baseMetal: string): string {
  const material = baseMetal.toLowerCase();
  if (material.includes("304") || material.includes("316") || material.includes("stainless")) {
    return "8";
  } else if (material.includes("aluminum")) {
    return "21";
  } else if (material.includes("a36") || material.includes("a572") || material.includes("carbon")) {
    return "1";
  }
  return "1"; // Default to carbon steel
}

/**
 * Get F-Number from filler metal description
 */
export function inferFNumber(fillerMetal: string): string {
  const filler = fillerMetal.toUpperCase();
  if (filler.includes("E7018")) {
    return "4";
  } else if (filler.includes("ER70S") || filler.includes("ER308")) {
    return "6";
  } else if (filler.includes("ER316")) {
    return "8";
  }
  return "6"; // Default to solid wire
}
