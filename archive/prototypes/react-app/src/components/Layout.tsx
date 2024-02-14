import { Header } from "@cmsgov/ds-healthcare-gov";
import { Footer } from "@cmsgov/ds-healthcare-gov";

export default function Layout({ children }: {children: React.ReactNode}) {
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
