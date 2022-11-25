import { useState } from "react";
import { RiAddLine } from "react-icons/ri";
import { useAppDispatch } from "../hooks/redux";
import { asyncAddThread } from "../states/threads/thunks";
import InputBox from "./InputBox";

const ThreadForm = () => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const dispatch = useAppDispatch();

  const onThreadSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    dispatch(asyncAddThread({ title, body, category }));
    setTitle("");
    setBody("");
    setCategory("");
  };

  return (
    <form className="flex flex-col" onSubmit={onThreadSubmit}>
      <h1 className="mb-2 text-center text-2xl font-bold">
        Post a new thread!
      </h1>
      <InputBox
        type="text"
        color="indigo"
        className="border-b-1 border-b-gray-300 text-lg font-bold"
        placeholder="insert thread title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <InputBox
        asTextArea
        className="min-h-18 border-t-0 border-b-0"
        placeholder="insert thread body/content"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <InputBox
        type="text"
        color="indigo"
        className="border-t-1 border-t-gray-300 text-sm"
        placeholder="insert thread category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button className="flex justify-center gap-2 bg-indigo-500 py-2 text-white">
        <RiAddLine className="text-2xl" /> Post Thread
      </button>
    </form>
  );
};

export default ThreadForm;
