import { createRouteConfig } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { rootRouter } from "../App";
import InputBox from "../components/InputBox";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { asyncRegister } from "../states/auth/thunks";

const RegisterPage = () => {
  const isLogin = useAppSelector((state) => !!state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLogin) {
      rootRouter.navigate({ to: "/" });
    }
  }, [isLogin]);

  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onLoginSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    dispatch(asyncRegister({ name, email, password }));
  };

  return (
    <form
      onSubmit={onLoginSubmit}
      className="container absolute top-1/2 left-1/2 mx-auto flex -translate-x-1/2 -translate-y-1/2 flex-col justify-center gap-4 p-4"
    >
      <h1 className="text-2xl font-bold">Register a new account!</h1>
      <InputBox
        type="text"
        placeholder="Name"
        className="border-2 border-blue-500 p-4 text-lg"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <InputBox
        type="email"
        placeholder="Email"
        className="border-2 border-blue-500 p-4 text-lg"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputBox
        type="password"
        placeholder="Password"
        className="border-2 border-blue-500 p-4 text-lg"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="bg-blue-500 p-4 font-bold text-white">
        Register
      </button>
      <rootRouter.Link
        to="/login"
        className="ml-auto text-blue-500 hover:underline"
      >
        Already have an account? login here!
      </rootRouter.Link>
    </form>
  );
};

export const registerRoute = createRouteConfig().createRoute({
  path: "register",
  component: RegisterPage,
});

export default RegisterPage;
