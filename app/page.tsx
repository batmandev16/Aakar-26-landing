"use client";

import { useState } from "react";
import HeroGate from "../components/Herogate";
import EnterScreen from "../components/EnterScreen";


export default function Home() {
  const [entered, setEntered] = useState(false);

  return (
    <>
      {!entered ? (
        <EnterScreen onEnter={() => setEntered(true)} />
      ) : (
        <HeroGate />
      )}
    </>
  );
}