import { useContext, useEffect, useState, type FC } from "react";
import { useTranslation } from "react-i18next";
import { CompanyModel } from "../models/company";
import {
  Button,
  Modal,
  Pagination,
  Table,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import { UserModel } from "../models/user";
import { PaginationResponse } from "../objects/pagination";
import {
  deleteUser,
  getCompanyUsers,
  inviteUser,
  updateUserRole,
} from "../services/api/commonApi";
import { SearchContext } from "../contexts/SearchContext";
import { getPagination } from "../utils/helper";
import { RoleModel } from "../models/role";
import { getRoles } from "../services/api/roleApi";
import Select from "react-select";
import { LoadingContext } from "../contexts/LoadingContext";
import toast from "react-hot-toast";
interface CompanyUserProps {
  setting?: CompanyModel | null;
  setSetting: (setting: CompanyModel) => void;
  onSave: () => void;
}

const CompanyUser: FC<CompanyUserProps> = ({ setting, setSetting, onSave }) => {
  const { loading, setLoading } = useContext(LoadingContext);
  const { search } = useContext(SearchContext);
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [users, setUsers] = useState<UserModel[]>([]);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserModel>();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteFullName, setInviteFullName] = useState("");
  const [inviteRoleId, setInviteRoleId] = useState("");
  const { t } = useTranslation();
  const [roles, setRoles] = useState<RoleModel[]>([]);
  const [isCooperativeMember, setIsCooperativeMember] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      getAllUsers();
      getRoles({ page: 1, size: 10, search }).then((res: any) => {
        setRoles(res.data.items);
      });
    }
  }, [mounted]);
  const getAllUsers = () => {
    getCompanyUsers({ page, size, search }).then((res: any) => {
      setUsers(res.data.items);
      setPagination(getPagination(res.data));
    });
  };
  return (
    <div className="flex flex-col gap-4 overflow-y-auto h-[calc(100vh-160px)] p-2">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl ">{t("users")}</h3>
        <Button
          gradientDuoTone="purpleToBlue"
          pill
          onClick={() => {
            setShowModal(true);
          }}
        >
          + {t("invite_user")}
        </Button>
      </div>
      <Table striped>
        <Table.Head>
          <Table.HeadCell>{t("name")}</Table.HeadCell>
          <Table.HeadCell>{t("email")}</Table.HeadCell>
          <Table.HeadCell>{t("role")}</Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {users.map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell>{user.full_name}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>
                <Select
                  isDisabled={user.role?.is_owner}
                  options={roles
                    .filter((r) => !r.is_owner)
                    .map((role) => ({
                      label: role.name,
                      value: role.id,
                    }))}
                  value={{ label: user.role?.name, value: user.role?.id }}
                  onChange={(e) => {
                    updateUserRole(
                      user.id!,
                      roles.find((r) => r.id === e?.value)
                    );
                    setUsers(
                      users.map((u) => {
                        if (u.id === user.id) {
                          return {
                            ...u,
                            role: roles.find((r) => r.id === e?.value),
                          };
                        }
                        return u;
                      })
                    );
                  }}
                />
              </Table.Cell>
              <Table.Cell>
                {!user?.role?.is_owner && (
                  <a
                    className="font-medium text-red-600 hover:underline dark:text-red-500 ms-2 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      if (
                        window.confirm(
                          `Are you sure you want to delete  ${user.full_name}?`
                        )
                      ) {
                        deleteUser(user!.id!).then(() => {
                          getAllUsers();
                        });
                      }
                    }}
                  >
                    Delete
                  </a>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Pagination
        className="mt-4"
        currentPage={page}
        totalPages={pagination?.total_pages ?? 0}
        onPageChange={(val) => {
          setPage(val);
        }}
        showIcons
      />

      <Modal size="4xl" show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>{t("invite_user")}</Modal.Header>
        <Modal.Body>
          <form className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {t('email')}
              </label>
              <TextInput
                id="email"
                type="email"
                placeholder="Email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-gray-700"
              >
                {t('full_name')}
              </label>
              <TextInput
                id="full_name"
                type="text"
                placeholder="Full Name"
                value={inviteFullName}
                onChange={(e) => {
                  setInviteFullName(e.target.value);
                }}
              />
            </div>
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                {t('role')}
              </label>
              <select
                value={inviteRoleId}
                id="role"
                className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                onChange={(e) => setInviteRoleId(e.target.value)}
              >
                <option value="">Select Role</option>
                {roles.filter((r) => !r.is_owner).map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            {setting?.is_cooperation && (
              <ToggleSwitch
              label={t("cooperative_member")}
                checked={isCooperativeMember}
                onChange={(e) => setIsCooperativeMember(e)}
              />
            )}
          </form>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button
            type="submit"
            color="blue"
            onClick={async () => {
              try {
                if (!inviteFullName || !inviteRoleId) {
                  throw new Error("Please fill in all fields");
                }
                setLoading(true);
                // saveInvite();
                let invitationData = {
                  full_name: inviteFullName,
                  role_id: inviteRoleId,
                  email: inviteEmail,
                  is_cooperative_member: isCooperativeMember,
                };
                await inviteUser(invitationData);
                setShowModal(false);
                toast.success(" Invite sent successfully");
              } catch (error: any) {
                toast.error(error.message);
              } finally {
                setLoading(false);
              }
            }}
          >
            Save
          </Button>
          <Button color="gray" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default CompanyUser;
