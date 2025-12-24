"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Post, OptimisticVote } from "@/lib/schemas";
import { voteOnPost } from "@/lib/actions";
import { getTimeAgo } from "@/lib/utils";

interface PostItemProps {
  post: Post;
  globalIndex: number;
}

export function ProfsItems({ post, globalIndex }: PostItemProps) {
  const { data: session } = authClient.useSession();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const initialVoteData: OptimisticVote = {
    points: post.points,
    hasVoted: session?.user ? post.votes.includes(session.user.id) : false,
  };

  const [optimisticVote, addOptimisticVote] = useOptimistic(
    initialVoteData,
    (_state, newVote: OptimisticVote) => newVote
  );

 
function base64EncodeUnicode(str: string): string {
  const utf8Bytes = new TextEncoder().encode(str);

  // Convert the Uint8Array to a string of Latin-1 characters
  // where each byte corresponds to a character's code point.
  const latin1String = String.fromCharCode(...utf8Bytes);

  // Finally, encode the Latin-1 string using btoa()
  return btoa(latin1String);
}
  return (

    <a
      href={`/teachers/${base64EncodeUnicode((JSON.stringify(post)))}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="flex flex-col bg-white dark:bg-card p-3 rounded-2xl min-h-[200px] w-full hover:shadow-lg hover:scale-[1.02] transition-transform cursor-pointer">
      {/* Global index */}
      
      
     
      
  <div className="flex flex-col text-center justify-center">
          {post.image && (
            <img
              src={post.image}
              alt={post.name ?? "post image"}
              className="max-h-40 rounded-xl mx-auto"
            />
          )}
&nbsp;
          <h3 className="font-medium text-gray-900 dark:text-white leading-none inline">
            {post.name}
          </h3>
         
        </div>

        
    </div></a>
  );
}
