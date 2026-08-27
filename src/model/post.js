import { db } from "../database.js";

export function mapRowToPost(dbRow) {
  return {
    id: dbRow.id,
    title: dbRow.title,
    content: dbRow.content,
    published_at: dbRow.published_at?.toISOString() || null,
    created_at: dbRow.created_at?.toISOString() || null,
    approved_at: dbRow.approved_at?.toISOString() || null,
    rejected_at: dbRow.rejected_at?.toISOString() || null,
  };
}

export async function fetchPost() {
  const { rows } = await db.query(
    "SELECT * FROM post ORDER BY published_at DESC",
  );

  return { posts: rows.map(mapRowToPost) };
}

export async function insertPost(post) {
  const { title, content, published_at, created_at, approved_at, rejected_at } =
    post;

  const { rows } = await db.query(
    `INSERT INTO post (id, title, content, published_at, created_at, approved_at, rejected_at) VALUES ($1, $2, $3, $4, $5 , $6, $7)
          returning *`,
    [id, title, content, published_at, created_at, approved_at, rejected_at],
  );

  return { post: mapRowToPost(rows[0]) };
}
