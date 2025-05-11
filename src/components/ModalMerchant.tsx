import { Button, Label, Modal, Textarea, TextInput } from "flowbite-react";
import { useState, type FC } from "react";
import { useTranslation } from "react-i18next";
import { MerchantModel } from "../models/merchant";
import {
  createMerchant,
  updateMerchant,
} from "../services/api/merchantApi";
interface ModalMerchantProps {
  merchant: MerchantModel;
  setMerchant: (merchant: MerchantModel) => void;
  show: boolean;
  setShow: (show: boolean) => void;
  onCreate: () => void;
}

const ModalMerchant: FC<ModalMerchantProps> = ({
  show,
  setShow,
  onCreate,
  merchant,
  setMerchant,
}) => {
  const { t } = useTranslation  ();
  const [name, setName] = useState("");
  return (
    <Modal show={show} onClose={() => setShow(false)}>
      <Modal.Header>{t('create_merchant')}</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div className="mb-2 block">
            <Label htmlFor="name" value={t("name")} />
            <TextInput
              id="name"
              type="text"
              placeholder={t("name")}
              required={true}
              value={merchant?.name}
              onChange={(e) =>
                setMerchant({
                  ...merchant!,
                  name: e.target.value,
                })
              }
              className="input-white"
            />
          </div>
          <div className="mb-2 block">
            <Label htmlFor="phone" value={t("phone")} />
            <TextInput
              id="phone"
              type="text"
              placeholder={t("phone")}
              required={true}
              value={merchant?.phone}
              onChange={(e) =>
                setMerchant({
                  ...merchant!,
                  phone: e.target.value,
                })
              }
              className="input-white"
            />
          </div>
          <div className="mb-2 block">
            <Label htmlFor="address" value={t("address")} />
            <Textarea
              id="address"
              placeholder={t("address")}
              rows={4}
              value={merchant?.address}
              onChange={(e) =>
                setMerchant({
                  ...merchant!,
                  address: e.target.value,
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
                if (merchant.id) {
                  await updateMerchant(merchant.id, merchant);
                } else {
                  await createMerchant(merchant);
                }
                onCreate();
                setShow(false);
                setMerchant({
                  name: "",
                  phone: "",
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
export default ModalMerchant;
