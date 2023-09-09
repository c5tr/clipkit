import { LoaderArgs, json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Accordion, AccordionNode } from "~/components/accordion";
import { requireAdmin, requireUser } from "~/utils/sessions.server";
import { getAllUsers } from "~/utils/users.server";

export async function loader({ request }: LoaderArgs) {
    await requireAdmin(request)
    return json(await getAllUsers())
}

export default function AdminUsers() {
    const loaderData = useLoaderData<typeof loader>();

    return (
        <Accordion>
            { loaderData.map((user) => (
                <Link to={"/admin/users/" + user.id + "" } key={user.id}>
                    <AccordionNode title={user.username} />
                </Link>
            ))}
        </Accordion>
    )
}