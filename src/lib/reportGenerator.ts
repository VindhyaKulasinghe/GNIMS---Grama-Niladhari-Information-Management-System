import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { Household, FamilyMember, Property, Vehicle } from "./validationSchemas";

// Set standard pdfmake fonts
const vfs = (pdfFonts as any).pdfMake ? (pdfFonts as any).pdfMake.vfs : (pdfFonts as any).vfs;
(pdfMake as any).vfs = vfs;

export interface ReportData {
  households: Household[];
  familyMembers: FamilyMember[];
  properties: Property[];
  vehicles: Vehicle[];
}

export function generateReport(type: string, data: ReportData, language: string, t: any) {
  const docDefinition: any = {
    content: [],
    defaultStyle: {
      fontSize: 10,
    },
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tableHeader: {
        bold: true,
        fontSize: 11,
        color: 'black',
        fillColor: '#f3f4f6',
      }
    }
  };

  // Add Title
  let title = '';
  switch (type) {
    case "household": title = t("householdReport"); break;
    case "population": title = t("populationStatistics"); break;
    case "property": title = t("propertyReport"); break;
    case "vehicle": title = t("vehicleReport"); break;
  }

  docDefinition.content.push({ text: title, style: 'header', alignment: 'center' });
  docDefinition.content.push({ text: `${t("date")}: ${new Date().toLocaleDateString()}`, margin: [0, 0, 0, 20], alignment: 'right' });

  // Add Content based on type
  try {
    if (type === 'household') {
      docDefinition.content.push(getHouseholdTable(data.households, t));
    } else if (type === 'population') {
      docDefinition.content.push(...getPopulationContent(data.familyMembers, t));
    } else if (type === 'property') {
      docDefinition.content.push(getPropertyTable(data.properties, t));
    } else if (type === 'vehicle') {
      docDefinition.content.push(getVehicleTable(data.vehicles, t));
    }

    (pdfMake as any).createPdf(docDefinition).download(`${type}_report_${language}.pdf`);
  } catch (error) {
    console.error("PDF generation internal error:", error);
    throw error;
  }
}

function getHouseholdTable(households: Household[], t: any) {
  return {
    table: {
      headerRows: 1,
      widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
      body: [
        [
          { text: t("houseNumber"), style: 'tableHeader' },
          { text: t("address"), style: 'tableHeader' },
          { text: t("telephone"), style: 'tableHeader' },
          { text: t("facilities"), style: 'tableHeader' },
          { text: t("roofType"), style: 'tableHeader' },
          { text: t("wallType"), style: 'tableHeader' },
          { text: t("floorType"), style: 'tableHeader' },
          { text: t("animals"), style: 'tableHeader' },
        ],
        ...households.map((h) => [
          h.houseNumber,
          h.address,
          h.telephone,
          `${h.electricity ? t("electricity") : ""} ${h.water ? t("water") : ""} ${h.toilet ? t("toilet") : ""}`.trim(),
          h.roofType,
          h.wallType,
          h.floorType,
          `${h.cow > 0 ? h.cow + " " + t("cow") : ""} ${h.chicken > 0 ? h.chicken + " " + t("chicken") : ""} ${h.goat > 0 ? h.goat + " " + t("goat") : ""}`.trim()
        ])
      ]
    },
    layout: 'lightHorizontalLines'
  };
}

function getPopulationContent(familyMembers: FamilyMember[], t: any) {
  // Gender distribution
  const genderStats = familyMembers.reduce((acc, m) => {
    const key = m.gender;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Age group stats
  const ageGroups = [
    { group: "0-18", count: familyMembers.filter(m => m.age <= 18).length },
    { group: "19-35", count: familyMembers.filter(m => m.age > 18 && m.age <= 35).length },
    { group: "36-60", count: familyMembers.filter(m => m.age > 35 && m.age <= 60).length },
    { group: "60+", count: familyMembers.filter(m => m.age > 60).length }
  ];

  return [
    { text: t("genderDistribution"), style: 'subheader' },
    {
      table: {
        headerRows: 1,
        widths: ['*', 'auto'],
        body: [
          [{ text: t("gender"), style: 'tableHeader' }, { text: t("count"), style: 'tableHeader' }],
          ...Object.entries(genderStats).map(([gender, count]) => [t(gender.toLowerCase()) || gender, count])
        ]
      },
      layout: 'lightHorizontalLines',
      margin: [0, 0, 0, 15]
    },
    { text: t("ageGroups"), style: 'subheader' },
    {
      table: {
        headerRows: 1,
        widths: ['*', 'auto'],
        body: [
          [{ text: t("ageGroup"), style: 'tableHeader' }, { text: t("count"), style: 'tableHeader' }],
          ...ageGroups.map(g => [g.group, g.count])
        ]
      },
      layout: 'lightHorizontalLines',
      margin: [0, 0, 0, 15]
    },
    { text: t("familyMembers"), style: 'subheader' },
    {
      table: {
        headerRows: 1,
        widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
        body: [
          [
            { text: t("fullName"), style: 'tableHeader' },
            { text: t("age"), style: 'tableHeader' },
            { text: t("gender"), style: 'tableHeader' },
            { text: t("maritalStatus"), style: 'tableHeader' },
            { text: t("educationStatus"), style: 'tableHeader' },
            { text: t("jobType"), style: 'tableHeader' },
            { text: t("memberType"), style: 'tableHeader' },
          ],
          ...familyMembers.map((m) => [
            m.fullName,
            m.age,
            t(m.gender.toLowerCase()) || m.gender,
            m.maritalStatus,
            m.educationStatus,
            m.jobType || "-",
            t(m.memberType) || m.memberType
          ])
        ]
      },
      layout: 'lightHorizontalLines'
    }
  ];
}

function getPropertyTable(properties: Property[], t: any) {
  return {
    table: {
      headerRows: 1,
      widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
      body: [
        [
          { text: t("oppuNumber"), style: 'tableHeader' },
          { text: t("ownerName"), style: 'tableHeader' },
          { text: t("propertyType"), style: 'tableHeader' },
          { text: t("propertyCategory"), style: 'tableHeader' },
          { text: t("landSize"), style: 'tableHeader' },
          { text: t("ownership"), style: 'tableHeader' },
          { text: t("agriculturalUse"), style: 'tableHeader' },
          { text: t("phone"), style: 'tableHeader' },
        ],
        ...properties.map((p) => [
          p.oppuNumber,
          p.ownerName,
          p.propertyType,
          p.propertyCategory === "living" ? t("living") : t("additional"),
          p.landSize,
          p.ownership,
          p.agriculturalUse || "-",
          p.ownerPhone
        ])
      ]
    },
    layout: 'lightHorizontalLines'
  };
}

function getVehicleTable(vehicles: Vehicle[], t: any) {
  return {
    table: {
      headerRows: 1,
      widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
      body: [
        [
          { text: t("vehicleNumber"), style: 'tableHeader' },
          { text: t("ownerName"), style: 'tableHeader' },
          { text: t("ownerAddress"), style: 'tableHeader' },
          { text: t("vehicleType"), style: 'tableHeader' },
          { text: t("registrationYear"), style: 'tableHeader' },
          { text: t("phone"), style: 'tableHeader' },
        ],
        ...vehicles.map((v) => [
          v.vehicleNumber,
          v.ownerName,
          v.ownerAddress,
          v.vehicleType,
          v.registrationYear,
          v.ownerPhone
        ])
      ]
    },
    layout: 'lightHorizontalLines'
  };
}

