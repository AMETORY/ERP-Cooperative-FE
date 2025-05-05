import { Button, Label, Modal, Textarea, TextInput } from "flowbite-react";
import { useState, type FC } from "react";
import { useTranslation } from "react-i18next";
import { UnitModel } from "../models/unit";
import {
  createUnit,
  updateUnit,
} from "../services/api/unitApi";
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
  const { t } = useTranslation  ();
  const [name, setName] = useState("");
  return (
    <Modal show={show} onClose={() => setShow(false)}>
      <Modal.Header>{t('create_unit')}</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div className="mb-2 block">
            <Label htmlFor="name" value={t("name")} />
            <TextInput
              id="name"
              type="text"
              placeholder={t("name")}
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
            <Label htmlFor="description" value={t("description")} />
            <Textarea
              id="description"
              placeholder={t("description")}
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
            {t('save')}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalUnit;
