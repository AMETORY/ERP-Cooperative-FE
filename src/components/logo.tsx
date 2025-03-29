import type { FC } from "react";

interface logoProps {
  collapsed: boolean
}

const logo: FC<logoProps> = ({collapsed}) => {
  return (
    <a href="#" className="flex ms-2 md:me-24 gap-2">
      <img
        src="/android-chrome-512x512.png"
        className="h-6 me-3 min-w-6 min-h-6"
        alt="Ametory Logo"
      />
      {!collapsed &&
      <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
        {process.env.REACT_APP_SITE_TITLE}
      </span>
      }
    </a>
  );
};
export default logo;
