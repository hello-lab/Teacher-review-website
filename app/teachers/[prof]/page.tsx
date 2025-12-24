"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { set } from "zod";
import toast from "react-hot-toast";

type Props = {
    params: {
        prof: string;
    };
};

export default function Page() {
    const [profData, setProfData] = useState<any>(null);
    const [profReviews, setProfReviews] = useState<any[]>([]);
    const [teaching, setTeaching] = useState<number>(0);
    const [leniency, setLeniency] = useState<number>(0);
    const [correction, setCorrection] = useState<number>(0);
    const [daQuiz, setDaQuiz] = useState<number>(0);
    const [remarks, setRemarks] = useState<any[]>([]);
    const [overallRating, setOverallRating] = useState<number>(0);
 const params = useParams<{ prof?: string }>();
 const encoded = decodeURIComponent(params?.prof ?? "");
 const router = useRouter();

 useEffect(() => {
         if (!encoded) return;
         try {
                 const decoded = atob(encoded);
                 const parsed = JSON.parse(decoded);
                 setProfData(parsed);
                 fetch(`/api/profreview?id=${parsed._id}`)
                     .then((res) => res.json())
                     .then((data) => {
                        const posts = Array.isArray(data?.teachers?.posts) ? data.teachers.posts : [];
                        setProfReviews(posts);
                        // compute averages locally to avoid interleaved state updates
                        const sums = posts.reduce(
                            (acc: { teaching: number; leniency: number; correction: number; daQuiz: number }, cur: any) => {
                                acc.teaching += Number(cur.teaching || 0);
                                acc.leniency += Number(cur.leniency || 0);
                                acc.correction += Number(cur.correction || 0);
                                acc.daQuiz += Number(cur.daQuiz || 0);
                                return acc;
                            },
                            { teaching: 0, leniency: 0, correction: 0, daQuiz: 0 }
                        );

                        const count = posts.length || 1;
                        const avgTeaching = sums.teaching / count;
                        const avgLeniency = sums.leniency / count;
                        const avgCorrection = sums.correction / count;
                        const avgDaQuiz = sums.daQuiz / count;

                        setTeaching(avgTeaching);
                        setLeniency(avgLeniency);
                        setCorrection(avgCorrection);
                        setDaQuiz(avgDaQuiz);
                        setOverallRating((avgTeaching + avgLeniency + avgCorrection + avgDaQuiz) / 4);

                        const remarksArr = posts.map((review: any) => [review.remarks, review.submittedByName, review.submittedAt, review._id]);
                        setRemarks(remarksArr);
                     })
                     .catch(() => {
                         // ignore fetch errors for now
                     });
         } catch (e) {
             // ignore parse errors
         }
 }, [encoded]);
    return (
        <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
           {profData ? (
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 bg-card p-6 rounded-2xl shadow-sm">

                <div className="flex flex-col items-center gap-4 md:w-1/3">
                    <img src={profData?.image} alt="Teacher" className="rounded-xl w-full max-w-xs md:max-w-sm object-cover max-h-56" />

                    <div className="text-2xl md:text-4xl font-extrabold text-center">{profData?.name}</div>
                    <button
                        onClick={() => router.push("/review?prof=" + encoded)}
                        className="bg-green-200 text-black px-4 py-2 rounded-lg text-base font-semibold w-full md:w-auto text-center"
                    >
                        Rate
                    </button>
                </div>

                <div className="flex-1 flex flex-col gap-4 md:gap-6">
                    <div>
                        <div className="text-xl md:text-2xl font-bold">Ratings:</div>
                        <div className="mt-2 text-sm md:text-base">
                            <div className="font-medium text-tertiary">Total Number of Ratings: <span className="font-semibold text-primary">{profReviews.length ?? "N/A"}</span></div>
                        </div>
                    </div>

                    <div className="text-lg md:text-xl">Overall Rating: {Number.isFinite((teaching ?? 0) + (leniency ?? 0) + (correction ?? 0) + (daQuiz ?? 0)) ? (((teaching ?? 0) + (leniency ?? 0) + (correction ?? 0) + (daQuiz ?? 0)) / 4).toFixed(1) : "N/A"}/10</div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="text-lg font-bold">Teaching: {teaching}/10</div>
                        <div className="text-lg font-bold">Leniency: {leniency}/10</div>
                        <div className="text-lg font-bold">Correction: {correction}/10</div>
                        <div className="text-lg font-bold">DA/Quiz: {daQuiz}/10</div>
                    </div>

                    <div>
                        <div className="text-xl font-bold mt-4">Remarks</div>
                        <div className="mt-3 space-y-3">
                            {remarks.map((remark) => (
                                <div key={remark[3]} className="bg-card p-3 rounded-lg">
                                    <div className="mb-2">{remark[0]}</div>
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-tertiary">{new Date(remark[2]).toLocaleDateString()}</div>
                                        <button
                                            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm py-1 px-2 rounded"
                                            onClick={async () => {
                                                try {
                                                    const res = await fetch("/api/flag", {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({ id: remark[3] }),
                                                    });
                                                    if (!res.ok) throw new Error("Network response was not ok");
                                                    toast.success("Flag submitted. Thank you.");
                                                } catch {
                                                    toast.error("Failed to submit flag. Please try again.");
                                                }
                                            }}
                                        >
                                            🚩 Report
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
           ) : (
            <div className="text-center text-tertiary py-12">Loading</div>
           )}
        </main>
    );
}