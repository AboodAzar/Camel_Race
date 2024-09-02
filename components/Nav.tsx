import Image from "next/image";
import SideMenuButton from "./side-menu";
import NavLinks from "./nav-links";
import NavButtons from "./nav-buttons";
import { FaBars } from "react-icons/fa";

const Nav = () => {
  return (
    <nav className="top-0 left-0 right-0 fixed bg-white/70 backdrop-blur-lg py-2">
      <div className="container w-full flex justify-between">
        <SideMenuButton>
          <FaBars size={24} />
        </SideMenuButton>
        <NavButtons />
        <div className="flex items-center gap-5 justify-end">
          <NavLinks />
          <div className="bold text-2xl flex items-center justify-center">
            <Image
              src="/LogoHeader.png"
              height={75}
              width={225}
              alt="Logo Header"
              className="max-sm:w-[180px]"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;