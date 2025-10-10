import clients from "../assets/icons/client-icon.svg";
import dashboard from "../assets/icons/dashboard-icon.svg";
import producers from "../assets/icons/producer-icon-1.svg";
import products from "../assets/icons/products-icon.svg";
import retour from "../assets/icons/return-icon.svg";
import stylists from "../assets/icons/stylists-icon.svg";
import workers from "../assets/icons/workers-icon.svg";

export const navbarItems = [
  {
    id: 1,
    text: "dashboard",
    link: "/",
    icon: dashboard,
  },
  {
    id: 2,
    text: "products",
    link: "/products",
    icon: products,
  },
  {
    id: 3,
    text: "stylists",
    link: "/stylists",
    icon: stylists,
  },
  {
    id: 4,
    text: "faconniers",
    link: "/producers",
    icon: producers,
  },
  {
    id: 5,
    text: "clients",
    link: "/clients",
    icon: clients,
  },
  {
    id: 6,
    text: "Retours",
    link: "/stock-return",
    icon: retour,
  },
  {
    id: 7,
    text: "Employés",
    link: "/workers",
    icon: workers,
  },
];
