import Authentication from "./page/authentication/authentication";
import ListBills from "./page/list-bills/list-bills";
import CreateBill from "./page/create-bill/create-bill";
import CreateMultiBill from "./page/create-multi-bill/create-multi-bill";

const routes = [
  {
    key: "Authentication",
    title: "Authentication",
    route: "/",
    component: <Authentication />,
  },
  {
    key: "List Bill",
    title: "List bill",
    route: "/list-bills",
    component: <ListBills />,
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
  },
];

export default routes;
