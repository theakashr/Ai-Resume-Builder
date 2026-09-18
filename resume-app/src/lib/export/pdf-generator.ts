import { FullResumeState } from "@/components/builder/LiveResumePaperPreview";

function escapePdfText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[^\x20-\x7E]/g, " ");
}

function wrapLine(text: string, maxChars: number = 85): string[] {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length <= maxChars) {
      currentLine = (currentLine + " " + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function getByteLength(text: string): number {
  return new TextEncoder().encode(text).byteLength;
}

export function generateResumePDFBuffer(
  resumeData: FullResumeState | any,
  templateStyle: string = "modern"
): Uint8Array {
  // Normalize dataset
  const personal = resumeData?.personalInfo || resumeData?.personal_info || {};
  const fullName = personal.fullName || personal.full_name || resumeData?.title || "Professional Resume";
  const jobTitle = personal.jobTitle || personal.job_title || "";
  const email = personal.email || "";
  const phone = personal.phone || "";
  const location = personal.location || "";
  const website = personal.website || personal.linkedin || "";
  const summary = resumeData?.summary || "";
  const experience: any[] = resumeData?.experience || [];
  const education: any[] = resumeData?.education || [];
  const skills: string[] = Array.isArray(resumeData?.skills) ? resumeData.skills : [];
  const projects: any[] = resumeData?.projects || [];
  const certifications: any[] = resumeData?.certifications || [];

  // Build stream operators for PDF commands
  const commands: string[] = [];

  // Page Dimensions (Letter: 612 x 792 pt)
  let y = 740;
  const startX = 54;
  const bottomMargin = 50;

  function checkPageBreak(neededHeight: number) {
    if (y - neededHeight < bottomMargin) {
      commands.push("ET");
      commands.push("SHOWPAGE_MARKER");
      commands.push("BT");
      y = 740;
    }
  }

  commands.push("BT");

  // 1. Header (Name & Contact)
  commands.push("/F2 20 Tf");
  commands.push(`${startX} ${y} Td`);
  commands.push(`(${escapePdfText(fullName)}) Tj`);
  y -= 22;

  if (jobTitle) {
    commands.push("/F1 12 Tf");
    commands.push(`0 -16 Td`);
    commands.push(`(${escapePdfText(jobTitle)}) Tj`);
    y -= 16;
  }

  const contactParts = [email, phone, location, website].filter(Boolean);
  if (contactParts.length > 0) {
    commands.push("/F1 9 Tf");
    commands.push(`0 -14 Td`);
    commands.push(`(${escapePdfText(contactParts.join("  |  "))}) Tj`);
    y -= 14;
  }

  y -= 10;

  // Helper for Section Headers
  function addSectionHeader(title: string) {
    checkPageBreak(35);
    commands.push("/F2 12 Tf");
    commands.push(`0 -20 Td`);
    commands.push(`(${escapePdfText(title.toUpperCase())}) Tj`);
    y -= 20;
  }

  // 2. Summary
  if (summary && summary.trim().length > 0) {
    addSectionHeader("Professional Summary");
    commands.push("/F1 10 Tf");
    const lines = wrapLine(summary, 85);
    for (const line of lines) {
      checkPageBreak(14);
      commands.push(`0 -13 Td`);
      commands.push(`(${escapePdfText(line)}) Tj`);
      y -= 13;
    }
  }

  // 3. Work Experience
  if (experience && experience.length > 0) {
    addSectionHeader("Work Experience");
    for (const exp of experience) {
      const role = exp.role || exp.position || "Position";
      const company = exp.company || "";
      const period = exp.period || exp.dates || "";

      checkPageBreak(30);
      commands.push("/F2 11 Tf");
      commands.push(`0 -16 Td`);
      commands.push(`(${escapePdfText(`${role}${company ? " — " + company : ""}`)}) Tj`);
      y -= 16;

      if (period) {
        commands.push("/F1 9 Tf");
        commands.push(`0 -12 Td`);
        commands.push(`(${escapePdfText(period)}) Tj`);
        y -= 12;
      }

      const bullets: string[] = Array.isArray(exp.bullets)
        ? exp.bullets
        : typeof exp.description === "string"
        ? exp.description.split("\n").filter(Boolean)
        : [];

      for (const bullet of bullets) {
        const bulletLines = wrapLine(`• ${bullet.replace(/^[•\-*]\s*/, "")}`, 82);
        for (const line of bulletLines) {
          checkPageBreak(13);
          commands.push("/F1 9.5 Tf");
          commands.push(`0 -12 Td`);
          commands.push(`(${escapePdfText(line)}) Tj`);
          y -= 12;
        }
      }
    }
  }

  // 4. Skills
  if (skills && skills.length > 0) {
    addSectionHeader("Skills & Competencies");
    commands.push("/F1 10 Tf");
    const skillText = skills.join(", ");
    const skillLines = wrapLine(skillText, 85);
    for (const line of skillLines) {
      checkPageBreak(14);
      commands.push(`0 -13 Td`);
      commands.push(`(${escapePdfText(line)}) Tj`);
      y -= 13;
    }
  }

  // 5. Education
  if (education && education.length > 0) {
    addSectionHeader("Education");
    for (const edu of education) {
      const degree = edu.degree || "Degree";
      const inst = edu.institution || edu.school || "";
      const year = edu.year || edu.dates || "";

      checkPageBreak(25);
      commands.push("/F2 10.5 Tf");
      commands.push(`0 -15 Td`);
      commands.push(`(${escapePdfText(`${degree}${inst ? " — " + inst : ""}`)}) Tj`);
      y -= 15;

      if (year) {
        commands.push("/F1 9 Tf");
        commands.push(`0 -12 Td`);
        commands.push(`(${escapePdfText(year)}) Tj`);
        y -= 12;
      }
    }
  }

  // 6. Featured Projects
  if (projects && projects.length > 0) {
    addSectionHeader("Featured Projects");
    for (const proj of projects) {
      const title = proj.title || "Project";
      const desc = proj.description || "";
      const link = proj.link || "";

      checkPageBreak(25);
      commands.push("/F2 10.5 Tf");
      commands.push(`0 -15 Td`);
      commands.push(`(${escapePdfText(`${title}${link ? " (" + link + ")" : ""}`)}) Tj`);
      y -= 15;

      if (desc) {
        const pLines = wrapLine(desc, 82);
        for (const line of pLines) {
          checkPageBreak(13);
          commands.push("/F1 9.5 Tf");
          commands.push(`0 -12 Td`);
          commands.push(`(${escapePdfText(line)}) Tj`);
          y -= 12;
        }
      }
    }
  }

  // 7. Certifications
  if (certifications && certifications.length > 0) {
    addSectionHeader("Certifications");
    for (const cert of certifications) {
      const name = cert.name || "Certification";
      const issuer = cert.issuer || "";
      const year = cert.year || "";

      checkPageBreak(20);
      commands.push("/F1 10 Tf");
      commands.push(`0 -13 Td`);
      commands.push(`(${escapePdfText(`${name}${issuer ? " — " + issuer : ""}${year ? " (" + year + ")" : ""}`)}) Tj`);
      y -= 13;
    }
  }

  commands.push("ET");

  // Group stream commands into pages
  const fullCommandStream = commands.join("\n");
  const rawPages = fullCommandStream.split("\nSHOWPAGE_MARKER\n");

  // Construct PDF Objects & xref table
  const pdfObjects: string[] = [];
  const pageObjectIds: number[] = [];

  // Object 1: Catalog
  pdfObjects[1] = `1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj`;

  // Reserve Obj 3 for Font F1 (Helvetica), Obj 4 for Font F2 (Helvetica-Bold)
  pdfObjects[3] = `3 0 obj\n<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>\nendobj`;
  pdfObjects[4] = `4 0 obj\n<</Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold>>\nendobj`;

  let nextObjId = 5;
  for (let i = 0; i < rawPages.length; i++) {
    const pageObjId = nextObjId++;
    const contentObjId = nextObjId++;
    pageObjectIds.push(pageObjId);

    const streamContent = rawPages[i];
    const streamLength = getByteLength(streamContent);

    pdfObjects[pageObjId] = `${pageObjId} 0 obj\n<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources <</Font <</F1 3 0 R /F2 4 0 R>>>> /Contents ${contentObjId} 0 R>>\nendobj`;
    pdfObjects[contentObjId] = `${contentObjId} 0 obj\n<</Length ${streamLength}>>\nstream\n${streamContent}\nendstream\nendobj`;
  }

  // Object 2: Pages Catalog
  pdfObjects[2] = `2 0 obj\n<</Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjectIds.length}>>\nendobj`;

  // Assemble Binary PDF String with exact byte xref calculation
  let pdfString = "%PDF-1.4\n";
  const offsets: number[] = [];

  const maxObjId = pdfObjects.length - 1;
  for (let i = 1; i <= maxObjId; i++) {
    offsets[i] = getByteLength(pdfString);
    pdfString += pdfObjects[i] + "\n";
  }

  const startXref = getByteLength(pdfString);
  pdfString += `xref\n0 ${maxObjId + 1}\n0000000000 65535 f \n`;

  for (let i = 1; i <= maxObjId; i++) {
    const off = offsets[i].toString().padStart(10, "0");
    pdfString += `${off} 00000 n \n`;
  }

  pdfString += `trailer\n<</Size ${maxObjId + 1} /Root 1 0 R>>\nstartxref\n${startXref}\n%%EOF`;

  return new TextEncoder().encode(pdfString);
}
