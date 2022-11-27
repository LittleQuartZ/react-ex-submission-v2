import { useEffect, useState } from "react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";

import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { asyncVoteComment } from "../states/threads/thunks";
import { Comment, Vote } from "../utils/api";

const CommentItem = ({ comment }: { comment: Comment }) => {
  const userId = useAppSelector((state) => state.auth.user?.id);
  const dispatch = useAppDispatch();
  const [voted, setVoted] = useState<-1 | 0 | 1>(0);

  useEffect(() => {
    if (userId) {
      comment?.upVotesBy.includes(userId)
        ? setVoted(1)
        : comment?.downVotesBy.includes(userId)
        ? setVoted(-1)
        : setVoted(0);
    }
  }, [comment]);

  const vote = (type: Vote["voteType"]) => {
    if (!userId) {
      alert("You have to login to vote!");
      return;
    }

    if ((voted === 1 && type === 1) || (voted === -1 && type === -1)) {
      setVoted(0);
      dispatch(
        asyncVoteComment({
          type: 0,
          commentId: comment.id,
        })
      );
      return;
    }

    setVoted(type);
    dispatch(
      asyncVoteComment({
        type,
        commentId: comment.id,
      })
    );
  };

  return (
    <article
      key={comment.id}
      className="border-x-2 border-indigo-500 px-4 py-2 last:border-b-2"
    >
      <header className="flex justify-between">
        <h1 className="text-indigo-700">@{comment.owner.name}</h1>
        <h2 className="text-sm text-gray-500">
          {new Date(comment.createdAt).toLocaleString()}
        </h2>
      </header>
      <p>{comment.content}</p>
      <section className="mt-2 flex gap-4">
        <button
          onClick={() => vote(1)}
          className={`flex items-center ${voted === 1 && "text-green-500"}`}
        >
          <RiArrowUpSLine className="text-lg" /> {comment.upVotesBy.length}
        </button>
        <button
          onClick={() => vote(-1)}
          className={`flex items-center ${voted === -1 && "text-red-500"}`}
        >
          <RiArrowDownSLine className="text-lg" /> {comment.downVotesBy.length}
        </button>
      </section>
    </article>
  );
};

export default CommentItem;
