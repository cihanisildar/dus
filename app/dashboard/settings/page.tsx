import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
    Settings as SettingsIcon,
    User,
    Mail,
    Phone,
    Calendar,
    CheckCircle2,
    Clock
} from "lucide-react";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { periodQueries } from "@/lib/db/queries/periods";
import ProfileForm from "./profile-form";

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
        redirect("/login");
    }

    // Fetch user data from database
    const dbUser = await db.query.users.findFirst({
        where: eq(users.id, authUser.id),
    });

    if (!dbUser) {
        redirect("/login");
    }

    // Get active period
    const activePeriod = await periodQueries.getActive();

    const getStatusBadge = (status: string) => {
        const badges = {
            registered: { color: "bg-yellow-100 text-yellow-700", text: "Kayıt Tamamlandı" },
            verified: { color: "bg-blue-100 text-blue-700", text: "ÖSYM Doğrulandı" },
            active: { color: "bg-green-100 text-green-700", text: "Aktif Üyelik" },
            expired: { color: "bg-gray-100 text-gray-700", text: "Süresi Dolmuş" },
            suspended: { color: "bg-red-100 text-red-700", text: "Askıya Alınmış" },
        };
        return badges[status as keyof typeof badges] || badges.registered;
    };

    const statusBadge = getStatusBadge(dbUser.accountStatus);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 pt-16 md:pt-8">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                        <SettingsIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                        Ayarlar
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        Profil bilgilerinizi ve hesap ayarlarınızı yönetin
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Profile Information */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            Profil Bilgileri
                        </h2>
                        <ProfileForm
                            initialData={{
                                name: dbUser.name,
                                phone: dbUser.phone,
                            }}
                        />
                    </div>

                    {/* Account Information */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            Hesap Bilgileri
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700">E-posta</p>
                                    <p className="text-sm text-gray-900">{authUser.email}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        E-posta adresi değiştirilemez
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700">Hesap Durumu</p>
                                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                                        {statusBadge.text}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700">Üyelik Tarihi</p>
                                    <p className="text-sm text-gray-900">
                                        {new Date(dbUser.createdAt).toLocaleDateString("tr-TR", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>

                            {dbUser.lastLoginAt && (
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-700">Son Giriş</p>
                                        <p className="text-sm text-gray-900">
                                            {new Date(dbUser.lastLoginAt).toLocaleDateString("tr-TR", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {activePeriod && (
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-700">Aktif Dönem</p>
                                        <p className="text-sm text-gray-900">{activePeriod.displayName}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex gap-3">
                            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-900">
                                <p className="font-medium mb-1">Güvenlik</p>
                                <p>
                                    Hesap güvenliğiniz için düzenli olarak şifrenizi değiştirmenizi öneririz.
                                    Şifre değişikliği için e-posta adresinize gönderilen bağlantıyı kullanabilirsiniz.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
