import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">Personal Profile</h1>
        <p className="text-gray-500">Manage your account information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-none shadow-md overflow-hidden bg-white">
          <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <CardContent className="pt-0 -mt-12 flex flex-col items-center text-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                <User className="h-12 w-12 text-gray-400" />
              </div>
              <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white bg-green-500"></div>
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 capitalize">{user.role}</p>
            <div className="mt-6 w-full pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">12</p>
                <p className="text-xs text-gray-400 uppercase font-semibold">Requests</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">2</p>
                <p className="text-xs text-gray-400 uppercase font-semibold">Purchased</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-none shadow-md bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <User className="h-3 w-3" /> Full Name
                </label>
                <p className="text-gray-900 font-medium">{user.name}</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Mail className="h-3 w-3" /> Email Address
                </label>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Shield className="h-3 w-3" /> Account Role
                </label>
                <p className="text-gray-900 font-medium capitalize">{user.role}</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> Member Since
                </label>
                <p className="text-gray-900 font-medium">April 2026</p>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Security Settings</h3>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex gap-3">
                <div className="bg-amber-100 p-2 rounded-full h-fit">
                  <Shield className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-900">Identity Verified</p>
                  <p className="text-xs text-amber-700 mt-0.5">Your account is fully verified. You can submit buy requests for any vehicle in the dealership.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
