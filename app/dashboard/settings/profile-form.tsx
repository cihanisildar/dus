"use client";

import { useState } from "react";
import { updateProfile, type UpdateProfileData, type ActionResponse } from "./actions";
import { Save, Loader2 } from "lucide-react";

interface ProfileFormProps {
    initialData: {
        name: string;
        phone: string;
    };
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
    const [formData, setFormData] = useState<UpdateProfileData>(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const response: ActionResponse = await updateProfile(formData);

        setIsLoading(false);
        setMessage({
            type: response.success ? "success" : "error",
            text: response.message,
        });

        // Clear message after 5 seconds
        setTimeout(() => setMessage(null), 5000);
    };

    const hasChanges = formData.name !== initialData.name || formData.phone !== initialData.phone;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
                <div
                    className={`p-4 rounded-lg ${message.type === "success"
                            ? "bg-green-50 border border-green-200 text-green-800"
                            : "bg-red-50 border border-red-200 text-red-800"
                        }`}
                >
                    {message.text}
                </div>
            )}

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Soyad
                </label>
                <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                />
            </div>

            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon
                </label>
                <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="05XX XXX XX XX"
                    required
                />
                <p className="mt-1 text-xs text-gray-500">
                    Örnek: 05551234567 veya +905551234567
                </p>
            </div>

            <button
                type="submit"
                disabled={isLoading || !hasChanges}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isLoading || !hasChanges
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Kaydediliyor...
                    </>
                ) : (
                    <>
                        <Save className="w-4 h-4" />
                        Değişiklikleri Kaydet
                    </>
                )}
            </button>
        </form>
    );
}
