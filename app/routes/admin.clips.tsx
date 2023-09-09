import { LoaderArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAllClips } from "~/utils/clips.server";
import { requireAdmin, requireUser } from "~/utils/sessions.server";

export async function loader({ request }: LoaderArgs) {
    await requireAdmin(request)
    return json(await getAllClips())
}

export default function AdminClips() {
    const loaderData = useLoaderData<typeof loader>();

    return (
        <>
            { loaderData.map((clip) => (
                <p key={clip.id}>{clip.title}</p>
            ))}
        </>
    )
}