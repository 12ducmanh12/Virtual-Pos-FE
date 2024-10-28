import Home from "./page/home";
import CreateBill from "./page/create-bill/create-bill";
import CreateMultiBill from "./page/create-multi-bill/create-multi-bill";

const routes = [
  {
    key: "Home",
    title: "Home",
    route: "/",
    component: <Home />,
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
