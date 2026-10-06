import { requireAdmin } from "../guard";
import { storeKind } from "@/lib/content-store";
import { getSiteSettings } from "@/lib/settings-store";
import SettingsForms from "./SettingsForms";
import { AdminPageHeader } from "../ui";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const email = await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <>
      <AdminPageHeader
        title="Settings"
        description="Site details, your password, and database maintenance."
      />
      <SettingsForms
        settings={settings}
        email={email}
        isD1={storeKind === "d1"}
        storeKind={storeKind}
      />
    </>
  );
}