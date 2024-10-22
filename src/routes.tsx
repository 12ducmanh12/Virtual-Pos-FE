import Home from "./page/home";
import CreateBill from "./page/create-bill/create-bill";

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
];

export default routes;
