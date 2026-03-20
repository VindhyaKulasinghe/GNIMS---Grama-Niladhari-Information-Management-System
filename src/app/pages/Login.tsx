import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Globe, Lock, User, Building2, ShieldCheck } from "lucide-react";
import { Language } from "../context/LanguageContext";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError(t("pleaseEnterCredentials"));
      return;
    }

    const success = login(username, password);
    if (success) {
      navigate("/");
    } else {
      setError(t("invalidCredentials"));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)`
        }}></div>
      </div>

      {/* Language selector */}
      <div className="absolute top-6 right-6 z-10">
        <Select value={language} onValueChange={(val) => setLanguage(val as Language)}>
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

      <Card className="w-full max-w-md shadow-2xl border-slate-700 bg-white relative z-10">
        <CardHeader className="space-y-4 text-center pb-6">
          {/* Logo and branding */}
          <div className="mx-auto w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900">GNIMS</CardTitle>
            <p className="text-sm font-medium text-slate-600 mt-1">
              Grama Niladhari Information Management System
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="flex items-center justify-center gap-2 text-slate-700">
              <ShieldCheck className="h-4 w-4" />
              <p className="text-sm font-medium">
                {t("southernProvinceHambantota")}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-700">{t("username")}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-11 border-slate-300 focus:border-slate-800 focus:ring-slate-800"
                  placeholder={t("enterUsername")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">{t("password")}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 border-slate-300 focus:border-slate-800 focus:ring-slate-800"
                  placeholder={t("enterPassword")}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="text-sm text-slate-600 hover:text-slate-900 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full h-11 bg-slate-800 hover:bg-slate-900 text-white">
              {t("login")}
            </Button>
            
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-xs text-slate-600 text-center mb-2">{t("defaultCredentials")}</p>
              <div className="bg-white px-3 py-2 rounded border border-slate-300 text-center">
                <p className="font-mono text-sm text-slate-800">
                  {t("usernameExample")} / {t("passwordExample")}
                </p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Password Recovery</DialogTitle>
            <DialogDescription>
              Please contact your system administrator or the District GN Supervisor to reset your password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h4 className="font-medium text-slate-900 mb-2">Contact Information:</h4>
              <div className="space-y-1 text-sm text-slate-600">
                <p>📞 District Office: 047-222-0000</p>
                <p>📧 Email: gn.hambantota@district.gov.lk</p>
                <p>🕐 Office Hours: Mon-Fri, 8:00 AM - 4:00 PM</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              For security purposes, password resets must be done through official channels only.
            </p>
          </div>
          <Button onClick={() => setForgotPasswordOpen(false)} className="w-full bg-slate-800 hover:bg-slate-900">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}