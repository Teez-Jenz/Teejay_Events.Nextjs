"use client";
import Link from "next/link";
import Image from "next/image";
import posthog from "posthog-js";

const Navbar = () => {
  const handleNavClick = (label: string, destination: string) => {
    posthog.capture("nav_link_clicked", {
      link_label: label,
      link_destination: destination,
    });
  };

  return (
    <header>
      <nav>
        <Link href="/" className="logo" onClick={() => handleNavClick("Logo", "/")}>
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />

          <p>Dev Events</p>
        </Link>

        <ul>
          <Link href="/" onClick={() => handleNavClick("Home", "/")}>Home</Link>
          <Link href="/" onClick={() => handleNavClick("Events", "/")}>Events</Link>
          <Link href="/" onClick={() => handleNavClick("Create", "/")}>Create</Link>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
