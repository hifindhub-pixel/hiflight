import type { Metadata } from "next";
import AccountExperience from "@/components/AccountExperience";

export const metadata: Metadata = { title: "Mon compte", description: "Gérez votre profil et vos préférences HiFlight.", robots: { index: false, follow: false } };

export default function AccountPage() { return <AccountExperience />; }
