import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

type PdfMakeInstance = typeof pdfMake & {
  virtualfs: {
    existsSync: (filename: string) => boolean;
    writeFileSync: (
      filename: string,
      content: string,
      encoding?: string,
    ) => void;
  };
  addFonts: (fonts: Record<string, Record<string, string>>) => void;
};

const pdf = pdfMake as PdfMakeInstance;

let robotoInitialized = false;
const loadedFontSets = new Set<string>();

function initializeRobotoFonts() {
  if (robotoInitialized) {
    return;
  }

  for (const [fileName, base64] of Object.entries(
    pdfFonts as unknown as Record<string, string>,
  )) {
    if (!pdf.virtualfs.existsSync(fileName)) {
      pdf.virtualfs.writeFileSync(fileName, base64, "base64");
    }
  }

  pdf.addFonts({
    Roboto: {
      normal: "Roboto-Regular.ttf",
      bold: "Roboto-Medium.ttf",
      italics: "Roboto-Italic.ttf",
      bolditalics: "Roboto-MediumItalic.ttf",
    },
  });

  robotoInitialized = true;
}

async function arrayBufferToBase64(buffer: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

async function loadFontIntoVirtualFs(publicPath: string, vfsFileName: string) {
  if (pdf.virtualfs.existsSync(vfsFileName)) {
    return;
  }

  const response = await fetch(publicPath);
  if (!response.ok) {
    throw new Error(`Failed to load PDF font: ${publicPath}`);
  }

  const base64 = await arrayBufferToBase64(await response.arrayBuffer());
  pdf.virtualfs.writeFileSync(vfsFileName, base64, "base64");
}

export function getPdfFontFamily(language: string): string {
  const lang = language.toLowerCase();
  if (lang.startsWith("si")) return "NotoSinhala";
  if (lang.startsWith("ta")) return "NotoTamil";
  return "Roboto";
}

/** Load Unicode fonts required for Sinhala/Tamil PDF output. */
export async function setupPdfFonts(language: string): Promise<string> {
  initializeRobotoFonts();

  const fontFamily = getPdfFontFamily(language);

  if (fontFamily === "Roboto" || loadedFontSets.has(fontFamily)) {
    return fontFamily;
  }

  if (fontFamily === "NotoSinhala") {
    await loadFontIntoVirtualFs(
      "/fonts/NotoSansSinhala-Regular.ttf",
      "NotoSansSinhala-Regular.ttf",
    );
    await loadFontIntoVirtualFs(
      "/fonts/NotoSansSinhala-Bold.ttf",
      "NotoSansSinhala-Bold.ttf",
    );
    pdf.addFonts({
      NotoSinhala: {
        normal: "NotoSansSinhala-Regular.ttf",
        bold: "NotoSansSinhala-Bold.ttf",
        italics: "NotoSansSinhala-Regular.ttf",
        bolditalics: "NotoSansSinhala-Bold.ttf",
      },
    });
  }

  if (fontFamily === "NotoTamil") {
    await loadFontIntoVirtualFs(
      "/fonts/NotoSansTamil-Regular.ttf",
      "NotoSansTamil-Regular.ttf",
    );
    await loadFontIntoVirtualFs(
      "/fonts/NotoSansTamil-Bold.ttf",
      "NotoSansTamil-Bold.ttf",
    );
    pdf.addFonts({
      NotoTamil: {
        normal: "NotoSansTamil-Regular.ttf",
        bold: "NotoSansTamil-Bold.ttf",
        italics: "NotoSansTamil-Regular.ttf",
        bolditalics: "NotoSansTamil-Bold.ttf",
      },
    });
  }

  loadedFontSets.add(fontFamily);
  return fontFamily;
}

initializeRobotoFonts();

export { pdfMake };
