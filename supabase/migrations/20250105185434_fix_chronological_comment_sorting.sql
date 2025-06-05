
-- Fix chronological comment sorting to show oldest first (proper chronological order)
CREATE OR REPLACE FUNCTION get_sorted_thread_comments(
  p_thread_id UUID,
  p_sort_type TEXT DEFAULT 'chronological'
)
RETURNS TABLE (
  id UUID,
  thread_id UUID,
  author_id UUID,
  content TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  upvotes INTEGER,
  downvotes INTEGER,
  score NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_sort_type = 'best' THEN
    RETURN QUERY
    SELECT 
      tc.id,
      tc.thread_id,
      tc.author_id,
      tc.content,
      tc.created_at,
      tc.updated_at,
      COALESCE(cv.upvotes, 0) as upvotes,
      COALESCE(cv.downvotes, 0) as downvotes,
      COALESCE(cv.upvotes, 0) - COALESCE(cv.downvotes, 0) as score
    FROM thread_comments tc
    LEFT JOIN comment_votes_summary cv ON tc.id = cv.comment_id
    WHERE tc.thread_id = p_thread_id
    ORDER BY (COALESCE(cv.upvotes, 0) - COALESCE(cv.downvotes, 0)) DESC, tc.created_at ASC;
  ELSE
    -- Chronological: oldest first (ASC order)
    RETURN QUERY
    SELECT 
      tc.id,
      tc.thread_id,
      tc.author_id,
      tc.content,
      tc.created_at,
      tc.updated_at,
      COALESCE(cv.upvotes, 0) as upvotes,
      COALESCE(cv.downvotes, 0) as downvotes,
      COALESCE(cv.upvotes, 0) - COALESCE(cv.downvotes, 0) as score
    FROM thread_comments tc
    LEFT JOIN comment_votes_summary cv ON tc.id = cv.comment_id
    WHERE tc.thread_id = p_thread_id
    ORDER BY tc.created_at ASC;
  END IF;
END;
$$;
