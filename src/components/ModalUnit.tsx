import { Button, Label, Modal, Textarea, TextInput } from "flowbite-react";
import { useState, type FC } from "react";
import {
  createUnit,
  updateUnit,
} from "../services/api/unitApi";
import { UnitModel } from "../models/unit";

interface ModalUnitProps {
  unit: UnitModel;
  setUnit: (unit: UnitModel) => void;
  show: boolean;
  setShow: (show: boolean) => void;
  onCreate: () => void;
}

const ModalUnit: FC<ModalUnitProps> = ({
  show,
  setShow,
  onCreate,
  unit,
  setUnit,
}) => {
  const [name, setName] = useState("");
  return (
    <Modal show={show} onClose={() => setShow(false)}>
      <Modal.Header>Create Unit</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div className="mb-2 block">
            <Label htmlFor="name" value="Name" />
            <TextInput
              id="name"
              type="text"
              placeholder="Name"
              required={true}
              value={unit?.name}
              onChange={(e) =>
                setUnit({
                  ...unit!,
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
              value={unit?.description}
              onChange={(e) =>
                setUnit({
                  ...unit!,
                  description: e.target.value,
                })
              }
              className="input-white"
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
                if (unit.id) {
                  await updateUnit(unit.id, unit);
                } else {
                  await createUnit(unit);
                }
                onCreate();
                setShow(false);
                setUnit({
                  name: "",
                  code: "",
                  description: "",
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
export default ModalUnit;
