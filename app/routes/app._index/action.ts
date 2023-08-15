import type { ActionArgs } from "@remix-run/node";
import { requireUser } from "~/utils/sessions.server";

export async function loader({ request }: ActionArgs) {
    const user = await requireUser(request);
    const params = new URL(request.url).searchParams;
    
}

async function createUpload(request: Request) {
    
}