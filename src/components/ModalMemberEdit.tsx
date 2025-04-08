import { useContext, useEffect, useState, type FC } from "react";
import { CooperativeMemberModel } from "../models/cooperative_member";
import {
  Button,
  Datepicker,
  FileInput,
  Label,
  Modal,
  Textarea,
  TextInput,
} from "flowbite-react";
import { RoleModel } from "../models/role";
import { getRoles, uploadFile } from "../services/api/commonApi";
import Select from "react-select";
import moment from "moment";
import { FileModel } from "../models/file";
import { updateProfile } from "../services/api/authApi";
import toast from "react-hot-toast";
import { LoadingContext } from "../contexts/LoadingContext";
import { updateCooperativeMember } from "../services/api/cooperativeMemberApi";

interface ModalMemberEditProps {
  member: CooperativeMemberModel;
  setMember: (member: CooperativeMemberModel) => void;
  show: boolean;
  onClose: () => void;
}

const ModalMemberEdit: FC<ModalMemberEditProps> = ({
  member,
  setMember,
  show,
  onClose,
}) => {
  const [file, setFile] = useState<FileModel>();
  const [roles, setRoles] = useState<RoleModel[]>([]);
  const { loading, setLoading } = useContext(LoadingContext);

  useEffect(() => {
    getRoles({ page: 1, size: 10, search: "" }).then((res: any) => {
      setRoles(res.data.items);
    });
  }, []);

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Edit Member</Modal.Header>
      <Modal.Body>
        <form className="flex flex-col gap-4">
          {member?.user?.profile_picture && (
            <div className="flex justify-center py-4 items-center">
              <img
                className="w-64 h-64 aspect-square object-cover rounded-full"
                src={member?.user?.profile_picture?.url}
                alt="profile"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Profile Picture</label>
            <FileInput
              accept="image/*"
              id="file-upload"
              onChange={(el) => {
                if (el.target.files) {
                  let f = el.target.files[0];
                  if (!f) return;
                  uploadFile(f, {}, (val) => {
                    console.log(val);
                  }).then((v: any) => {
                    member!.user!.profile_picture = v.data;
                    setFile(v.data);
                    setMember({
                      ...member!,
                    });
                  });
                }
              }}
            />
          </div>

          <div>
            <Label>Full Name</Label>
            <TextInput
              id="full_name"
              type="text"
              placeholder="Full Name"
              value={
                member?.name != "" ? member?.name : member?.user?.full_name
              }
              onChange={(e) => {
                setMember({
                  ...member,
                  name: e.target.value,
                });
              }}
            />
          </div>
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <TextInput
              id="email"
              type="email"
              placeholder="Email"
              readOnly
              value={member?.user?.email}
              onChange={(e) => {}}
            />
          </div>
          <div>
            <Label>Role</Label>
            <Select
              options={roles.map((role) => ({
                value: role.id,
                label: role.name,
              }))}
              value={{
                value: member?.role?.id,
                label: member?.role?.name,
              }}
              onChange={(e) =>
                setMember({
                  ...member,
                  role_id: e?.value!,
                  role: roles.find((role) => role.id === e?.value)!,
                })
              }
            />
          </div>
          <div>
            <Label>Joined At</Label>
            <Datepicker
              id="joined_at"
              value={moment(member?.join_date ?? new Date()).toDate()}
              onChange={(e) => setMember({ ...member, join_date: e! })}
              className="input-white"
            />
          </div>
          <div>
            <Label>Member ID</Label>
            <TextInput
              id="member_id"
              type="text"
              placeholder="Member ID"
              value={member?.member_id_number}
              onChange={(e) =>
                setMember({ ...member, member_id_number: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Phone Number</Label>
            <TextInput
              id="phone_number"
              type="text"
              placeholder="Phone Number"
              value={member?.phone_number}
              onChange={(e) =>
                setMember({ ...member, phone_number: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Address</Label>
            <Textarea
              id="address"
              rows={7}
              placeholder="Address"
              value={member?.address}
              onChange={(e) =>
                setMember({ ...member, address: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Status</Label>
            <Select
            options={[
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Suspended', value: 'SUSPENDED' },
            ]}
            value={{
              value: member?.status,
              label: member?.status,
            }}
            onChange={(e) =>
              setMember({ ...member, status: e!.value })
            }
            />
          </div>

          <div className="h-16"> </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <div className="w-full justify-end flex">
          <Button
            onClick={()  => {
              setLoading(true);
              updateCooperativeMember(member!.id!, member!)
                .catch(toast.error)
                .then(onClose)
                .finally(() => {
                  setLoading(false);
                });
            }}
          >
            Save
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalMemberEdit;
