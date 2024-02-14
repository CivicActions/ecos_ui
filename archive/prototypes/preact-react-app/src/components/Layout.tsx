import { Header } from "@cmsgov/ds-healthcare-gov/preact";
import { Footer } from "@cmsgov/ds-healthcare-gov/preact";

export default function Layout({ children }: {children: preact.ComponentChildren}) {
  return (
    <div className="page-wrapper">
      <Header hideLanguageSwitch hideLoginLink />
      <main>
        <div className="ds-l-container">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
