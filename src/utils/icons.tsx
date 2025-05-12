import React from "react";
import { List } from "lucide-react";
import { IconType } from "../types/bookmark";

export const getIconComponent = (
  iconType: IconType,
  size?: number,
  className?: string
) => {
  size = size || 18;
  const style = { width: size + "px", height: size + "px" };

  switch (iconType) {
    case "globe":
      return (
        <img src="icons/website.png" style={style} className={className} />
      );
    case "discord":
      return (
        <img src="icons/discord.svg" style={style} className={className} />
      );
    case "telegram":
      return (
        <img src="icons/telegram.svg" style={style} className={className} />
      );
    case "x":
      return (
        <img src="icons/twitter.svg" style={style} className={className} />
      );
    case "phantom":
      return (
        <img src="icons/phantom.png" style={style} className={className} />
      );
    case "list":
      return <List size={18} className={className} />;
    case "arrow_down":
      return (
        <img
          src="icons/ep_arrow-up-bold.svg"
          style={style}
          className={className}
        />
      );
    case "buy":
      return <img src="icons/buy.svg" style={style} className={className} />;
    case "lock":
      return (
        <img
          src="icons/bxs_lock-open-alt.svg"
          style={style}
          className={className}
        />
      );
    case "bookmarks":
      return (
        <img
          src="icons/ion_bookmarks.svg"
          style={style}
          className={className}
        />
      );
    case "open-blank":
      return (
        <img
          src="icons/majesticons_open-line.svg"
          style={style}
          className={className}
        />
      );
    case "paper":
      return (
        <img
          src="icons/paper.png"
          style={{ ...style, width: size - 4 + "px" }}
          className={className}
        />
      );
    case "plus":
      return <img src="icons/plus.svg" style={style} className={className} />;
    case "save":
      return <img src="icons/save.svg" style={style} className={className} />;
    case "token-solana":
      return (
        <img
          src="icons/token-branded_phantom.svg"
          style={style}
          className={className}
        />
      );
    case "pen":
      return (
        <img
          src="icons/solar_pen-bold.svg"
          style={style}
          className={className}
        />
      );
    case "delete":
      return (
        <img
          src="icons/material-symbols_delete-outline.svg"
          style={style}
          className={className}
        />
      );
    case "solana":
      return <img src="icons/solana.svg" style={style} className={className} />;
    default:
      return (
        <img src="icons/website.png" style={style} className={className} />
      );
  }
};

export const iconsList: Array<{ type: IconType; component: JSX.Element }> = [
  { type: "globe", component: getIconComponent("globe") },
  { type: "discord", component: getIconComponent("discord") },
  { type: "telegram", component: getIconComponent("telegram") },
  { type: "x", component: getIconComponent("x") },
  { type: "list", component: getIconComponent("list") },
];
