import { useState } from "react";
import { RiChat3Line } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { asyncAddThreadDetailComment } from "../states/threads/thunks";
import Button from "./Button";
import InputBox from "./InputBox";

const CommentForm = () => {
  const [content, setContent] = useState<string>("");
  const isLogin = useAppSelector((state) => !!state.auth.user);
  const dispatch = useAppDispatch();

  const onCommentAdd: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    dispatch(asyncAddThreadDetailComment(content));
    setContent("");
  };

  return (
    <form className="flex items-stretch" onSubmit={onCommentAdd}>
      <InputBox
        disabled={!isLogin}
        type="text"
        className="w-full"
        placeholder={
          isLogin ? "insert a new comment" : "you have to login to comment!"
        }
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button
        disabled={!isLogin}
        className="items-center disabled:border-y-2 disabled:border-r-2 disabled:border-indigo-500"
        type="submit"
      >
        <RiChat3Line className="text-3xl" />
      </Button>
    </form>
  );
};

export default CommentForm;
