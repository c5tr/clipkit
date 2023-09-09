import { LoaderArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Accordion, AccordionNode } from "~/components/accordion";
import Button from "~/components/button";
import { requireAdmin, requireUser } from "~/utils/sessions.server";
import { getUserById } from "~/utils/users.server";

export async function loader({ request, params }: LoaderArgs) {
    await requireAdmin(request)
    const { id } = params;
    const user = await getUserById(id!, true, true);
    if (!user) {
        throw Error();
    }
    return json(user)
}

export default function AdminUserInfo() {
    const loaderData = useLoaderData<typeof loader>();

    return (
        <>
            <h1>User details: {loaderData.username}</h1>
            <h2>Actions</h2>
            <div className="flex flex-wrap gap-2">
                <Button>Change username</Button>
                <Button>Change password</Button>
                <Button destructive>Delete</Button>
            </div>
            <h2>Clips</h2>
            {loaderData.clips.length > 0 && (<Accordion>
                { loaderData?.clips.map((clip) => (
                    <AccordionNode key={clip.id} title={clip.title}>
                        { clip.slug }
                    </AccordionNode>
                ))}
            </Accordion>)}
        </>
    )
}