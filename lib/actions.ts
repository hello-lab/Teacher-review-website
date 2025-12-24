"use server";

import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { getDatabase } from "@/lib/mongodb";
import { getAuth } from "@/lib/auth";
import { PostSubmissionSchema, reviewSchema, SubmitPostResult, VoteResult } from "@/lib/schemas";
import { ObjectId } from "mongodb";
import { gemini } from "./gemini";
export async function submitPost(formData: FormData): Promise<SubmitPostResult> {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
      
    }

    const id = formData.get("teacherId")?.toString() ?? "";
    const parseNumber = (v: FormDataEntryValue | null, fallback = 1) => {
      const n = Number(v?.toString());
      return Number.isFinite(n) ? n : fallback;
    };
    const teaching = parseNumber(formData.get("teaching"), 1);
    const leniency = parseNumber(formData.get("leniency"), 1);
    const correction = parseNumber(formData.get("correction"), 1);
    const daQuiz = parseNumber(formData.get("daQuiz"), 1);
    const remarks = formData.get("remarks")?.toString() ?? "";

    const validatedData = reviewSchema.parse({ id, teaching, leniency, correction, daQuiz, remarks });

    const db = await getDatabase();
    const postsCollection = db.collection("review");

    // Check if URL already exists
    const existingPost = await postsCollection.findOne({ submittedById: session.user.id,id: validatedData.id });
    if (existingPost) {
      // remove existing review before inserting the new one
      await postsCollection.deleteOne({ _id: existingPost._id });
    }

    const newPost = {
      id: validatedData.id,
      teaching: validatedData.teaching,
      leniency: validatedData.leniency,
      correction: validatedData.correction,
      daQuiz: validatedData.daQuiz,
      remarks: validatedData.remarks,
      submittedById: session.user.id,
      submittedByName: session.user.name,
      submittedAt: new Date(),
    };

    await postsCollection.insertOne(newPost);
    
    // Revalidate the posts cache
    revalidateTag("review");
    
    return { success: true };
  } catch (error) {
    console.error("Error submitting post:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to submit post");
  }
}


export async function flag(id: string): Promise<SubmitPostResult> {
  console.log("Flagging review with id:", id);
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
      
    }

   
    const db = await getDatabase();
    const db1=await getDatabase();
    const postsCollection = db.collection("review");
    const reviewCollection = db1.collection("flaggedReviews");

    // Check if URL already exists
    const existingPost = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (existingPost) {
      // remove existing review before inserting the new one
      console.log("Review found, checking content with Gemini API",existingPost);
        reviewCollection.insertOne(existingPost);
      gemini(existingPost.remarks).then( async (result) => {
        console.log(result)
        if( (result as any).error ){
          
          throw new Error((result as any).error);
          
        }
        if( (result as any) === true ){
                    

          await postsCollection.deleteOne({ _id: existingPost._id }).then(() => {
            console.log("Review flagged and removed successfully");
            existingPost.remarks = "[FLAGGED REVIEW CONTENT REMOVED]";
            postsCollection.insertOne(existingPost);

          });
           return { success: true };
        }
      }
      );}

     return { success: false };
    
   
  } catch (error) {
    console.error("Error submitting post:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to submit post");
  }
}
export async function submitTeacher(formData: FormData): Promise<SubmitPostResult> {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const url = formData.get("url") as string;

    const validatedData = PostSubmissionSchema.parse({ title, url });

    const db = await getDatabase();
    const postsCollection = db.collection("Teachers");

    // Check if URL already exists
    const existingPost = await postsCollection.findOne({ url: validatedData.url });
    if (existingPost) {
      throw new Error("This URL has already been submitted");
    }

    const newPost = {
      title: validatedData.title,
      url: validatedData.url,
     
    };

    await postsCollection.insertOne(newPost);
    
    // Revalidate the posts cache
    revalidateTag("posts");
    
    return { success: true };
  } catch (error) {
    console.error("Error submitting post:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to submit post");
  }
}
export async function voteOnPost(postId: string): Promise<VoteResult> {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const db = await getDatabase();
    const postsCollection = db.collection("posts");

    const post = await postsCollection.findOne({ 
      _id: new ObjectId(postId) 
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const userId = session.user.id;
    const votes = (post.votes as string[]) || [];
    const hasVoted = votes.includes(userId);

    let newPoints = (post.points as number) || 0;
    let newVotes: string[];

    if (hasVoted) {
      // Remove vote
      newVotes = votes.filter((id) => id !== userId);
      newPoints = Math.max(0, newPoints - 1);
    } else {
      // Add vote
      newVotes = [...votes, userId];
      newPoints = newPoints + 1;
    }

    await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { 
        $set: { 
          points: newPoints,
          votes: newVotes 
        } 
      }
    );

    // Revalidate the posts cache
    revalidateTag("posts");

    return { 
      points: newPoints,
      hasVoted: !hasVoted
    };

  } catch (error) {
    console.error("Error voting on post:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to vote on post");
  }
}