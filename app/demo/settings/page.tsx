'use client';

import {
    Settings as SettingsIcon,
    Bell,
    Lock,
    Eye,
    CheckCircle2
} from "lucide-react";
import { useState } from "react";

export default function DemoSettingsPage() {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: false,
        weeklyReport: true,
        privateProfile: false,
        twoFactorAuth: false,
        emailDigest: "weekly"
    });

    const handleToggle = (key: keyof typeof settings) => {
        if (typeof settings[key] === "boolean") {
            setSettings(prev => ({
                ...prev,
                [key]: !prev[key]
            }));
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSettings(prev => ({
            ...prev,
            emailDigest: e.target.value
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                        <SettingsIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                        Ayarlar
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        Bildirimler, gizlilik ve tercihlerinizi yönetin
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Notification Settings */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Bell className="w-5 h-5 text-blue-600" />
                                Bildirim Ayarları
                            </h2>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">E-posta Bildirimleri</p>
                                    <p className="text-xs text-gray-500 mt-1">Önemli güncellemeleri e-posta alın</p>
                                </div>
                                <button
                                    onClick={() => handleToggle('emailNotifications')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`}
                                    />
                                </button>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Push Bildirimleri</p>
                                        <p className="text-xs text-gray-500 mt-1">Anlık bildirimler alın</p>
                                    </div>
                                    <button
                                        onClick={() => handleToggle('pushNotifications')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.pushNotifications ? 'bg-blue-600' : 'bg-gray-300'}`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'}`}
                                        />
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Haftalık Özet</p>
                                        <p className="text-xs text-gray-500 mt-1">Haftalık etkinlik özeti alın</p>
                                    </div>
                                    <button
                                        onClick={() => handleToggle('weeklyReport')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.weeklyReport ? 'bg-blue-600' : 'bg-gray-300'}`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.weeklyReport ? 'translate-x-6' : 'translate-x-1'}`}
                                        />
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <label className="block text-sm font-medium text-gray-900 mb-2">E-posta Özeti Sıklığı</label>
                                <select
                                    value={settings.emailDigest}
                                    onChange={handleSelectChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                >
                                    <option value="daily">Günlük</option>
                                    <option value="weekly">Haftalık</option>
                                    <option value="monthly">Aylık</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Privacy & Security */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-blue-600" />
                                Gizlilik & Güvenlik
                            </h2>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Özel Profil</p>
                                    <p className="text-xs text-gray-500 mt-1">Profilimi gizli tutun</p>
                                </div>
                                <button
                                    onClick={() => handleToggle('privateProfile')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.privateProfile ? 'bg-blue-600' : 'bg-gray-300'}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.privateProfile ? 'translate-x-6' : 'translate-x-1'}`}
                                    />
                                </button>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">İki Faktörlü Kimlik Doğrulama</p>
                                        <p className="text-xs text-gray-500 mt-1">Hesabınızı ek güvenlikle koruyun</p>
                                    </div>
                                    <button
                                        onClick={() => handleToggle('twoFactorAuth')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-300'}`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'}`}
                                        />
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <button className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors text-sm">
                                    Şifreyi Değiştir
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden lg:col-span-2">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Eye className="w-5 h-5 text-blue-600" />
                                Tercihler
                            </h2>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">Dil</label>
                                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                                        <option>Türkçe</option>
                                        <option>English</option>
                                        <option>Deutsch</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">Tema</label>
                                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                                        <option>Açık</option>
                                        <option>Koyu</option>
                                        <option>Sistem</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 lg:col-span-2">
                        <div className="flex gap-3">
                            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-900">
                                <p className="font-medium mb-1">Ayarlarınızı Yönetin</p>
                                <p>
                                    Yapılan değişiklikler anında kaydedilecektir. Herhangi bir zamanda geri dönüp ayarlarınızı değiştirebilirsiniz.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
