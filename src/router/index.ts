// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import Login from "../views/Auth/Login.vue";
import Register from "../views/Auth/Register.vue";
import OtpVerification from "../views/Auth/OtpVerification.vue";
import CreateProfile from "../views/Auth/CreateProfile.vue";
import NotFound from "../views/NotFound.vue";
import { isAuthenticated } from "../stores/auth";
import Peak from "../views/Peak.vue";
// import Dashboard from "../views/Dashboard.vue";
import FinishProfile from "../views/FinishProfile.vue";
// import Process from "../views/Process.vue";
// import Pin from "../views/Pin.vue";
// import Pilot from "../views/Pilot.vue";
// import Product from "../views/Product.vue";
// import Prepare from "../views/Prepare.vue";
// import Plan from "../views/Plan.vue";
// import People from "../views/People/People.vue";
import CreateWorkspace from "../views/CreateWorkspace/CreateWorkspace.vue";
import Product from "../views/Product/Product.vue";
import ProfileView from "../views/Profile/ProfileView.vue";
import ManageAccount from "../views/Profile/ManageAccount.vue";
import Home from "../views/Workspaces/Home.vue";
import WorkspaceLayout from "../layout/WorkspaceLayout/WorkspaceLayout.vue";
import LandingPageLayout from "../layout/mainLayout/LandingPageLayout.vue";
import WorkspaceInvite from "../views/Invites/WorkspaceInvite.vue";
const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { requiresAuth: false },
  },
  {
    path: "/otp-verification/:email",
    name: "Otp",
    component: OtpVerification,
    meta: { requiresAuth: false },
  },
  {
    path: "/create-profile",
    name: "create-profile",
    component: CreateProfile,
    meta: { requiresAuth: false },
  },
  {
    path: "/finish-profile",
    name: "finish-profile",
    component: FinishProfile,
    meta: { requiresAuth: false },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/workspace-invite/:token",
    name: "workspaceInvite",
    component: WorkspaceInvite,
    meta: { requiresAuth: false },
  },
  {
    path: "/",
    component: LandingPageLayout,
    children: [
      {
        path: "/",
        name: "Home",
        component: Home,
        meta: { requiresAuth: true },
      },
      {
        path: "/profile",
        name: "profile",
        component: ProfileView,
        meta: { requiresAuth: true },
      },
      {
        path: "/manage-account",
        name: "manage-account",
        component: ManageAccount,
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/",

    children: [
      {
        path: "create-workspace/:id?", // note the '?' makes :id optional
        name: "create-workspace",
        component: CreateWorkspace,
        props: true, // so `id` is passed as a prop if present
      },
    ],
  },
  {
    path: "/workspace",
    component: WorkspaceLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "peak/:id/:job_id", name: "peak", component: Peak },
      // { path: ":id/people/:module_id", name: "people", component: People },
      // { path: ":id/process", name: "process", component: Process },
      // { path: ":id/pin", name: "pin", component: Pin },
      // { path: ":id/pilot", name: "pilot", component: Pilot },
      { path: ":id/:module_id", name: "product", component: Product },
      // { path: ":id/prepare", name: "prepare", component: Prepare },
      // { path: ":id/plan", name: "plan", component: Plan },
      // { path: ":id/more", name: "more", component: Dashboard },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global Navigation Guard
router.beforeEach((to, _, next) => {
  const authRequired = to.meta.requiresAuth;
  const isLoggedIn = isAuthenticated();

  if (authRequired && !isLoggedIn) {
    next("/login");
  } else if (!authRequired && isLoggedIn && to.path === "/login") {
    next("/");
  } else {
    next();
  }
});

export default router;
