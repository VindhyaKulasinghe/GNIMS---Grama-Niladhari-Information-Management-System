/* eslint-disable */
import { useNavigate } from 'react-router'
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Building2, Globe, ShieldAlert, ArrowLeft } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'

export function Register() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)`,
          }}
        ></div>
      </div>

      {/* Language selector */}
      <div className="absolute top-6 right-6 z-10">
        <Select
          value={i18n.language}
          onValueChange={(val) => i18n.changeLanguage(val)}
        >
          <SelectTrigger className="w-[160px] bg-slate-800/80 border-slate-700 text-white backdrop-blur-sm">
            <Globe className="h-5 w-5 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="si">සිංහල</SelectItem>
            <SelectItem value="ta">தமிழ்</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="w-full max-w-lg shadow-2xl border-slate-700 bg-white relative z-10">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="mx-auto w-20 h-20 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
            <ShieldAlert className="h-10 w-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              {t("registerTitle") || "Account Registration"}
            </CardTitle>
            <p className="text-sm font-medium text-slate-600 mt-1">
              GNIMS - Grama Niladhari Information Management System
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-6 text-center">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-slate-700 space-y-4 shadow-inner">
            <p className="text-base font-semibold leading-relaxed text-slate-800">
              {i18n.language === "si" 
                ? "පද්ධතියට ලියාපදිංචි වීම සඳහා කරුණාකර පද්ධති පරිපාලක (System Administrator) හෝ ඔබගේ ප්‍රාදේශීය ලේකම් කාර්යාලය (Divisional Secretariat Office) අමතන්න." 
                : i18n.language === "ta"
                ? "கணினியில் பதிவு செய்ய கணினி நிர்வாகியை அல்லது உங்கள் பிரதேச செயலக அலுவலகத்தை தொடர்பு கொள்ளவும்."
                : "Please contact the system administrator or your Divisional Secretariat office to register an account in the system."}
            </p>
            <p className="text-xs text-slate-500 italic">
              {i18n.language === "si"
                ? "ආරක්ෂක සහ දත්ත රහස්‍යතා පියවර හේතුවෙන් ස්වයං-ලියාපදිංචිය අක්‍රිය කර ඇත."
                : i18n.language === "ta"
                ? "பாதுகாப்பு மற்றும் தரவு தனியுரிமை காரணங்களுக்காக சுய பதிவு முடக்கப்பட்டுள்ளது."
                : "Self-registration is disabled for data security and privacy measures."}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-left space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2 font-medium text-slate-900 border-b pb-1 mb-2">
                <Building2 className="h-4 w-4 text-slate-700" />
                <span>{t("contactInformation") || "Help & Support"}</span>
              </div>
              <p>📞 {t("districtOffice") || "Hambantota District Secretariat"}: 047-222-0000</p>
              <p>📧 {t("email") || "Email"}: support.gnims@district.gov.lk</p>
              <p>🕐 {t("officeHours") || "Office Hours"}: Weekdays, 8:30 AM - 4:15 PM</p>
            </div>

            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="w-full gap-2 border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t("backToLogin") || "Back to Login"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Register
