import { Button, Label, Modal, Textarea, TextInput, ToggleSwitch } from "flowbite-react";
import type { FC } from "react";
import { ContactModel } from "../models/contact";

interface ModalContactProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  selectedContact?: ContactModel | undefined;
  setSelectedContact: (value: ContactModel | undefined) => void;
  handleCreateContact: () => void;
}

const ModalContact: FC<ModalContactProps> = ({
  showModal,
  setShowModal,
  selectedContact,
  setSelectedContact,
  handleCreateContact

}) => {
  return (
    <Modal show={showModal} onClose={() => setShowModal(false)}>
      <Modal.Header>
        {selectedContact?.id ? "Edit" : "Create"} Contact
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <div>
            <Label htmlFor="contactName" value="Name" />
            <TextInput
              id="contactName"
              name="name"
              placeholder="Name"
              required
              value={selectedContact?.name ?? ""}
              onChange={(e) =>
                setSelectedContact({
                  ...selectedContact!,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="contactEmail" value="Email" />
            <TextInput
              id="contactEmail"
              name="email"
              type="email"
              placeholder="Email"
              value={selectedContact?.email ?? ""}
              onChange={(e) =>
                setSelectedContact({
                  ...selectedContact!,
                  email: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="contactPhone" value="Phone" />
            <TextInput
              id="contactPhone"
              name="phone"
              type="tel"
              placeholder="Phone"
              value={selectedContact?.phone ?? ""}
              onChange={(e) =>
                setSelectedContact({
                  ...selectedContact!,
                  phone: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="contactAddress" value="Address" />
            <Textarea
              id="contactAddress"
              name="address"
              placeholder="Address"
              value={selectedContact?.address ?? ""}
              onChange={(e) =>
                setSelectedContact({
                  ...selectedContact!,
                  address: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="contactPersonPosition" value="Position" />
            <TextInput
              id="contactPersonPosition"
              name="contact_person_position"
              type="text"
              placeholder="Position"
              value={selectedContact?.contact_person_position ?? ""}
              onChange={(e) =>
                setSelectedContact({
                  ...selectedContact!,
                  contact_person_position: e.target.value,
                })
              }
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <ToggleSwitch
              id="is_customer"
              name="is_customer"
              checked={selectedContact?.is_customer ?? false}
              onChange={(e) =>
                setSelectedContact({
                  ...selectedContact!,
                  is_customer: e!,
                })
              }
              label="Customer"
            />
            <div>
              <ToggleSwitch
                id="is_vendor"
                name="is_vendor"
                checked={selectedContact?.is_vendor ?? false}
                onChange={(e) =>
                  setSelectedContact({
                    ...selectedContact!,
                    is_vendor: e!,
                  })
                }
                label="Vendor"
              />
            </div>
            <div>
              <ToggleSwitch
                id="is_supplier"
                name="is_supplier"
                checked={selectedContact?.is_supplier ?? false}
                onChange={(e) =>
                  setSelectedContact({
                    ...selectedContact!,
                    is_supplier: e!,
                  })
                }
                label="Supplier"
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end w-full">
          <Button onClick={handleCreateContact}>
            {selectedContact?.id ? "Edit" : "Create"} Contact
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalContact;
