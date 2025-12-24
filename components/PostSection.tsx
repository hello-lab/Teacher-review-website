import { PostSubmissionFormWrapper } from "./PostSubmissionFormWrapper";
import { PostListServer } from "./PostListServer";
import { Suspense } from "react";

interface PostSectionProps {
  currentPage: number;
}

export function PostSection({ currentPage }: PostSectionProps) {
  return (
    <>
      <div className="mb-6">
        <div className="bg-white dark:bg-card p-4 rounded-2xl shadow-sm">
          <PostSubmissionFormWrapper />
        </div>
      </div>
      <div className="mt-8">
        <Suspense fallback={
          <div className="text-center py-8 text-tertiary">
              Loading posts...
            </div>
        }>
          <PostListServer page={currentPage} />
        </Suspense>
      </div>
    </>
  );
}