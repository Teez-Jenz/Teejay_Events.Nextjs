"use client";
import Image from "next/image";
import posthog from "posthog-js";

const Explorebtn = () => {
  const handleClick = () => {
    console.log("Button Clicked");
    posthog.capture("explore_events_clicked");
  };

  return (
    <button
      id="explore-btn"
      type="button"
      className="mt-7 mx-auto"
      onClick={handleClick}
    >
      <a href="#events">
        Explore Events
        <Image
          src="/icons/arrow-down.svg"
          alt="arrow-down"
          width={24}
          height={24}
        />
      </a>
    </button>
  );
};

export default Explorebtn;
