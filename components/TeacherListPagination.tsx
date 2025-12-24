"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PaginationInfo } from "@/lib/schemas";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type TeacherListPaginationProps = Pick<PaginationInfo, 'currentPage' | 'totalPages' | 'hasNextPage' | 'hasPrevPage'>;

export function TeacherListPagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
}: TeacherListPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      if (page === 1) {
        params.delete("page");
      } else {
        params.set("page", page.toString());
      }

      const queryString = params.toString();
      const url = queryString ? `/teachers/?${queryString}` : "/teachers/";
      router.push(url);
    }
  };

  return (
    <div className="flex  justify-center">
      <Pagination>
        <PaginationContent>
          {hasPrevPage && (
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
              />
            </PaginationItem>
          )}

         

          {hasNextPage && (
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage + 1);
                }}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}