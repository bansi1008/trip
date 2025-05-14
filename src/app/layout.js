import Navigation from "./components/Navigation";

export const metadata = {
  title: "Trip",
  description: "Trip to the mountains",
};

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <Navigation />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
