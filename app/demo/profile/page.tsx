import { User, Mail, Phone, Calendar, MapPin, CheckCircle2 } from "lucide-react";

export default function DemoProfilePage() {
    const user = {
        name: "Demo Kullanıcı",
        email: "demo@dus360.com",
        phone: "+90 555 123 45 67",
        city: "İstanbul",
        university: "İstanbul Üniversitesi",
        specialty: "Diş Hekimi",
        graduationYear: "2024",
        joinedAt: "1 Ocak 2025",
        accountStatus: "active"
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            registered: { color: "bg-yellow-100 text-yellow-700", text: "Kayıt Tamamlandı" },
            verified: { color: "bg-blue-100 text-blue-700", text: "ÖSYM Doğrulandı" },
            active: { color: "bg-green-100 text-green-700", text: "Aktif Üyelik" },
        };
        return badges[status as keyof typeof badges] || badges.registered;
    };

    const statusBadge = getStatusBadge(user.accountStatus);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                        <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                        Profilim
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">Hesap bilgileriniz ve kişisel ayarlarınız</p>
                </div>

                {/* Main Profile Card */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    {/* Cover Background */}
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

                    {/* Profile Info */}
                    <div className="px-6 sm:px-8 pb-8">
                        {/* Avatar and Edit Button */}
                        <div className="relative flex justify-between items-end -mt-12 mb-8">
                            <div className="w-24 h-24 bg-white rounded-2xl p-1 shadow-lg border border-gray-200">
                                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                                    <User className="w-12 h-12 text-blue-600" />
                                </div>
                            </div>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                                Profili Düzenle
                            </button>
                        </div>

                        {/* Name and Title */}
                        <div className="mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-gray-600 mt-1">{user.specialty}</p>
                        </div>

                        {/* Account Status Badge */}
                        <div className="mb-8">
                            <span className={`inline-block px-4 py-2 rounded-lg text-sm font-medium ${statusBadge.color}`}>
                                {statusBadge.text}
                            </span>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">E-posta</p>
                                        <p className="text-sm font-medium text-gray-900 mt-1">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Telefon</p>
                                        <p className="text-sm font-medium text-gray-900 mt-1">{user.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Şehir</p>
                                        <p className="text-sm font-medium text-gray-900 mt-1">{user.city}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Üniversite</p>
                                        <p className="text-sm font-medium text-gray-900 mt-1">{user.university}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mezuniyet Yılı</p>
                                        <p className="text-sm font-medium text-gray-900 mt-1">{user.graduationYear}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Katılım Tarihi</p>
                                        <p className="text-sm font-medium text-gray-900 mt-1">{user.joinedAt}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
