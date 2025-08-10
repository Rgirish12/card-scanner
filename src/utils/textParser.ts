import { ParsedCardData } from "@/types";

export const parseCardText = (text: string): ParsedCardData => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);

  // Regex patterns
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phoneRegex =
    /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  const websiteRegex =
    /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

  let result: ParsedCardData = {};

  // Extract email
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    result.email = emailMatch[0];
  }

  // Extract phone
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    result.phone = phoneMatch[0];
  }

  // Extract website
  const websiteMatch = text.match(websiteRegex);
  if (websiteMatch) {
    result.website = websiteMatch[0];
  }

  // Extract name (usually first line)
  if (lines.length > 0) {
    const firstLine = lines[0];
    if (!emailRegex.test(firstLine) && !phoneRegex.test(firstLine)) {
      result.name = firstLine;
    }
  }

  // Extract company (look for Inc, Corp, LLC, etc.)
  const companyKeywords = [
    "inc",
    "corp",
    "llc",
    "ltd",
    "company",
    "co.",
    "corporation",
  ];
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (companyKeywords.some((keyword) => lowerLine.includes(keyword))) {
      result.company = line;
      break;
    }
  }

  // Extract job title (common titles)
  const jobTitles = [
    "manager",
    "director",
    "developer",
    "engineer",
    "designer",
    "consultant",
    "analyst",
    "specialist",
  ];
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (jobTitles.some((title) => lowerLine.includes(title))) {
      result.jobTitle = line;
      break;
    }
  }

  // Extract address (lines with numbers and common address words)
  const addressKeywords = [
    "street",
    "st",
    "avenue",
    "ave",
    "road",
    "rd",
    "drive",
    "dr",
    "suite",
    "floor",
  ];
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (
      (/\d/.test(line) &&
        addressKeywords.some((keyword) => lowerLine.includes(keyword))) ||
      (line.includes(",") && /\d{5}/.test(line))
    ) {
      result.address = line;
      break;
    }
  }

  return result;
};
