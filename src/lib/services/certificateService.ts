import { supabase } from "../supabaseClient";
import {
  CertificateIssuance,
  CertificateIssuanceSchema,
} from "../validationSchemas";

function isMissingCertificatesTable(error: {
  code?: string;
  message?: string;
}): boolean {
  const message = error.message ?? "";
  return (
    error.code === "PGRST205" ||
    message.includes("Could not find the table") ||
    message.includes("certificate_issuances")
  );
}

const MIGRATION_HINT =
  "Run migration-certificate-issuances.sql in the Supabase SQL Editor.";

export async function getCertificateIssuances(): Promise<CertificateIssuance[]> {
  const { data, error } = await supabase
    .from("certificate_issuances")
    .select("*")
    .order("issueDate", { ascending: false });

  if (error) {
    if (isMissingCertificatesTable(error)) {
      console.warn(`certificate_issuances table missing. ${MIGRATION_HINT}`);
      return [];
    }
    throw new Error(`Failed to fetch certificates: ${error.message}`);
  }

  return data || [];
}

export async function createCertificateIssuance(
  record: Omit<CertificateIssuance, "id" | "createdAt" | "updatedAt">,
): Promise<CertificateIssuance> {
  const validated = CertificateIssuanceSchema.parse(record);

  const { data, error } = await supabase
    .from("certificate_issuances")
    .insert([validated])
    .select()
    .single();

  if (error) {
    if (isMissingCertificatesTable(error)) {
      throw new Error(`Certificate table not set up. ${MIGRATION_HINT}`);
    }
    throw new Error(`Failed to create certificate record: ${error.message}`);
  }

  return data;
}

export async function updateCertificateIssuance(
  id: number,
  record: Partial<CertificateIssuance>,
): Promise<CertificateIssuance> {
  const validated = CertificateIssuanceSchema.partial().parse(record);

  const { data, error } = await supabase
    .from("certificate_issuances")
    .update(validated)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (isMissingCertificatesTable(error)) {
      throw new Error(`Certificate table not set up. ${MIGRATION_HINT}`);
    }
    throw new Error(`Failed to update certificate record: ${error.message}`);
  }

  return data;
}

export async function deleteCertificateIssuance(id: number): Promise<void> {
  const { error } = await supabase
    .from("certificate_issuances")
    .delete()
    .eq("id", id);

  if (error) {
    if (isMissingCertificatesTable(error)) {
      throw new Error(`Certificate table not set up. ${MIGRATION_HINT}`);
    }
    throw new Error(`Failed to delete certificate record: ${error.message}`);
  }
}
