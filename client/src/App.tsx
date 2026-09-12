import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const homeRoutes = [
  "/",
  "/index.html",
  "/world",
  "/portfolio",
  "/sound",
  "/contact",
  "/tzsm1987/",
  "/tzsm1987/index.html",
  "/tzsm1987/dashboard.html",
  "/tamer987/",
  "/tamer987/index.html",
  "/tamer987/dashboard.html",
  "/generative-ai-portfolio/",
  "/generative-ai-portfolio/index.html",
  "/generative-ai-portfolio/docs/",
  "/generative-ai-portfolio/docs/index.html",
  "/tamerarena/",
  "/tamerarena/index.html",
  "/tamerarena/docs/",
  "/tamerarena/docs/index.html",
];

function Router() {
  return (
    <Switch>
      {homeRoutes.map((path) => (
        <Route key={path} path={path} component={Home} />
      ))}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
