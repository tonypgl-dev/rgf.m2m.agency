import { BottomNav } from "@/components/shared/bottom-nav";

export default function TouristLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="pb-16">{children}</div>
      <BottomNav role="tourist" />
    </>
  );
}
