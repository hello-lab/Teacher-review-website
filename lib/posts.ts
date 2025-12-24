"use server";

import { unstable_cache } from "next/cache";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { Post, PostsResponse } from "@/lib/schemas";

async function fetchPostsFromDB(page: number = 1, limit: number = 10): Promise<PostsResponse> {
  const skip = (page - 1) * limit;

  const db = await getDatabase();
  const postsCollection = db.collection("posts");

  // Get total count for pagination
  const totalCount = await postsCollection.countDocuments({});
  const totalPages = Math.ceil(totalCount / limit);

  const posts = await postsCollection
    .find({})
    .sort({ points: -1, submittedAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  // Convert ObjectId to string for JSON serialization
  const postsForResponse = posts.map((post) => ({
    ...post,
    _id: post._id.toString(),
    votes: post.votes || []
  })) as Post[];

  return {
    posts: postsForResponse,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    }
  };
}

async function fetchReviewId(id: string): Promise<PostsResponse> {

  const db = await getDatabase();
  const postsCollection = db.collection("review");

  // Get total count for pagination
  const totalCount = 0;
  const totalPages = 0;
  // If the provided id is not a valid ObjectId, return an empty response to avoid driver type errors.
  if (!ObjectId.isValid(id)) {
    return {
      posts: [],
      pagination: {
        currentPage: 0,
        totalPages: 0,
        totalCount: 0,
        hasNextPage: false,
        hasPrevPage: false,
      }
    };
  }

  const posts = await postsCollection
    .find({  })
    .sort({ submittedAt: -1 })
    .toArray();
console.log("ghj"+JSON.stringify(posts))
  // Convert ObjectId to string for JSON serialization
  const postsForResponse = posts.filter(post => post.id === id)
  return {
    posts: postsForResponse,
    pagination: {
      currentPage: 0,
      totalPages,
      totalCount,
      hasNextPage: 0 < totalPages,
      hasPrevPage: 0 > 1,
    }
  };
}
async function fetchFlag(): Promise<any> {

  const db = await getDatabase();
  const postsCollection = db.collection("flaggedReviews");



  const posts = await postsCollection
    .find({  })
    .sort({ submittedAt: -1 })
    .toArray();
  // Convert ObjectId to string for JSON serialization
  return {
    posts: posts,
   
  };
}

async function fetchTeachersFromDB(page: number = 1, limit: number = 10): Promise<PostsResponse> {
  const skip = (page - 1) * limit;

  const db = await getDatabase();
  const postsCollection = db.collection("teachers");

  // Get total count for pagination
  const totalCount = await postsCollection.countDocuments({});
  const totalPages = Math.ceil(totalCount / limit);

  const posts = await postsCollection
    .find({})
    .sort({ points: -1, submittedAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  // Convert ObjectId to string for JSON serialization
  const postsForResponse = posts.map((post) => ({
    ...post,
    _id: post._id.toString(),
    votes: post.votes || []
  })) as Post[];

  return {
    posts: postsForResponse,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    }
  };
}
// Cache the posts with proper tagging for revalidation
export const getPosts = unstable_cache(
  fetchPostsFromDB,
  ["posts"],
  {
    tags: ["posts"],
    revalidate: 3600, // Fallback revalidation every hour
  }
);
export const fetchReview = unstable_cache(
  fetchReviewId,
  ["review"],
  {
    tags: ["review"],
    revalidate: 3600, // Fallback revalidation every hour
  }
);

export const getTeachers = unstable_cache(
  fetchTeachersFromDB,
  ["teachers"],
  {
    tags: ["teachers"],
    revalidate: 3600, // Fallback revalidation every hour
  }
);

export const fetchfl = unstable_cache(
  fetchFlag,
  ["flaggedReviews"],
  {
    tags: ["flaggedReviews"],
    revalidate: 3600, // Fallback revalidation every hour
  }
);