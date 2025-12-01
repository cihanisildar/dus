import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User, Mail, Shield } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const accountStatus = (user as { accountStatus: string })?.accountStatus;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 sm:p-8 lg:p-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Profil</h1>
          <p className="text-gray-600">Hesap bilgilerinizi görüntüleyin</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">{user?.name}</h2>
                <p className="text-blue-100">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500">Ad Soyad</label>
                </div>
                <p className="text-lg text-gray-900">{user?.name}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500">E-posta</label>
                </div>
                <p className="text-lg text-gray-900">{user?.email}</p>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500">Hesap Durumu</label>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                      accountStatus === "active"
                        ? "bg-green-100 text-green-700"
                        : accountStatus === "verified"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {accountStatus === "registered" && "Kayıt Tamamlandı"}
                    {accountStatus === "verified" && "ÖSYM Doğrulandı"}
                    {accountStatus === "active" && "Aktif Üyelik"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
