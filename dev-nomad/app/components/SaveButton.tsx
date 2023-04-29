"use client";

import {
  AiFillHeart,
  AiFillSave,
  AiOutlineHeart,
  AiOutlineSave,
} from "react-icons/ai";
import { SafeUser } from "../types";
import useFavorite from "../hooks/useFavorite";

interface SaveButtonProps {
  listingId: string;
  currentUser?: SafeUser | null;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  listingId,
  currentUser,
}) => {
  const { hasFavorited, toggleFavorite } = useFavorite({
    listingId,
    currentUser,
  });

  return (
    <div
      onClick={toggleFavorite}
      className="relative hover:opacity-80 transition cursor-pointer"
    >
      <AiOutlineSave
        size={28}
        className="fill-white absolute -top-[2px] -right-[2px]"
      />

      <AiFillSave
        size={24}
        className={
          hasFavorited ? "fill-blue-500" : "fill-neutral-300/80"
        }
      />
    </div>
  );
};

export default SaveButton;
