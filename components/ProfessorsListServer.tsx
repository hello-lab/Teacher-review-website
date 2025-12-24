"use client";
import {  getTeachers } from "@/lib/posts";
import { PostItem } from "./PostItem";
import { TeacherListPagination } from "./TeacherListPagination";
import { ProfsItems } from "./ProfsItem";
import  { useState, useRef, useEffect } from "react";
import { set } from "zod";
interface PostListServerProps {
  page?: number;
}

export  function ProfessorsListServer({ page = 1 }: PostListServerProps) {
  
 const [posts,setposts]=useState<any[]>([])
 const [pagination,setpagination]=useState({currentPage:1,totalPages:1,hasNextPage:false,hasPrevPage:false,totalCount:0})
 const [tichers,settichars]= useState<any[]>([])
 const [allteachers,setallteachers]= useState<any[]>([])
 const [teach,setteach]= useState<{ original: string; tokens: string[] }[]>([])
const createRange = (start=0, end:number, step = 1) => {
  const length = (end - start) / step + 1;
  return Array.from({ length }, (_, i) => start + i * step);
};

function levenshtein(s1: string, s2: string): number {
   if (s1 === s2) return 0;
   let rows = s1.length + 1;
    let cols = s2.length + 1;

    let previous_row = createRange(0, cols );
    for (let i = 0; i < s1.length; i++) {
        let current_row = [i + 1];
        for (let j =0;j< s2.length;j++) {
          let insert_cost = previous_row[j + 1] + 1;
          let delete_cost = current_row[j] + 1;
          let replace_cost = previous_row[j] + (s1[i] === s2[j] ? 0 : 1);
          current_row.push(Math.min(insert_cost, delete_cost, replace_cost));
        }
        previous_row = current_row;
    }
    return previous_row[cols - 1];
  }

function search(query: string) {

  const queryTokens = query.toLowerCase().split(" ");
  if (!queryTokens.length) return tichers;
  let scored_results=[];
  for (let i = 0; i < teach.length; i++) {
    const record_tokens = teach[i].tokens;
    let total_score = 0;
    let matches_count=0;
    for (let j = 0; j < queryTokens.length; j++) {
      let best_token_score=0
      for (let k = 0; k < record_tokens.length; k++) {

        if (queryTokens[j] === record_tokens[k]) {
          best_token_score=100
          break
        }
        else if(record_tokens[k].startsWith(queryTokens[j])){
          best_token_score=85
          break
        }
        else {
          if (Math.abs(queryTokens[j].length - record_tokens[k].length) <=2) {
            let dist = levenshtein(queryTokens[j], record_tokens[k]);
            if (dist<=2){
              let score= 80-(dist*20)
              if (score>best_token_score){
                best_token_score=score
              }
            }
          }
        }
    
}
      if (best_token_score>0){
        total_score += best_token_score;
        matches_count += 1;
      }
}
if (matches_count>0){
  let final_score = total_score / queryTokens.length;
  if (final_score>50){
    scored_results.push({original:teach[i].original, score:final_score})
  }
}
}
  scored_results.sort((a,b) => b.score - a.score);
  return scored_results.map(item => item.original);
}
useEffect( () => {
getTeachers(page, 1000).then((data:any) => {
  setallteachers(data.posts)
let teaach: {original:string,tokens:string[]}[] = []
  for (let i = 0; i < data.posts.length; i++) {
    teaach.push({original:(data.posts[i].name),tokens: data.posts[i].name.toLowerCase().split(" ")})
  }
setteach(teaach)
}) 

  getTeachers(page, 50).then((data) => {
    setposts(data.posts)
    settichars(data.posts)
    setpagination(data.pagination)
  })
},[page])

 

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500">
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search teachers..."
            onChange={(e) => {
              if (!e.target.value.length) {
                setposts(tichers)
                return
              }
              const results = search(e.target.value);
              const filteredPosts = allteachers.filter((post: any) => results.includes(post.name));
              setposts(filteredPosts);
            }}
            className="border border-gray-200 bg-white rounded-xl px-3 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
  <div className="text-xs text-tertiary">{posts.length} Teachers found — {allteachers.length} total</div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,_minmax(160px,_1fr))] gap-4">
        {posts?posts.map((post, index) => {
          const globalIndex = (page - 1) * 10 + index + 1;
          return (
            <ProfsItems key={post._id} post={post} globalIndex={globalIndex} />
          );
        }):"Loading..."}
      </div>

      {pagination.totalPages > 1 && (
        <TeacherListPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
        />
      )}
    </div>
  );
}