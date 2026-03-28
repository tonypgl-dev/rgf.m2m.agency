import { PublicNav } from "@/components/shared/public-nav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicNav />
      <main>{children}</main>
    </>
  );
}
