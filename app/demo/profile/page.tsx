import { User, Mail, Phone, Calendar, MapPin } from "lucide-react";

export default function DemoProfilePage() {
    const user = {
        name: "Demo Kullanıcı",
        email: "demo@dus360.com",
        phone: "+90 555 123 45 67",
        city: "İstanbul",
        university: "İstanbul Üniversitesi",
        graduationYear: "2024",
        joinedAt: "1 Ocak 2025"
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                        <User className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                        Profilim
                    </h1>
                    <p className="text-gray-600">Hesap bilgileriniz ve kişisel ayarlarınız</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Cover */}
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

                    {/* Profile Info */}
                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="w-24 h-24 bg-white rounded-2xl p-1 shadow-lg">
                                <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center">
                                    <User className="w-10 h-10 text-gray-400" />
                                </div>
                            </div>
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-xl font-semibold transition-colors">
                                Profili Düzenle
                            </button>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-gray-500">Diş Hekimi</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <span>{user.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    <span>{user.city}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="w-5 h-5 flex items-center justify-center">🎓</div>
                                    <span>{user.university}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <span>Mezuniyet: {user.graduationYear}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="w-5 h-5 flex items-center justify-center">📅</div>
                                    <span>Katılım: {user.joinedAt}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
