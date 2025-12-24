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

export function PostItem({ post, globalIndex }: PostItemProps) {
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

  const handleVote = () => {
    if (isPending) return;

    // Redirect to login if user is not authenticated
    if (!session?.user) {
      router.push("/login");
      return;
    }

    const currentlyVoted = optimisticVote.hasVoted;
    const pointChange = currentlyVoted ? -1 : 1;

    startTransition(async () => {
      addOptimisticVote({
        points: optimisticVote.points + pointChange,
        hasVoted: !currentlyVoted,
      });

      try {
        if (!post._id) return;
        await voteOnPost(post._id);
      } catch (error) {
        console.error("Error voting:", error);
        // The optimistic update will revert automatically if the server action fails
      }
    });
  };

  return (
    <div className="flex gap-4 items-start p-4 rounded-2xl bg-white dark:bg-card shadow transition-shadow hover:shadow-lg">
      <div className="flex flex-col items-center w-12">
        <button
          onClick={handleVote}
          disabled={isPending}
          className={`transition-transform disabled:opacity-50 flex items-center justify-center h-10 w-10 rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
            optimisticVote.hasVoted
              ? "bg-green-50 text-[#00684A] dark:bg-[#002713] dark:text-[#00ED64]"
              : "bg-gray-100 text-tertiary hover:bg-green-50 hover:text-[#00684A] dark:bg-transparent dark:text-tertiary"
          }`}
          aria-label={optimisticVote.hasVoted ? "Remove upvote" : "Upvote"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 76 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
          >
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="currentColor" />
          </svg>
        </button>
        <div className="text-xs text-tertiary mt-2">{optimisticVote.points}</div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate">{post.title}</h3>
  <div className="text-sm text-tertiary mt-1 truncate">{post.submittedByName} · {getTimeAgo(post.submittedAt)}</div>
      </div>
    </div>
  )
}
