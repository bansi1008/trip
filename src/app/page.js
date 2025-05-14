import Link from "next/link";
import Navigation from "./components/Navigation";

export default function Page() {
  return (
    <div>
      hi
      <Navigation />
      <Link href="/cabins">Cabin</Link>
    </div>
  );
}
