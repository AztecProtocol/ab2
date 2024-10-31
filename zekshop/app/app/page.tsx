"use client";

import Image from "next/image";
import Opinion from "./opinion/Opinion";
import Navbar from "./navbar/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Opinion />
    </div>
  );
}
