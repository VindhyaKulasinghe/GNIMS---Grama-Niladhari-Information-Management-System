import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  escapeHtml,
  getReportFontFamily,
  ReportData,
  translateField,
  TranslateFn,
} from "./reportUtils";

function getReportTitle(type: string, t: TranslateFn): string {
  switch (type) {
    case "household":
      return t("householdReport");
    case "population":
      return t("populationStatistics");
    case "property":
      return t("propertyReport");
    case "vehicle":
      return t("vehicleReport");
    default:
      return t("reports");
  }
}

function tableStyles(fontFamily: string): string {
  return `
    .report-root {
      font-family: ${fontFamily};
      color: #111;
      font-size: 11px;
      line-height: 1.45;
      padding: 16px;
      background: #fff;
    }
    .report-title {
      font-size: 20px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 8px;
    }
    .report-date {
      text-align: right;
      margin-bottom: 16px;
      font-size: 11px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      margin: 16px 0 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      table-layout: fixed;
    }
    th, td {
      border: 1px solid #d1d5db;
      padding: 6px 8px;
      vertical-align: top;
      word-wrap: break-word;
      overflow-wrap: anywhere;
      white-space: normal;
    }
    th {
      background: #f3f4f6;
      font-weight: 700;
    }
    .col-address { width: 22%; }
    .col-name { width: 18%; }
  `;
}

function th(text: string, className = ""): string {
  return `<th class="${className}">${escapeHtml(text)}</th>`;
}

function td(value: unknown, className = ""): string {
  return `<td class="${className}">${escapeHtml(value)}</td>`;
}

function buildHouseholdHtml(data: ReportData, t: TranslateFn): string {
  const rows = data.households
    .map(
      (h) => `<tr>
        ${td(h.houseNumber)}
        ${td(h.address, "col-address")}
        ${td(h.telephone)}
        ${td(
          [
            h.electricity ? t("electricity") : "",
            h.water ? t("water") : "",
            h.toilet ? t("toilet") : "",
          ]
            .filter(Boolean)
            .join(", "),
        )}
        ${td(translateField(t, h.roofType))}
        ${td(translateField(t, h.wallType))}
        ${td(translateField(t, h.floorType))}
        ${td(
          [
            h.cow > 0 ? `${h.cow} ${t("cow")}` : "",
            h.chicken > 0 ? `${h.chicken} ${t("chicken")}` : "",
            h.goat > 0 ? `${h.goat} ${t("goat")}` : "",
          ]
            .filter(Boolean)
            .join(", "),
        )}
      </tr>`,
    )
    .join("");

  return `<table>
    <thead><tr>
      ${th(t("houseNumber"))}
      ${th(t("address"), "col-address")}
      ${th(t("telephone"))}
      ${th(t("facilities"))}
      ${th(t("roofType"))}
      ${th(t("wallType"))}
      ${th(t("floorType"))}
      ${th(t("animals"))}
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function buildPopulationHtml(data: ReportData, t: TranslateFn): string {
  const genderStats = data.familyMembers.reduce(
    (acc, m) => {
      acc[m.gender] = (acc[m.gender] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const ageGroups = [
    { group: "0-18", count: data.familyMembers.filter((m) => m.age <= 18).length },
    {
      group: "19-35",
      count: data.familyMembers.filter((m) => m.age > 18 && m.age <= 35).length,
    },
    {
      group: "36-60",
      count: data.familyMembers.filter((m) => m.age > 35 && m.age <= 60).length,
    },
    {
      group: "60+",
      count: data.familyMembers.filter((m) => m.age > 60).length,
    },
  ];

  const genderRows = Object.entries(genderStats)
    .map(
      ([gender, count]) =>
        `<tr>${td(translateField(t, gender))}${td(count)}</tr>`,
    )
    .join("");

  const ageRows = ageGroups
    .map((g) => `<tr>${td(g.group)}${td(g.count)}</tr>`)
    .join("");

  const memberRows = data.familyMembers
    .map(
      (m) => `<tr>
        ${td(m.fullName, "col-name")}
        ${td(m.age)}
        ${td(translateField(t, m.gender))}
        ${td(translateField(t, m.maritalStatus))}
        ${td(translateField(t, m.educationStatus))}
        ${td(m.jobType ? translateField(t, m.jobType) : "-")}
        ${td(translateField(t, m.memberType))}
      </tr>`,
    )
    .join("");

  return `
    <div class="section-title">${escapeHtml(t("genderDistribution"))}</div>
    <table><thead><tr>${th(t("gender"))}${th(t("count"))}</tr></thead><tbody>${genderRows}</tbody></table>
    <div class="section-title">${escapeHtml(t("ageGroups"))}</div>
    <table><thead><tr>${th(t("ageGroup"))}${th(t("count"))}</tr></thead><tbody>${ageRows}</tbody></table>
    <div class="section-title">${escapeHtml(t("familyMembers"))}</div>
    <table><thead><tr>
      ${th(t("fullName"), "col-name")}
      ${th(t("age"))}
      ${th(t("gender"))}
      ${th(t("maritalStatus"))}
      ${th(t("educationStatus"))}
      ${th(t("jobType"))}
      ${th(t("memberType"))}
    </tr></thead><tbody>${memberRows}</tbody></table>
  `;
}

function buildPropertyHtml(data: ReportData, t: TranslateFn): string {
  const rows = data.properties
    .map(
      (p) => `<tr>
        ${td(p.oppuNumber)}
        ${td(p.ownerName, "col-name")}
        ${td(translateField(t, p.propertyType))}
        ${td(p.propertyCategory === "living" ? t("living") : t("additional"))}
        ${td(p.landSize)}
        ${td(translateField(t, p.ownership))}
        ${td(p.agriculturalUse ? translateField(t, p.agriculturalUse) : "-")}
        ${td(p.ownerPhone)}
      </tr>`,
    )
    .join("");

  return `<table><thead><tr>
    ${th(t("oppuNumber"))}
    ${th(t("ownerName"), "col-name")}
    ${th(t("propertyType"))}
    ${th(t("propertyCategory"))}
    ${th(t("landSize"))}
    ${th(t("ownership"))}
    ${th(t("agriculturalUse"))}
    ${th(t("phone"))}
  </tr></thead><tbody>${rows}</tbody></table>`;
}

function buildVehicleHtml(data: ReportData, t: TranslateFn): string {
  const rows = data.vehicles
    .map(
      (v) => `<tr>
        ${td(v.vehicleNumber)}
        ${td(v.ownerName, "col-name")}
        ${td(v.ownerAddress, "col-address")}
        ${td(translateField(t, v.vehicleType))}
        ${td(v.registrationYear)}
        ${td(v.ownerPhone)}
      </tr>`,
    )
    .join("");

  return `<table><thead><tr>
    ${th(t("vehicleNumber"))}
    ${th(t("ownerName"), "col-name")}
    ${th(t("ownerAddress"), "col-address")}
    ${th(t("vehicleType"))}
    ${th(t("registrationYear"))}
    ${th(t("phone"))}
  </tr></thead><tbody>${rows}</tbody></table>`;
}

function buildReportBody(
  type: string,
  data: ReportData,
  t: TranslateFn,
): string {
  switch (type) {
    case "household":
      return buildHouseholdHtml(data, t);
    case "population":
      return buildPopulationHtml(data, t);
    case "property":
      return buildPropertyHtml(data, t);
    case "vehicle":
      return buildVehicleHtml(data, t);
    default:
      return "";
  }
}

function localFontFaceCss(origin: string): string {
  return `
    @font-face {
      font-family: 'Noto Sans Sinhala';
      src: url('${origin}/fonts/NotoSansSinhala-Regular.ttf') format('truetype');
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: 'Noto Sans Sinhala';
      src: url('${origin}/fonts/NotoSansSinhala-Bold.ttf') format('truetype');
      font-weight: 700;
      font-style: normal;
    }
    @font-face {
      font-family: 'Noto Sans Tamil';
      src: url('${origin}/fonts/NotoSansTamil-Regular.ttf') format('truetype');
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: 'Noto Sans Tamil';
      src: url('${origin}/fonts/NotoSansTamil-Bold.ttf') format('truetype');
      font-weight: 700;
      font-style: normal;
    }
  `;
}

async function waitForIframeFonts(
  iframe: HTMLIFrameElement,
  language: string,
): Promise<void> {
  const doc = iframe.contentDocument;
  if (!doc) {
    return;
  }

  const lang = language.toLowerCase().split("-")[0];
  const families =
    lang === "ta" ? ["Noto Sans Tamil"] : ["Noto Sans Sinhala"];

  if (doc.fonts?.load) {
    await Promise.all(
      families.flatMap((family) => [
        doc.fonts.load(`400 16px "${family}"`),
        doc.fonts.load(`700 16px "${family}"`),
      ]),
    );
  }

  await doc.fonts.ready;
}

function buildReportDocumentHtml(
  title: string,
  dateLine: string,
  body: string,
  fontFamily: string,
  language: string,
  origin: string,
): string {
  const lang = language.split("-")[0];

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <style>
    ${localFontFaceCss(origin)}
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #111111;
    }
    ${tableStyles(fontFamily)}
  </style>
</head>
<body>
  <div class="report-root">
    <div class="report-title">${title}</div>
    <div class="report-date">${dateLine}</div>
    ${body}
  </div>
</body>
</html>`;
}

async function canvasToPdf(
  canvas: HTMLCanvasElement,
  filename: string,
): Promise<void> {
  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const margin = 8;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const printableWidth = pageWidth - margin * 2;
  const printableHeight = pageHeight - margin * 2;
  const imgHeight = (canvas.height * printableWidth) / canvas.width;

  let position = 0;
  let remaining = imgHeight;

  pdf.addImage(
    imgData,
    "JPEG",
    margin,
    margin,
    printableWidth,
    imgHeight,
  );
  remaining -= printableHeight;

  while (remaining > 0) {
    position += printableHeight;
    pdf.addPage();
    pdf.addImage(
      imgData,
      "JPEG",
      margin,
      margin - position,
      printableWidth,
      imgHeight,
    );
    remaining -= printableHeight;
  }

  pdf.save(filename);
}

/** Browser-rendered PDF for Sinhala/Tamil (correct complex script shaping). */
export async function generateHtmlReport(
  type: string,
  data: ReportData,
  language: string,
  t: TranslateFn,
): Promise<void> {
  const fontFamily = getReportFontFamily(language);
  const title = escapeHtml(getReportTitle(type, t));
  const dateLine = `${escapeHtml(t("date"))}: ${escapeHtml(new Date().toLocaleDateString(language))}`;
  const langCode = language.split("-")[0];
  const origin = window.location.origin;

  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.left = "-10000px";
  iframe.style.top = "0";
  iframe.style.width = "1100px";
  iframe.style.height = "2400px";
  iframe.style.border = "0";
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);

  const contentWindow = iframe.contentWindow;
  if (!contentWindow) {
    document.body.removeChild(iframe);
    throw new Error("Failed to create report frame");
  }

  iframe.srcdoc = buildReportDocumentHtml(
    title,
    dateLine,
    buildReportBody(type, data, t),
    fontFamily,
    language,
    origin,
  );

  await new Promise<void>((resolve) => {
    iframe.onload = () => resolve();
    window.setTimeout(resolve, 1500);
  });

  const doc = iframe.contentDocument;
  if (!doc?.body) {
    document.body.removeChild(iframe);
    throw new Error("Failed to load report content");
  }

  await waitForIframeFonts(iframe, language);

  try {
    const canvas = await html2canvas(doc.body, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      window: contentWindow,
      width: 1100,
      scrollX: 0,
      scrollY: 0,
    });

    await canvasToPdf(canvas, `${type}_report_${langCode}.pdf`);
  } finally {
    document.body.removeChild(iframe);
  }
}
