import { BottomNav } from "@/components/shared/bottom-nav";

export default function CompanionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="pb-16">{children}</div>
      <BottomNav role="companion" />
    </>
  );
}
