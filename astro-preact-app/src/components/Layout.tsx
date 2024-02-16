import { Header, Footer } from "@cmsgov/ds-healthcare-gov/preact";

export default function Layout({
  children,
}: {
  children: preact.ComponentChildren;
}) {
  return (
    <div className="page-wrapper">
      <Header />
      <main id="main-body-content" tabIndex={-1}>
        <div className="ds-l-container ds-content ds-u-margin-top--3 ds-u-margin-bottom--4">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
