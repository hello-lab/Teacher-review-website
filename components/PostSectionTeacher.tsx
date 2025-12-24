import { PostSubmissionFormWrapper } from "./PostSubmissionFormWrapper";
import { PostListServer } from "./PostListServer";
import { Suspense } from "react";
import {  PostSubmissionForm1 } from "./PostSubmissionForm";
import { ProfessorsListServer } from "./ProfessorsListServer";

interface PostSectionProps {
  currentPage: number;
}

export function PostSectionTeacher({ currentPage }: PostSectionProps) {
  return (
    <>
      <div className="mt-8">
        <Suspense fallback={
          <div className="text-center py-8 text-tertiary">
            Loading posts...
          </div>
        }>
          <ProfessorsListServer page={currentPage} />
        </Suspense>
      </div>
    </>
  );
}