import { Button, Label, Modal, Textarea, TextInput } from "flowbite-react";
import { useState, type FC } from "react";
import {
  createWarehouse,
  updateWarehouse,
} from "../services/api/warehouseApi";
import { WarehouseModel } from "../models/warehouse";

interface ModalWarehouseProps {
  warehouse: WarehouseModel;
  setWarehouse: (warehouse: WarehouseModel) => void;
  show: boolean;
  setShow: (show: boolean) => void;
  onCreate: () => void;
}

const ModalWarehouse: FC<ModalWarehouseProps> = ({
  show,
  setShow,
  onCreate,
  warehouse,
  setWarehouse,
}) => {
  const [name, setName] = useState("");
  return (
    <Modal show={show} onClose={() => setShow(false)}>
      <Modal.Header>Create Warehouse</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div className="mb-2 block">
            <Label htmlFor="name" value="Name" />
            <TextInput
              id="name"
              type="text"
              placeholder="Name"
              required={true}
              value={warehouse?.name}
              onChange={(e) =>
                setWarehouse({
                  ...warehouse!,
                  name: e.target.value,
                })
              }
              className="input-white"
            />
          </div>
          <div className="mb-2 block">
            <Label htmlFor="description" value="Description" />
            <Textarea
              id="description"
              placeholder="Description"
              rows={4}
              value={warehouse?.description}
              onChange={(e) =>
                setWarehouse({
                  ...warehouse!,
                  description: e.target.value,
                })
              }
              className="input-white"
              style={{ backgroundColor: "white" }}
            />
          </div>
          <div className="mb-2 block">
            <Label htmlFor="address" value="Address" />
            <Textarea
              id="address"
              placeholder="Address"
              rows={4}
              value={warehouse?.address}
              onChange={(e) =>
                setWarehouse({
                  ...warehouse!,
                  address: e.target.value,
                })
              }
              className="input-white"
              style={{ backgroundColor: "white" }}
            />
          </div>
          <div>
            <Label htmlFor="contactPhone" value="Phone" />
            <TextInput
              id="contactPhone"
              name="phone"
              type="tel"
              placeholder="Phone"
              value={warehouse?.phone ?? ""}
              onChange={(e) =>
                setWarehouse({
                  ...warehouse!,
                  phone: e.target.value,
                })
              }
              className="input-white"
            />
          </div>
          
          <div>
            <Label htmlFor="contactPersonPosition" value="Position" />
            <TextInput
              id="contactPersonPosition"
              name="contact_position"
              type="text"
              placeholder="Position"
              value={warehouse?.contact_position ?? ""}
              onChange={(e) =>
                setWarehouse({
                  ...warehouse!,
                  contact_position: e.target.value,
                })
              }
              className="input-white"
            />
          </div>
          <div>
            <Label htmlFor="contactTitle" value="Title" />
            <TextInput
              id="contactTitle"
              name="contact_title"
              type="text"
              placeholder="ex: Mr. or Mrs."
              value={warehouse?.contact_title ?? ""}
              onChange={(e) =>
                setWarehouse({
                  ...warehouse!,
                  contact_title: e.target.value,
                })
              }
              className="input-white"
            />
          </div>
          <div>
            <Label htmlFor="contactAddress" value="Contact Note" />
            <Textarea
              id="contactContactNote"
              name="contact_note"
              placeholder="Contact Note"
              value={warehouse?.contact_note ?? ""}
              onChange={(e) =>
                setWarehouse({
                  ...warehouse!,
                  contact_note: e.target.value,
                })
              }
              style={{ backgroundColor: "white" }}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="justify-end flex w-full">
          <Button
            onClick={async () => {
              try {
                if (warehouse.id) {
                  await updateWarehouse(warehouse.id, warehouse);
                } else {
                  await createWarehouse(warehouse);
                }
                onCreate();
                setShow(false);
                setWarehouse({
                  name: "",
                  address: "",
                });
              } catch (error) {
                console.error(error);
              }
            }}
          >
            Save
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalWarehouse;
