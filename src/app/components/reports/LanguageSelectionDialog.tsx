import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useTranslation } from "react-i18next";

interface LanguageSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  onConfirm: () => void;
}

export function LanguageSelectionDialog({
  open,
  onOpenChange,
  selectedLanguage,
  onLanguageChange,
  onConfirm,
}: LanguageSelectionDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("selectLanguage")}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="language-select">{t("chooseLanguage")}</Label>
          <Select value={selectedLanguage} onValueChange={onLanguageChange}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder={t("selectLanguage")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="si">සිංහල</SelectItem>
              <SelectItem value="ta">தமிழ்</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={onConfirm}>{t("download")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
