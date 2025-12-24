
import { DatabaseStatusBadge } from "@/components/DatabaseStatusBadge";
import Link from "next/link";


            export default function Home() {
              return (
                <div className="min-h-[90vh] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                  <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-[5vh]">
                    <header className="mb-6">
                      <h1 className="text-4xl font-bold">TeacherReview</h1>
                      <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
                        A lightweight review system for courses and instructors. Built with Next.js, React,
                        and MongoDB. Use it to collect, moderate and manage student-submitted reviews.
                      </p>
                    </header>
                    <DatabaseStatusBadge />
                    

                  
                   

                    

                  
                    
                  </div>
                </div>
              )
            }
