import { pdfMake, setupPdfFonts } from "./pdfFontSetup";
import { generateHtmlReport } from "./reportHtmlExporter";
import {
  ReportData,
  buildAswasumaReportRows,
  translateField,
  TranslateFn,
  usesComplexScriptPdf,
} from "./reportUtils";

export type { ReportData } from "./reportUtils";

function pdfCell(value: unknown, font: string) {
  const text =
    value === null || value === undefined || value === ""
      ? "-"
      : String(value).normalize("NFC");

  return { text, font };
}

function headerCell(text: string, font: string) {
  return { text, style: "tableHeader", font };
}

export async function generateReport(
  type: string,
  data: ReportData,
  language: string,
  t: TranslateFn,
) {
  if (usesComplexScriptPdf(language)) {
    await generateHtmlReport(type, data, language, t);
    return;
  }

  await generatePdfMakeReport(type, data, language, t);
}

async function generatePdfMakeReport(
  type: string,
  data: ReportData,
  language: string,
  t: TranslateFn,
) {
  const fontFamily = await setupPdfFonts(language);

  const docDefinition: any = {
    content: [],
    defaultStyle: {
      fontSize: 10,
      font: fontFamily,
    },
    styles: {
      header: {
        font: fontFamily,
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        font: fontFamily,
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tableHeader: {
        font: fontFamily,
        bold: true,
        fontSize: 11,
        color: "black",
        fillColor: "#f3f4f6",
      },
    },
  };

  let title = "";
  switch (type) {
    case "household":
      title = t("householdReport");
      break;
    case "population":
      title = t("populationStatistics");
      break;
    case "property":
      title = t("propertyReport");
      break;
    case "vehicle":
      title = t("vehicleReport");
      break;
    case "aswasuma":
      title = t("aswasumaReport");
      break;
  }

  docDefinition.content.push({
    text: title,
    style: "header",
    alignment: "center",
    font: fontFamily,
  });
  docDefinition.content.push({
    text: `${t("date")}: ${new Date().toLocaleDateString(language)}`,
    margin: [0, 0, 0, 20],
    alignment: "right",
    font: fontFamily,
  });

  try {
    if (type === "household") {
      docDefinition.content.push(getHouseholdTable(data.households, t, fontFamily));
    } else if (type === "population") {
      docDefinition.content.push(
        ...getPopulationContent(data.familyMembers, t, fontFamily),
      );
    } else if (type === "property") {
      docDefinition.content.push(getPropertyTable(data.properties, t, fontFamily));
    } else if (type === "vehicle") {
      docDefinition.content.push(getVehicleTable(data.vehicles, t, fontFamily));
    } else if (type === "aswasuma") {
      docDefinition.content.push(getAswasumaTable(data, t, fontFamily));
    }

    const langCode = language.split("-")[0];
    (pdfMake as any)
      .createPdf(docDefinition)
      .download(`${type}_report_${langCode}.pdf`);
  } catch (error) {
    console.error("PDF generation internal error:", error);
    throw error;
  }
}

function getHouseholdTable(
  households: ReportData["households"],
  t: TranslateFn,
  font: string,
) {
  return {
    table: {
      headerRows: 1,
      widths: ["auto", "*", "auto", "auto", "auto", "auto", "auto", "auto"],
      body: [
        [
          headerCell(t("houseNumber"), font),
          headerCell(t("address"), font),
          headerCell(t("telephone"), font),
          headerCell(t("facilities"), font),
          headerCell(t("roofType"), font),
          headerCell(t("wallType"), font),
          headerCell(t("floorType"), font),
          headerCell(t("animals"), font),
        ],
        ...households.map((h) => [
          pdfCell(h.houseNumber, font),
          pdfCell(h.address, font),
          pdfCell(h.telephone, font),
          pdfCell(
            [
              h.electricity ? t("electricity") : "",
              h.water ? t("water") : "",
              h.toilet ? t("toilet") : "",
            ]
              .filter(Boolean)
              .join(", "),
            font,
          ),
          pdfCell(translateField(t, h.roofType), font),
          pdfCell(translateField(t, h.wallType), font),
          pdfCell(translateField(t, h.floorType), font),
          pdfCell(
            [
              h.cow > 0 ? `${h.cow} ${t("cow")}` : "",
              h.chicken > 0 ? `${h.chicken} ${t("chicken")}` : "",
              h.goat > 0 ? `${h.goat} ${t("goat")}` : "",
            ]
              .filter(Boolean)
              .join(", "),
            font,
          ),
        ]),
      ],
    },
    layout: "lightHorizontalLines",
  };
}

function getPopulationContent(
  familyMembers: ReportData["familyMembers"],
  t: TranslateFn,
  font: string,
) {
  const genderStats = familyMembers.reduce(
    (acc, m) => {
      acc[m.gender] = (acc[m.gender] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const ageGroups = [
    { group: "0-18", count: familyMembers.filter((m) => m.age <= 18).length },
    {
      group: "19-35",
      count: familyMembers.filter((m) => m.age > 18 && m.age <= 35).length,
    },
    {
      group: "36-60",
      count: familyMembers.filter((m) => m.age > 35 && m.age <= 60).length,
    },
    { group: "60+", count: familyMembers.filter((m) => m.age > 60).length },
  ];

  return [
    { text: t("genderDistribution"), style: "subheader", font },
    {
      table: {
        headerRows: 1,
        widths: ["*", "auto"],
        body: [
          [headerCell(t("gender"), font), headerCell(t("count"), font)],
          ...Object.entries(genderStats).map(([gender, count]) => [
            pdfCell(translateField(t, gender), font),
            pdfCell(count, font),
          ]),
        ],
      },
      layout: "lightHorizontalLines",
      margin: [0, 0, 0, 15],
    },
    { text: t("ageGroups"), style: "subheader", font },
    {
      table: {
        headerRows: 1,
        widths: ["*", "auto"],
        body: [
          [headerCell(t("ageGroup"), font), headerCell(t("count"), font)],
          ...ageGroups.map((g) => [pdfCell(g.group, font), pdfCell(g.count, font)]),
        ],
      },
      layout: "lightHorizontalLines",
      margin: [0, 0, 0, 15],
    },
    { text: t("familyMembers"), style: "subheader", font },
    {
      table: {
        headerRows: 1,
        widths: ["*", "auto", "auto", "auto", "auto", "auto", "auto"],
        body: [
          [
            headerCell(t("fullName"), font),
            headerCell(t("age"), font),
            headerCell(t("gender"), font),
            headerCell(t("maritalStatus"), font),
            headerCell(t("educationStatus"), font),
            headerCell(t("jobType"), font),
            headerCell(t("memberType"), font),
          ],
          ...familyMembers.map((m) => [
            pdfCell(m.fullName, font),
            pdfCell(m.age, font),
            pdfCell(translateField(t, m.gender), font),
            pdfCell(translateField(t, m.maritalStatus), font),
            pdfCell(translateField(t, m.educationStatus), font),
            pdfCell(m.jobType ? translateField(t, m.jobType) : "-", font),
            pdfCell(translateField(t, m.memberType), font),
          ]),
        ],
      },
      layout: "lightHorizontalLines",
    },
  ];
}

function getPropertyTable(
  properties: ReportData["properties"],
  t: TranslateFn,
  font: string,
) {
  return {
    table: {
      headerRows: 1,
      widths: ["auto", "*", "auto", "auto", "auto", "auto", "auto", "auto"],
      body: [
        [
          headerCell(t("oppuNumber"), font),
          headerCell(t("ownerName"), font),
          headerCell(t("propertyType"), font),
          headerCell(t("propertyCategory"), font),
          headerCell(t("landSize"), font),
          headerCell(t("ownership"), font),
          headerCell(t("agriculturalUse"), font),
          headerCell(t("phone"), font),
        ],
        ...properties.map((p) => [
          pdfCell(p.oppuNumber, font),
          pdfCell(p.ownerName, font),
          pdfCell(translateField(t, p.propertyType), font),
          pdfCell(
            p.propertyCategory === "living" ? t("living") : t("additional"),
            font,
          ),
          pdfCell(p.landSize, font),
          pdfCell(translateField(t, p.ownership), font),
          pdfCell(
            p.agriculturalUse ? translateField(t, p.agriculturalUse) : "-",
            font,
          ),
          pdfCell(p.ownerPhone, font),
        ]),
      ],
    },
    layout: "lightHorizontalLines",
  };
}

function getVehicleTable(
  vehicles: ReportData["vehicles"],
  t: TranslateFn,
  font: string,
) {
  return {
    table: {
      headerRows: 1,
      widths: ["auto", "*", "auto", "auto", "auto", "auto"],
      body: [
        [
          headerCell(t("vehicleNumber"), font),
          headerCell(t("ownerName"), font),
          headerCell(t("ownerAddress"), font),
          headerCell(t("vehicleType"), font),
          headerCell(t("registrationYear"), font),
          headerCell(t("phone"), font),
        ],
        ...vehicles.map((v) => [
          pdfCell(v.vehicleNumber, font),
          pdfCell(v.ownerName, font),
          pdfCell(v.ownerAddress, font),
          pdfCell(translateField(t, v.vehicleType), font),
          pdfCell(v.registrationYear, font),
          pdfCell(v.ownerPhone, font),
        ]),
      ],
    },
    layout: "lightHorizontalLines",
  };
}

function getAswasumaTable(data: ReportData, t: TranslateFn, font: string) {
  const rows = buildAswasumaReportRows(data);

  return {
    table: {
      headerRows: 1,
      widths: ["auto", "auto", "*", "auto", "*", "auto", "auto"],
      body: [
        [
          headerCell(t("houseNumber"), font),
          headerCell(t("division"), font),
          headerCell(t("address"), font),
          headerCell(t("telephone"), font),
          headerCell(t("fullName"), font),
          headerCell(t("nicNumber"), font),
          headerCell(t("age"), font),
        ],
        ...rows.map((row) => [
          pdfCell(row.houseNumber, font),
          pdfCell(row.division, font),
          pdfCell(row.address, font),
          pdfCell(row.telephone, font),
          pdfCell(row.receiverName, font),
          pdfCell(row.receiverNic, font),
          pdfCell(row.receiverAge, font),
        ]),
      ],
    },
    layout: "lightHorizontalLines",
  };
}
