"use client";

import { useState } from "react";
import HeroGate from "../components/Herogate";

export default function Home() {
  const [entered, setEntered] = useState(false);

  return (
    <>
        <HeroGate />
    </>
  );
}