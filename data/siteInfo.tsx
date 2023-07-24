import {
  HomeIcon,
  ShieldExclamationIcon,
  CubeTransparentIcon,
  CurrencyBangladeshiIcon,
  HandRaisedIcon,
  AdjustmentsVerticalIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  InboxIcon,
  InboxStackIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/solid";

interface ILinksII {
  title: string;
  path: string;
  icon: JSX.Element;
}

export const links: ILinksII[] = [
  {
    title: "Home",
    path: "/home",
    icon: <HomeIcon className="w-5 h-5" />,
  },
  {
    title: "Domains",
    path: "/domains",
    icon: <CubeTransparentIcon className="w-5 h-5" />,
  },
  {
    title: "Sub Domains",
    path: "/subdomains",
    icon: <CurrencyBangladeshiIcon className="w-5 h-5" />,
  },
  {
    title: "Assesments",
    path: "/assesments",
    icon: <RectangleGroupIcon className="w-5 h-5" />,
  },
];
