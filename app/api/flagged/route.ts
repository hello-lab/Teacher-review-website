import { submitPost } from "@/lib/actions";
import { fetchfl } from "@/lib/posts";
import { success } from "zod";
 


export async function GET(req: Request) {
    // Receive the id of the challenge from the query string
  

    try {
        const teachers = await fetchfl();
        console.log(teachers);
        return new Response(JSON.stringify( teachers.posts ), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ success: false, error: error?.message ?? String(error) }), { status: 500 });
    }
}

export async function POST(req: Request) {

    try {
        const data = await req.json();
        const formData = new FormData();
      formData.append("teacherId", data.id);
      formData.append("teaching", data.teaching);
      formData.append("leniency", data.leniency);
      formData.append("correction", data.correction);
      formData.append("daQuiz", data.daQuiz);
      formData.append("remarks", data.remarks);
      if(data.pwd == process.env.ADMIN_PWD ){
        const teachers = await submitPost(formData);
        return new Response(JSON.stringify( { success: true } ), { status: 200 });}
        else
                    return new Response(JSON.stringify({ success: false, error: error?.message ?? String(error) }), { status: 500 });

    } catch (error: any) {
        return new Response(JSON.stringify({ success: false, error: error?.message ?? String(error) }), { status: 500 });
    }
}