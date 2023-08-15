import { cssBundleHref } from "@remix-run/css-bundle";
import type { LoaderArgs, LinksFunction, V2_MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import stylesheet from "~/styles.css";
import { getUser } from "./utils/sessions.server";
import { Header } from "./components/header";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: LoaderArgs) {
  return await getUser(request);
}

export const meta: V2_MetaFunction = () => {
  return [{ title: "clipkit" }];
};

export default function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <Meta />
        <Links />
      </head>
      <body className="mx-auto my-0 flex w-full max-w-3xl flex-col dark:bg-black dark:text-white">
        <Header username={data?.username} />
        <main className="flex flex-col gap-2 px-8 pb-4 pt-2">
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
