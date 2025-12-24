import { fetchReview } from "@/lib/posts";
 


export async function GET(req: Request) {
    // Receive the id of the challenge from the query string
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
        return new Response(JSON.stringify({ success: false, error: 'Missing id in query string' }), { status: 400 });
    }

    try {
        const teachers = await fetchReview(id);
        console.log(teachers);
        return new Response(JSON.stringify({ teachers }), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ success: false, error: error?.message ?? String(error) }), { status: 500 });
    }
}