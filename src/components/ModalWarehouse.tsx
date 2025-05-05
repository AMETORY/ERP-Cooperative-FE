import { Button, Label, Modal, Textarea, TextInput } from "flowbite-react";
import { useState, type FC } from "react";
import {
  createWarehouse,
  updateWarehouse,
} from "../services/api/warehouseApi";
import { WarehouseModel } from "../models/warehouse";

import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [name, setName] = useState("");
  return (
    <Modal show={show} onClose={() => setShow(false)}>
      <Modal.Header>{t('create_warehouse')}</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div className="mb-2 block">
            <Label htmlFor="name" value={t('name')} />
            <TextInput
              id="name"
              type="text"
              placeholder={t('name')}
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
            <Label htmlFor="description" value={t('description')} />
            <Textarea
              id="description"
              placeholder={t('description')}
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
            <Label htmlFor="address" value={t('address')} />
            <Textarea
              id="address"
              placeholder={t('address')}
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
            <Label htmlFor="contactPhone" value={t('phone')} />
            <TextInput
              id="contactPhone"
              name="phone"
              type="tel"
              placeholder={t('phone')}
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
            <Label htmlFor="contactPersonPosition" value={t('contact_position')} />
            <TextInput
              id="contactPersonPosition"
              name="contact_position"
              type="text"
              placeholder={t('contact_position')}
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
            <Label htmlFor="contactTitle" value={t('contact_title')} />
            <TextInput
              id="contactTitle"
              name="contact_title"
              type="text"
              placeholder={t('contact_title')}
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
            <Label htmlFor="contactAddress" value={t('contact_notes')} />
            <Textarea
              id="contactContactNote"
              name="contact_notes"
              placeholder={t('contact_notes')}
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
            {t('save')}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalWarehouse;
