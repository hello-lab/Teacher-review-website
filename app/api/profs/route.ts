import { getTeachers } from "@/lib/posts";



export async function GET(req: Request) {
    // Receive the id of the challenge in the request body
    const teachers = await getTeachers(1, 1000)

    try {
        return new Response(JSON.stringify({ teachers:teachers.posts }), { status: 200 });
    } catch (error: Error | any) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
}