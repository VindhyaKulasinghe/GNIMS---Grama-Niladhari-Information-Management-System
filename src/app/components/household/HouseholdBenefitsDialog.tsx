import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { BENEFIT_TYPES, BenefitType } from "../../../lib/benefitTypes";
import { BenefitSaveInput } from "../../../lib/services/benefitService";
import {
  FamilyMember,
  Household,
  HouseholdBenefit,
} from "../../../lib/validationSchemas";

export type BenefitFormRow = BenefitSaveInput;

interface HouseholdBenefitsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  household: Household | null;
  members: FamilyMember[];
  benefits: HouseholdBenefit[];
  onSave: (
    houseNumber: string,
    division: string,
    rows: BenefitFormRow[],
  ) => Promise<void>;
}

function emptyRows(): BenefitFormRow[] {
  return BENEFIT_TYPES.map((benefitType) => ({
    benefitType,
    isReceiving: false,
    receiverMemberId: null,
    otherNotes: "",
  }));
}

function rowsFromBenefits(benefits: HouseholdBenefit[]): BenefitFormRow[] {
  const defaults = emptyRows();
  return defaults.map((row) => {
    const existing = benefits.find((b) => b.benefitType === row.benefitType);
    if (!existing) return row;
    return {
      benefitType: row.benefitType,
      isReceiving: existing.isReceiving,
      receiverMemberId: existing.receiverMemberId ?? null,
      otherNotes: existing.otherNotes ?? "",
    };
  });
}

export function HouseholdBenefitsDialog({
  open,
  onOpenChange,
  household,
  members,
  benefits,
  onSave,
}: HouseholdBenefitsDialogProps) {
  const { t } = useTranslation();
  const [rows, setRows] = useState<BenefitFormRow[]>(emptyRows());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && household) {
      setRows(rowsFromBenefits(benefits));
    }
  }, [open, household, benefits]);

  const updateRow = (
    benefitType: BenefitType,
    patch: Partial<BenefitFormRow>,
  ) => {
    setRows((current) =>
      current.map((row) =>
        row.benefitType === benefitType ? { ...row, ...patch } : row,
      ),
    );
  };

  const handleSave = async () => {
    if (!household) return;

    const division = household.division;
    if (!division) {
      toast.error(t("divisionRequired"));
      return;
    }

    const aswasuma = rows.find((r) => r.benefitType === "aswasuma");
    if (aswasuma?.isReceiving && !aswasuma.receiverMemberId) {
      toast.error(t("aswasumaReceiverRequired"));
      return;
    }

    if (
      aswasuma?.isReceiving &&
      aswasuma.receiverMemberId &&
      !members.some((m) => m.id === aswasuma.receiverMemberId)
    ) {
      toast.error(t("aswasumaReceiverInvalid"));
      return;
    }

    setSaving(true);
    try {
      await onSave(household.houseNumber, division, rows);
      toast.success(t("sahanadaraSaved"));
      onOpenChange(false);
    } catch {
      toast.error(t("sahanadaraSaveFailed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[calc(100%-1rem)] sm:w-full">
        <DialogHeader>
          <DialogTitle>
            {t("sahanadara")} — {household?.houseNumber}
          </DialogTitle>
          <DialogDescription>{t("sahanadaraDescription")}</DialogDescription>
        </DialogHeader>

        {members.length === 0 ? (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
            {t("sahanadaraNeedsMembers")}
          </p>
        ) : null}

        <div className="space-y-4 py-2">
          {rows.map((row) => (
            <div
              key={row.benefitType}
              className="rounded-lg border p-4 space-y-3 bg-gray-50/80"
            >
              <div className="flex items-center justify-between gap-4">
                <Label className="text-sm font-medium">
                  {t(row.benefitType)}
                </Label>
                <Switch
                  checked={row.isReceiving}
                  onCheckedChange={(checked) =>
                    updateRow(row.benefitType, {
                      isReceiving: checked,
                      receiverMemberId: checked
                        ? row.receiverMemberId
                        : null,
                    })
                  }
                />
              </div>

              {row.isReceiving && row.benefitType === "aswasuma" ? (
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">
                    {t("aswasumaReceiver")}
                  </Label>
                  <Select
                    value={row.receiverMemberId?.toString() || ""}
                    onValueChange={(value) =>
                      updateRow(row.benefitType, {
                        receiverMemberId: parseInt(value, 10),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectMember")} />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem
                          key={member.id}
                          value={member.id.toString()}
                        >
                          {member.fullName} ({member.nicNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              {row.isReceiving && row.benefitType === "other" ? (
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">
                    {t("otherBenefitNotes")}
                  </Label>
                  <Input
                    value={row.otherNotes || ""}
                    onChange={(e) =>
                      updateRow(row.benefitType, {
                        otherNotes: e.target.value,
                      })
                    }
                    placeholder={t("otherBenefitNotesPlaceholder")}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSave} disabled={saving || members.length === 0}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("saving")}
              </>
            ) : (
              t("save")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
