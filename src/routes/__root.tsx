import {
  ClientOnly,
  HeadContent,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import appCss from "../styles.css?url";
import Navbar from "@/components/Navbar";

import "@fontsource/dm-sans";
import "@fontsource/dm-sans/800.css";

import { Toaster } from "sonner";
import { useTheme } from "@/hooks/useTheme";

const THEME_INIT_SCRIPT = `
  (function(){try{var stored=window.localStorage.getItem('theme');
  var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';
  var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;
  var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;
  var root=document.documentElement;root.classList.remove('light','dark');
  root.classList.add(resolved);
  if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;
  }catch(e){}})();
`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "The3D's Blog",
      },
      {
        name: "description",
        content: "Blog created by The3D.",
      },
      {
        name: "google-site-verification",
        content: "ab4DR7xw7N4pxI0hFF41ko_Iw81BtYo967wKbsfpAgc",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        href: "/proto_mirage_pfp.jpg",
      },
    ],
  }),
  shellComponent: RootDocument,
});

function ClientToaster() {
  const { theme } = useTheme();

  return (
    <Toaster
      theme={theme}
      className="toaster"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    />
  );
}
function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="dark:text-white dark:bg-main-bg">
        <Navbar />
        {children}
        <ClientOnly>
          <ClientToaster />
        </ClientOnly>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
