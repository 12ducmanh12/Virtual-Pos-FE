import Authentication from "./page/authentication/authentication";
import ListBills from "./page/list-bills/list-bills";
import DetailBill from "./page/detail-bill/detail-bill";
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
    key: "Detail Bill",
    title: "Detail bill",
    route: "/bill/:billId",
    component: <DetailBill />,
    isProtected: true,
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
