import Authentication from "./page/authentication/authentication";
import ListBills from "./page/list-bills/list-bills";
import CreateBill from "./page/create-bill/create-bill";
import CreateMultiBill from "./page/create-multi-bill/create-multi-bill";

const routes = [
  {
    key: "Authentication",
    title: "Authentication",
    route: "/login",
    component: <Authentication />,
  },
  {
    key: "List Bill",
    title: "List bill",
    route: "/",
    component: <ListBills />,
    isProtected: true,
  },
  {
    key: "Create bill",
    title: "Create bill",
    route: "/create-bill",
    component: <CreateBill />,
  },
  {
    key: "Create bill",
    title: "Create bill",
    route: "/create-multi-bill",
    component: <CreateMultiBill />,
    isProtected: true,
  },
];

export default routes;
