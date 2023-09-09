import { LoaderArgs, redirect } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import { Divider } from "~/components/divider";
import { requireUser } from "~/utils/sessions.server";

const routes = [
    { title: "Users", to: "/admin/users" },
    { title: "Clips", to: "/admin/clips" }
]

export default function Admin() {
    return (
        <>
            <div className="flex gap-6">
                { routes.map((route) => (
                    <Link key={route.to} to={route.to} className="transition-transform hover:-translate-y-1">
                        <h1>{route.title}</h1>
                    </Link>
                ))}
            </div>
            <Divider />
            <Outlet />
        </>
    )
}