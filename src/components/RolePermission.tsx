import { useContext, useEffect, useState, type FC } from "react";
import { CompanyModel } from "../models/company";
import { useTranslation } from "react-i18next";
import {
  createRole,
  deleteRole,
  getPermissions,
  getRoles,
  updateRole,
} from "../services/api/roleApi";
import { RoleModel } from "../models/role";
import { PaginationResponse } from "../objects/pagination";
import { SearchContext } from "../contexts/SearchContext";
import {
  Button,
  Checkbox,
  Label,
  Modal,
  Table,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import { groupPermissions } from "../utils/helper";
import { PermissionModel } from "../models/permission";
import { LoadingContext } from "../contexts/LoadingContext";
import toast from "react-hot-toast";
interface RolePermissionProps {
  setting?: CompanyModel | null;
  setSetting: (setting: CompanyModel) => void;
  onSave: () => void;
}

const RolePermission: FC<RolePermissionProps> = ({
  setting,
  setSetting,
  onSave,
}) => {
  const { loading, setLoading } = useContext(LoadingContext);
  const { search } = useContext(SearchContext);
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [roles, setRoles] = useState<RoleModel[]>([]);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const [permissions, setPermissions] = useState<PermissionModel[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleModel>();
  const [groups, setGroups] = useState<any>();
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [newRole, setNewRole] = useState<RoleModel>({
    name: "",
    is_super_admin: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const getAllRoles = () => {
    getRoles({ page, size, search }).then((res: any) => {
      setRoles(res.data.items);
    });
  };

  useEffect(() => {
    if (mounted) {
      getAllRoles();
      getPermissions().then((res: any) => {
        setPermissions(res.data);
        // console.log(groupPermissions(res.data));
      });
    }
  }, [mounted]);

  useEffect(() => {}, [groups]);
  return (
    <div className="flex flex-col gap-4 overflow-y-auto h-[calc(100vh-160px)] p-2">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl ">{t("role_permission")}</h3>
        <Button
          gradientDuoTone="purpleToBlue"
          pill
          onClick={() => {
            setShowModalCreate(true);
            setNewRole({
              name: "",
              is_super_admin: false,
            });
          }}
        >
          + {t("role_permission")}
        </Button>
      </div>
      <Table
        className=" border !rounded-none !shadow-none !drop-shadow-none"
        striped
      >
        <Table.Head>
          <Table.HeadCell style={{ width: "40%" }}>
            {t("role_permission")}
          </Table.HeadCell>
          <Table.HeadCell style={{}}>{t("permission")}</Table.HeadCell>
          <Table.HeadCell style={{}}></Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {roles?.map((item, i) => (
            <Table.Row
              key={i}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white cursor-pointer hover:font-semibold">
                {item.name}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white cursor-pointer hover:font-semibold">
                {(item.permission_names ?? []).length} permissions
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white cursor-pointer hover:font-semibold">
                <a
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                  onClick={() => {
                    setSelectedRole(item);
                    setShowModal(true);
                  }}
                >
                  View
                </a>
                {!item.is_owner && (
                  <a
                    className="font-medium text-red-600 hover:underline dark:text-red-500 ms-2 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      if (
                        window.confirm(
                          `Are you sure you want to delete  ${item.name}?`
                        )
                      ) {
                        deleteRole(item!.id!).then(() => {
                          getAllRoles();
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

      <Modal size="7xl" show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>
          <div>{selectedRole ? selectedRole.name : t("new_role")}</div>
          <small>{selectedRole?.permissions?.length} permissions</small>
        </Modal.Header>
        <Modal.Body>
          {Object.keys(groupPermissions(permissions)).map((group, i) => {
            let groups: any = groupPermissions(permissions);
            let items = groups[group];
            return (
              <div key={i} className="mb-4  bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg">
                  {group
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </h3>
                <div className="flex flex-col gap-2">
                  {Object.keys(items).map((item, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-2 border-b last:border-b-0 border-gray-200 py-2"
                    >
                      <div className="flex justify-between">
                        <h4 className="font-semibold text-sm ">
                          {item
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </h4>
                        {!selectedRole?.is_owner && (
                          <div className="flex gap-2">
                            <small
                              className="text-blue-500 cursor-pointer"
                              onClick={() => {
                                if (selectedRole) {
                                  let selectedPermissions = permissions.filter(
                                    (permission) =>
                                      permission.name.startsWith(
                                        `${group}:${item}:`
                                      )
                                  );

                                  setSelectedRole({
                                    ...selectedRole,
                                    permissions: [
                                      ...(selectedRole?.permissions ?? []),
                                      ...selectedPermissions.filter(
                                        (permission) =>
                                          !(
                                            selectedRole?.permissions ?? []
                                          ).some((p) => p.id === permission.id)
                                      ),
                                    ],
                                  });
                                }
                              }}
                            >
                              {t("select_all")}
                            </small>
                            <small
                              className="text-red-500 cursor-pointer"
                              onClick={() => {
                                if (selectedRole) {
                                  const selectedPermissions =
                                    permissions.filter((permission) =>
                                      permission.name.startsWith(
                                        `${group}:${item}:`
                                      )
                                    );

                                  setSelectedRole({
                                    ...selectedRole,
                                    permissions: (
                                      selectedRole?.permissions ?? []
                                    ).filter(
                                      (permission) =>
                                        !selectedPermissions.some(
                                          (p) => p.id === permission.id
                                        )
                                    ),
                                  });
                                }
                              }}
                            >
                              {t("clear_all")}
                            </small>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {items[item].actions.map(
                          (action: PermissionModel, i: number) => (
                            <div key={i} className="flex gap-2 items-center">
                              <Checkbox
                                id={action.name}
                                readOnly={selectedRole?.is_owner}
                                checked={
                                  selectedRole?.is_owner ||
                                  (selectedRole?.permissions ?? [])
                                    .map((p) => p.name)
                                    .includes(`${group}:${item}:${action.name}`)
                                }
                                onChange={(e) => {
                                  if (selectedRole) {
                                    if (e.target.checked) {
                                      (selectedRole?.permissions ?? []).push({
                                        ...action,
                                        name: `${group}:${item}:${action.name}`,
                                      });
                                    } else {
                                      selectedRole.permissions = (
                                        selectedRole?.permissions ?? []
                                      ).filter(
                                        (p) =>
                                          p.name !==
                                          `${group}:${item}:${action.name}`
                                      );
                                    }
                                    setSelectedRole({ ...selectedRole });
                                  }
                                }}
                              />
                              {action.name
                                .split("_")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ")}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex gap-2 justify-end w-full">
            <Button
              onClick={() => {
                let data = {
                  ...selectedRole,
                  permission_names: (selectedRole?.permissions ?? []).map(
                    (p) => p.name
                  ),
                };


                setLoading(true);
                updateRole(selectedRole!.id!, data)
                  .then(() => {
                    getAllRoles();
                    setShowModal(false);
                  })
                  .catch((err) => {
                    toast.error(`${err}`);
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              }}
            >
              {t("save")}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
      <Modal show={showModalCreate} onClose={() => setShowModalCreate(false)}>
        <Modal.Header>{t("new_role")}</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="name">{t("name")}</Label>
              <TextInput
                id="name"
                value={newRole.name}
                placeholder={t("name")}
                onChange={(e) =>
                  setNewRole({ ...newRole, name: e.target.value })
                }
              />
            </div>
            <ToggleSwitch
              checked={newRole.is_super_admin ?? false}
              onChange={(e) => {
                setNewRole({ ...newRole, is_super_admin: e });
              }}
              label={t("super_admin")}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex gap-2 justify-end w-full">
            <Button
              onClick={() => {
                setLoading(true);
                createRole(newRole)
                  .then(() => {
                    getAllRoles();
                    setShowModalCreate(false);
                  })
                  .catch((err) => {
                    toast.error(`${err}`);
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              }}
            >
              {t("save")}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default RolePermission;
