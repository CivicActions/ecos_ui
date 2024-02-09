export default function PageHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="ds-u-margin-y--4">
      <h1 className="ds-text-heading--3xl">{children}</h1>
    </div>
  );
}
