import { LoaderArgs, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { countClips } from "~/utils/clips.server"
import { requireAdmin } from "~/utils/sessions.server";
import { countUsers } from "~/utils/users.server"

export async function loader({ request }: LoaderArgs) {
    await requireAdmin(request);
    return json({
        stats: {
            users: await countUsers(),
            clips: await countClips(),
        }
    })
}

export default function AdminIndex() {
    const loaderData = useLoaderData<typeof loader>();

    return (
        <>
            <h2>Stats</h2>
            <p>Users: {loaderData.stats.users}</p>
            <p>Clips: {loaderData.stats.clips}</p>
        </>
    )
}