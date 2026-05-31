import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  CertificateIssuance,
  useHouseholdData,
} from "../../context/HouseholdDataContext";
import { findHouseholdByRef } from "../../../lib/divisionScope";
import { CERTIFICATE_TYPES, CertificateType, resolveCertificateTypeKey } from "../../../lib/certificateTypes";
import { generateReport } from "../../../lib/reportGenerator";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  FileText,
  Loader2,
  AlertTriangle,
  Check,
  AlertCircle,
} from "lucide-react";

const ALL_TYPES = "all";

export function CertificatesSection() {
  const { t, i18n } = useTranslation();
  const {
    certificateIssuances,
    addCertificateIssuance,
    updateCertificateIssuance,
    deleteCertificateIssuance,
    familyMembers,
    households,
    householdBenefits,
    properties,
    vehicles,
  } = useHouseholdData();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>(ALL_TYPES);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CertificateIssuance | null>(null);
  const [formData, setFormData] = useState<Partial<CertificateIssuance>>({
    issueDate: new Date().toISOString().slice(0, 10),
  });
  const [nicInput, setNicInput] = useState("");
  const [nicValidation, setNicValidation] = useState<
    "idle" | "validating" | "valid" | "invalid"
  >("idle");
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  const filteredRecords = useMemo(() => {
    return certificateIssuances.filter((record) => {
      if (typeFilter !== ALL_TYPES && record.certificateType !== typeFilter) {
        return false;
      }
      if (dateFrom && record.issueDate < dateFrom) return false;
      if (dateTo && record.issueDate > dateTo) return false;

      const q = searchQuery.toLowerCase();
      if (!q) return true;

      return (
        record.recipientName.toLowerCase().includes(q) ||
        (record.recipientNic || "").toLowerCase().includes(q) ||
        (record.houseNumber || "").toLowerCase().includes(q) ||
        (record.referenceNumber || "").toLowerCase().includes(q) ||
        t(resolveCertificateTypeKey(record.certificateType)).toLowerCase().includes(q)
      );
    });
  }, [certificateIssuances, typeFilter, dateFrom, dateTo, searchQuery, t]);

  const resetForm = () => {
    setFormData({ issueDate: new Date().toISOString().slice(0, 10) });
    setNicInput("");
    setNicValidation("idle");
  };

  const handleAdd = () => {
    setEditing(null);
    resetForm();
    setDialogOpen(true);
  };

  const handleEdit = (record: CertificateIssuance) => {
    setEditing(record);
    setFormData(record);
    setNicInput(record.recipientNic || "");
    setNicValidation(record.recipientNic ? "valid" : "idle");
    setDialogOpen(true);
  };

  const handleNicChange = (value: string) => {
    setNicInput(value);
    if (!value.trim()) {
      setNicValidation("idle");
      return;
    }

    setNicValidation("validating");
    window.setTimeout(() => {
      const member = familyMembers.find((m) => m.nicNumber === value.trim());
      if (member) {
        const household = findHouseholdByRef(
          households,
          member.houseNumber,
          member.division,
        );
        setNicValidation("valid");
        setFormData((prev) => ({
          ...prev,
          recipientMemberId: member.id,
          recipientName: member.fullName,
          recipientNic: member.nicNumber,
          recipientAddress: household?.address || prev.recipientAddress,
          houseNumber: member.houseNumber,
          division: member.division,
        }));
      } else {
        setNicValidation("invalid");
        setFormData((prev) => ({
          ...prev,
          recipientMemberId: null,
          recipientNic: value.trim(),
        }));
      }
    }, 500);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        certificateType: (formData.certificateType ||
          CERTIFICATE_TYPES[0]) as CertificateType,
        issueDate:
          formData.issueDate || new Date().toISOString().slice(0, 10),
        houseNumber: formData.houseNumber || null,
        recipientMemberId: formData.recipientMemberId ?? null,
        recipientName: formData.recipientName?.trim() || "",
        recipientNic: formData.recipientNic?.trim() || null,
        recipientAddress: formData.recipientAddress?.trim() || null,
        purpose: formData.purpose?.trim() || null,
        referenceNumber: formData.referenceNumber?.trim() || null,
        division: formData.division || editing?.division || "",
      };

      if (editing) {
        const { division, ...updatePayload } = payload;
        await updateCertificateIssuance(editing.id, updatePayload);
        toast.success(t("certificateUpdated"));
      } else {
        await addCertificateIssuance(
          payload as Omit<CertificateIssuance, "id" | "createdAt" | "updatedAt">,
        );
        toast.success(t("certificateIssued"));
      }
      setDialogOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (toDeleteId === null) return;
    setDeleting(true);
    try {
      await deleteCertificateIssuance(toDeleteId);
      toast.success(t("certificateDeleted"));
      setDeleteDialogOpen(false);
      setToDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleDownloadReport = async () => {
    setGeneratingReport(true);
    try {
      await generateReport(
        "certificates",
        {
          households,
          familyMembers,
          properties,
          vehicles,
          householdBenefits,
          certificateIssuances: filteredRecords,
          certificateFilter: {
            certificateType: typeFilter,
            dateFrom: dateFrom || undefined,
            dateTo: dateTo || undefined,
          },
        },
        i18n.language,
        t,
      );
      toast.success(t("reportGenerated"));
    } catch (error) {
      console.error(error);
      toast.error(t("reportGenerationError"));
    } finally {
      setGeneratingReport(false);
    }
  };

  const formatDate = (value: string) => {
    try {
      return new Date(value).toLocaleDateString(i18n.language);
    } catch {
      return value;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-gray-600">{t("gnCertificatesDescription")}</p>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
          <Button
            variant="outline"
            onClick={handleDownloadReport}
            disabled={generatingReport || filteredRecords.length === 0}
            className="w-full sm:w-auto"
          >
            {generatingReport ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            {t("downloadCertificateReport")}
          </Button>
          <Button
            onClick={handleAdd}
            className="bg-slate-900 hover:bg-slate-800 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("issueCertificate")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t("searchCertificates")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">{t("certificateType")}</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_TYPES}>{t("allCertificateTypes")}</SelectItem>
                  {CERTIFICATE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">{t("dateFrom")}</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">{t("dateTo")}</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <p className="text-sm text-gray-600 pb-2">
                {t("certificateCount", { count: filteredRecords.length })}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("issueDate")}</TableHead>
                <TableHead>{t("certificateType")}</TableHead>
                <TableHead>{t("fullName")}</TableHead>
                <TableHead>{t("nicNumber")}</TableHead>
                <TableHead>{t("houseNumber")}</TableHead>
                <TableHead>{t("referenceNumber")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                    {t("noCertificatesFound")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{formatDate(record.issueDate)}</TableCell>
                    <TableCell className="max-w-[180px]">
                      {t(resolveCertificateTypeKey(record.certificateType))}
                    </TableCell>
                    <TableCell>{record.recipientName}</TableCell>
                    <TableCell>{record.recipientNic || "-"}</TableCell>
                    <TableCell>{record.houseNumber || "-"}</TableCell>
                    <TableCell>{record.referenceNumber || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(record)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setToDeleteId(record.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[calc(100%-1rem)] sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? t("editCertificateRecord") : t("issueCertificate")}
            </DialogTitle>
            <DialogDescription>{t("certificateFormDescription")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("certificateType")}</Label>
                <Select
                  value={formData.certificateType || ""}
                  onValueChange={(val) =>
                    setFormData({
                      ...formData,
                      certificateType: val as CertificateType,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectCertificateType")} />
                  </SelectTrigger>
                  <SelectContent>
                    {CERTIFICATE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {t(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("issueDate")}</Label>
                <Input
                  type="date"
                  value={formData.issueDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, issueDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("nicNumber")}</Label>
              <div className="relative">
                <Input
                  value={nicInput}
                  onChange={(e) => handleNicChange(e.target.value)}
                  placeholder={t("enterNicToAutofill")}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {nicValidation === "validating" && (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  )}
                  {nicValidation === "valid" && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                  {nicValidation === "invalid" && (
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  )}
                </div>
              </div>
              {nicValidation === "invalid" && (
                <p className="text-xs text-amber-600">{t("nicNotInRegistry")}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("fullName")}</Label>
                <Input
                  value={formData.recipientName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, recipientName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>{t("houseNumber")}</Label>
                <Input
                  value={formData.houseNumber || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, houseNumber: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("address")}</Label>
              <Textarea
                value={formData.recipientAddress || ""}
                onChange={(e) =>
                  setFormData({ ...formData, recipientAddress: e.target.value })
                }
                rows={2}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("referenceNumber")}</Label>
                <Input
                  value={formData.referenceNumber || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, referenceNumber: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>{t("purpose")}</Label>
                <Input
                  value={formData.purpose || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, purpose: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {t("confirmDelete")}
            </DialogTitle>
            <DialogDescription>{t("confirmDeleteCertificate")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
