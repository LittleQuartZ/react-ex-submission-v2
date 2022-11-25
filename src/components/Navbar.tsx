import { RiLoginCircleLine, RiLogoutCircleLine } from "react-icons/ri";
import { useAppSelector } from "../hooks/redux";

const Navbar = () => {
  const isLogin = useAppSelector(
    (state) => !!state.auth.user || !!state.auth.token
  );

  return (
    <div className="sticky top-0 z-30 flex w-full items-center bg-indigo-300 p-4">
      <nav className="container mx-auto">
        <a className="text-2xl font-bold">Home</a>
      </nav>
      <button className="ml-auto rounded-full">
        {isLogin ? (
          <RiLogoutCircleLine className="text-2xl" />
        ) : (
          <RiLoginCircleLine className="text-2xl" />
        )}
      </button>
    </div>
  );
};

export default Navbar;
