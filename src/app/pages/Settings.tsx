import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Globe, Bell, Shield, Database } from "lucide-react";

export function Settings() {
  const { t, i18n } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("settings")}</h1>
        <p className="text-gray-600 mt-1">{t("settingsDescription")}</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">{t("general")}</TabsTrigger>
          <TabsTrigger value="notifications">{t("notifications")}</TabsTrigger>
          <TabsTrigger value="security">{t("security")}</TabsTrigger>
          <TabsTrigger value="data">{t("dataManagement")}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t("languageRegional")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("defaultLanguage")}</Label>
                <Select value={i18n.language} onValueChange={(val) => i18n.changeLanguage(val)}>
                  <SelectTrigger className="w-full md:w-[300px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="si">සිංහල (Sinhala)</SelectItem>
                    <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>{t("dateFormat")}</Label>
                <Select defaultValue="dd/mm/yyyy">
                  <SelectTrigger className="w-full md:w-[300px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("timeZone")}</Label>
                <Select defaultValue="asia-colombo">
                  <SelectTrigger className="w-full md:w-[300px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asia-colombo">Asia/Colombo (GMT+5:30)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("divisionInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("divisionName")}</Label>
                <Input defaultValue="Hambantota" />
              </div>
              <div className="space-y-2">
                <Label>{t("gnDivisionCode")}</Label>
                <Input defaultValue="GN-HMB-001" />
              </div>
              <div className="space-y-2">
                <Label>{t("divisionalSecretariat")}</Label>
                <Input defaultValue="Hambantota District" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t("notificationPreferences")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("emailNotifications")}</p>
                  <p className="text-sm text-gray-600">{t("emailNotificationsDesc")}</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("newRegistrationAlerts")}</p>
                  <p className="text-sm text-gray-600">{t("newRegistrationAlertsDesc")}</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("reportGenComplete")}</p>
                  <p className="text-sm text-gray-600">{t("reportGenCompleteDesc")}</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("systemUpdates")}</p>
                  <p className="text-sm text-gray-600">{t("systemUpdatesDesc")}</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t("securitySettings")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("currentPassword")}</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              
              <div className="space-y-2">
                <Label>{t("newPassword")}</Label>
                <Input type="password" placeholder="••••••••" />
              </div>

              <div className="space-y-2">
                <Label>{t("confirmNewPassword")}</Label>
                <Input type="password" placeholder="••••••••" />
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700">
                {t("updatePassword")}
              </Button>

              <div className="pt-4 border-t mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t("twoFactorAuth")}</p>
                    <p className="text-sm text-gray-600">{t("twoFactorAuthDesc")}</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("sessionTimeout")}</p>
                  <p className="text-sm text-gray-600">{t("sessionTimeoutDesc")}</p>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 mins</SelectItem>
                    <SelectItem value="30">30 mins</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium mb-2">{t("backupData")}</p>
                <p className="text-sm text-gray-600 mb-3">
                  {t("backupDataDesc")}
                </p>
                <Button variant="outline">
                  {t("createBackup")}
                </Button>
              </div>

              <div className="pt-4 border-t">
                <p className="font-medium mb-2">{t("exportData") || "Export Data"}</p>
                <p className="text-sm text-gray-600 mb-3">
                  {t("exportDataDesc")}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline">
                    {t("exportCSV")}
                  </Button>
                  <Button variant="outline">
                    {t("exportExcel")}
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="font-medium mb-2 text-red-600">{t("dangerZone")}</p>
                <p className="text-sm text-gray-600 mb-3">
                  {t("clearAllDataDesc")}
                </p>
                <Button variant="destructive">
                  {t("clearAllData")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3">
        <Button variant="outline">{t("cancel")}</Button>
        <Button className="bg-blue-600 hover:bg-blue-700">{t("saveChanges")}</Button>
      </div>
    </div>
  );
}