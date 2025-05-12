import { useEffect, useRef, useState, type FC } from "react";
import { MerchantModel } from "../models/merchant";
import { UserModel } from "../models/user";
import { getUser, getUsers } from "../services/api/userApi";
import { useTranslation } from "react-i18next";
import { BsImage, BsPlus, BsPlusCircle } from "react-icons/bs";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { RiAddCircleFill } from "react-icons/ri";
import { TbTrash } from "react-icons/tb";
import {
  addUserMerchant,
  deleteMerchantUser,
  getMerchantUsers,
} from "../services/api/merchantApi";
import { PaginationResponse } from "../objects/pagination";
import { getPagination } from "../utils/helper";
import { Card } from "flowbite-react";
import { useParams } from "react-router-dom";
interface MerchantUserProps {
  merchant?: MerchantModel;
}

const MerchantUser: FC<MerchantUserProps> = ({ merchant }) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserModel[]>([]);
  const [search, setSearch] = useState("");
  const timeout = useRef<number | null>(null);
  const timeout2 = useRef<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [searchUsers, setSearchUsers] = useState("");
  const [merchantUsers, setMerchantUsers] = useState<UserModel[]>([]);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const  {merchantId} = useParams();
  useEffect(() => {
    return () => {};
  }, []);

  useEffect(() => {
    if (timeout.current) {
      window.clearTimeout(timeout.current);
    }
    timeout.current = window.setTimeout(() => {
      getAllUser();
    }, 500);
  }, [search]);

  useEffect(() => {
    if (timeout2.current) {
      window.clearTimeout(timeout2.current);
    }
    timeout2.current = window.setTimeout(() => {
      getAllUserMerchants();
    }, 500);
  }, [searchUsers]);
  const getAllUser = () => {
    getUsers({ page: 1, size: 10, search }).then((res: any) => {
      setUsers(res.data.items);
    });
  };

  useEffect(() => {
    if (!merchantId) return;
    getAllUserMerchants();
  }, [merchantId]);

  const getAllUserMerchants = async () => {
    getMerchantUsers(merchantId!, {
      page,
      size,
      search: searchUsers,
    }).then((resp: any) => {
        // console.log(resp.data)
      setMerchantUsers(resp.data.items);
      setPagination(getPagination(resp.data));
    });
  };

  const searchBox = (
    <div className="relative w-full w-full mr-4 focus-within:text-purple-500">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <HiMagnifyingGlass />
      </div>
      <input
        type="text"
        className="w-full py-2 pl-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
  const searchUserBox = (
    <div className="relative w-full w-full mr-4 focus-within:text-purple-500">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <HiMagnifyingGlass />
      </div>
      <input
        type="text"
        className="w-full py-2 pl-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
        placeholder="Search"
        value={searchUsers}
        onChange={(e) => setSearchUsers(e.target.value)}
      />
    </div>
  );
  return (
    <div className="grid grid-cols-4 h-[calc(100vh-280px)] ">
      <div className="col-span-3 h-full overflow-y-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="w-[400px] ">{searchUserBox}</div>
          {selectedUserIds.length > 0 && (
            <button
              className=" py-2 px-2 flex items-center gap-2 text-red-500"
              onClick={() => {
                if (window.confirm(t("confirm_delete", { description: t("user") }))) {
                  // Proceed with deletion logic
                  // Example: Call delete API or update state
                  deleteMerchantUser(merchantId!, {
                    user_ids: selectedUserIds,
                  }).then(() => {
                    getAllUserMerchants();
                    setSelectedUserIds([]);
                  })
                }

              }}
            >
              <TbTrash className="text-red-500" size={20} />
              {t("delete")}
            </button>
          )}
        </div>
        <div className="grid grid-cols-4 gap-4">
          {merchantUsers.map((user) => (
            <div
              key={user.id}
              className="flex-col  py-2 flex  gap-2 items-center cursor-pointer px-2 w-full  justify-between rounded-lg mb-2 last:mb-0 border  h-[240px] hover:bg-[#ffb6b9] "
              style={
                selectedUserIds.includes(user.id!)
                  ? { backgroundColor: "#4c8aed" }
                  : {}
              }
              onClick={() => {
                if (selectedUserIds.includes(user.id!)) {
                  setSelectedUserIds(
                    selectedUserIds.filter((id) => id !== user.id)
                  );
                } else {
                  setSelectedUserIds([...selectedUserIds, user.id!]);
                }
              }}
            >
              <div className="w-full h-[160px] justify-center items-center flex bg-gray-100 rounded-lg">
                {!user.profile_picture ? (
                  <BsImage className="w-12 h-12 rounded-lg" />
                ) : (
                  <img
                    className="w-full h-[160px] object-cover rounded-lg"
                    src={user.profile_picture.url}
                    alt={user.full_name}
                  />
                )}
              </div>
              <div className="flex flex-col w-full">
                <small className="bg-slate-300 px-3 text-[10px] rounded-xl w-fit">
                  {user.role?.name}
                </small>
                <span className="font-bold">{user.full_name}</span>
                <span className="text-sm text-gray-500">{user.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className=" h-full border-l border-l-gray-100 overflow-y-auto px-4 flex flex-col">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-lg mb-2">{t("users")}</h4>
          {selectedIds.length > 0 && (
            <div className="text-sm flex ">
              <button
                className=" py-2 px-2 flex items-center gap-2  text-blue-400"
                onClick={() => {
                  addUserMerchant(merchant?.id!, {
                    user_ids: selectedIds,
                  }).then(() => {
                    setSelectedIds([]);
                    getAllUserMerchants();
                  });
                }}
              >
                <RiAddCircleFill size={20} />
              </button>
            </div>
          )}
        </div>
        {searchBox}
        <div className="mt-4">
          {users.filter((user) => !merchantUsers.map((p) => p.id).includes(user.id!)).map((user) => (
            <div
              className="hover:bg-[#ffb6b9]  py-2 flex  gap-2 items-center cursor-pointer px-2 w-full  justify-between rounded-lg mb-2 last:mb-0"
              style={
                selectedIds.includes(user.id!)
                  ? { backgroundColor: "#4c8aed" }
                  : {}
              }
              key={user.id}
              onClick={() => {
                if (selectedIds.includes(user.id!)) {
                  setSelectedIds(selectedIds.filter((id) => id !== user.id));
                } else {
                  setSelectedIds([...selectedIds, user.id!]);
                }
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-50">
                  {!user.profile_picture?.url ? (
                    <BsImage />
                  ) : (
                    <img
                      className="w-full h-full object-cover  rounded-full"
                      src={user.profile_picture?.url}
                      alt=""
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <small className="bg-slate-300 px-3 text-[10px] rounded-xl w-fit">
                    {user.role?.name}
                  </small>
                  <span className="font-semibold text-lg">{user.full_name}</span>
                  <small>{user.email}</small>
                </div>
              </div>
              <div>
                <BsPlusCircle className="text-blue-400 hover:text-blue-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default MerchantUser;
