/**
 * Company intel heuristics. No external APIs or scraping.
 * Size: Startup (<200), Mid-size (200–2000), Enterprise (2000+).
 */

const ENTERPRISE_NAMES = [
  "amazon", "microsoft", "google", "meta", "apple", "netflix",
  "infosys", "tcs", "tata consultancy", "wipro", "hcl", "capgemini",
  "accenture", "cognizant", "ibm", "oracle", "salesforce", "adobe",
  "intel", "cisco", "vmware", "sap", "dell", "hp", "tech mahindra",
  "ltimindtree", "lti", "mindtree", "persistent", "zensar", "mphasis",
];

function normalizeCompany(name) {
  return String(name || "").trim().toLowerCase();
}

/**
 * Returns "enterprise" | "mid-size" | "startup".
 * Known big names → Enterprise; unknown → Startup by default.
 */
export function getCompanySize(companyName) {
  const name = normalizeCompany(companyName);
  if (!name) return "startup";

  const isEnterprise = ENTERPRISE_NAMES.some((ent) => name.includes(ent));
  if (isEnterprise) return "enterprise";

  return "startup";
}

/**
 * Simple industry guess from company name or JD text. Default "Technology Services".
 */
export function getIndustry(companyName, jdText) {
  const combined = `${companyName || ""} ${jdText || ""}`.toLowerCase();

  if (/\bfintech\b|banking|finance|payment|investment\b/.test(combined))
    return "Financial Services";
  if (/\bhealth(care)?|medical|pharma|biotech\b/.test(combined))
    return "Healthcare";
  if (/\be-commerce|ecommerce|retail\b/.test(combined))
    return "E‑commerce / Retail";
  if (/\bedtech|education\b/.test(combined))
    return "Education Technology";
  if (/\bautomotive|auto\b/.test(combined))
    return "Automotive";
  if (/\bmanufacturing\b/.test(combined))
    return "Manufacturing";

  return "Technology Services";
}

/**
 * Template text for typical hiring focus by size.
 */
export function getTypicalHiringFocus(size) {
  if (size === "enterprise") {
    return "Structured DSA and core CS fundamentals; standardized online tests and technical rounds. Strong emphasis on algorithms, system design basics, and behavioral fit.";
  }
  if (size === "mid-size") {
    return "Balance of problem-solving and stack depth. Often practical coding tasks and system discussion; culture fit and ownership matter.";
  }
  return "Practical problem-solving and stack depth. Expect hands-on coding, system discussion, and culture fit over heavy DSA standardization.";
}

/**
 * Full company intel object for persistence. Call when company name is provided.
 */
export function getCompanyIntel(companyName, jdText) {
  const displayName = String(companyName || "").trim();
  if (!displayName) return null;

  const size = getCompanySize(displayName);
  const industry = getIndustry(displayName, jdText);
  const sizeLabel =
    size === "enterprise" ? "Enterprise (2000+)" :
    size === "mid-size" ? "Mid-size (200–2000)" : "Startup (<200)";
  const typicalHiringFocus = getTypicalHiringFocus(size);

  return {
    companyName: displayName,
    industry,
    size,
    sizeLabel,
    typicalHiringFocus,
  };
}
