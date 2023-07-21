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
  // {
  //   title: "Controls",
  //   path: "/controls",
  //   icon: <AdjustmentsVerticalIcon className="w-5 h-5" />,
  // },
  // {
  //   title: "Regulators",
  //   path: "/regulators",
  //   icon: <Cog6ToothIcon className="w-5 h-5" />,
  // },
  // {
  //   title: "Orgnanizations",
  //   path: "/organizations",
  //   icon: <HandRaisedIcon className="w-5 h-5" />,
  // },
  // {
  //   title: "Logs",
  //   path: "/logs",
  //   icon: <DocumentTextIcon className="w-5 h-5" />,
  // },
  // {
  //   title: "Onboardings",
  //   path: "/onboardings",
  //   icon: <InboxIcon className="w-5 h-5" />,
  // },
];