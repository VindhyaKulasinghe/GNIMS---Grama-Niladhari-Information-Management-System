import { useState, FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'
import { Globe, Lock, Mail, Building2, ShieldCheck, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Language } from '../context/LanguageContext'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const { login, error, clearError, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { t, language, setLanguage } = useLanguage()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    clearError()

    if (!email || !password) {
      return
    }

    if (!email.includes('@')) {
      return
    }

    setLoading(true)
    try {
      const success = await login(email, password)
      if (success) {
        const from = location.state?.from?.pathname || '/'
        navigate(from, { replace: true })
      }
    } finally {
      setLoading(false)
    }
  }

  const isSubmitting = loading || authLoading

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
          value={language}
          onValueChange={(val) => setLanguage(val as Language)}
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

      <Card className="w-full max-w-md shadow-2xl border-slate-700 bg-white relative z-10">
        <CardHeader className="space-y-4 text-center pb-6">
          {/* Logo and branding */}
          <div className="mx-auto w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              GNIMS
            </CardTitle>
            <p className="text-sm font-medium text-slate-600 mt-1">
              Grama Niladhari Information Management System
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="flex items-center justify-center gap-2 text-slate-700">
              <ShieldCheck className="h-4 w-4" />
              <p className="text-sm font-medium">
                {t('southernProvinceHambantota')}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Alert */}
            {error && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="pl-10 border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="pl-10 border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                  required
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="text-sm text-slate-600 hover:text-slate-900 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-slate-800 hover:bg-slate-900 text-white font-semibold"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>

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
              <h4 className="font-medium text-slate-900 mb-2">
                Contact Information:
              </h4>
              <div className="space-y-1 text-sm text-slate-600">
                <p>📞 District Office: 047-222-0000</p>
                <p>📧 Email: gn.hambantota@district.gov.lk</p>
                <p>🕐 Office Hours: Mon-Fri, 8:00 AM - 4:00 PM</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              For security purposes, password resets must be done through official
              channels only.
            </p>
          </div>
          <Button
            onClick={() => setForgotPasswordOpen(false)}
            className="w-full bg-slate-800 hover:bg-slate-900"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Login