import { Header } from "@cmsgov/ds-healthcare-gov/preact";
import { Footer } from "@cmsgov/ds-healthcare-gov/preact";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="page-wrapper">
      <Header hideLanguageSwitch hideLoginLink />
      <main>
        <div className="ds-l-container">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
