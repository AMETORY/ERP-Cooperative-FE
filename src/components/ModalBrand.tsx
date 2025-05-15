import { Button, Label, Modal, Textarea, TextInput } from "flowbite-react";
import { useEffect, useState, type FC } from "react";
import { BrandModel } from "../models/brand";
import { createBrand, updateBrand } from "../services/api/brandApi";
import toast from "react-hot-toast";
import Select, { InputActionMeta } from "react-select";
import Barcode from "react-barcode";
import CurrencyInput from "react-currency-input-field";
import { useTranslation } from 'react-i18next';
interface ModalBrandProps {
  show: boolean;
  setShow: (show: boolean) => void;
  brand?: BrandModel | undefined;
  setBrand: (brand: BrandModel) => void;
  onCreateBrand: (brand: BrandModel) => void;
}

const ModalBrand: FC<ModalBrandProps> = ({
  show,
  setShow,
  brand,
  setBrand,
  onCreateBrand,
}) => {
  const { t } = useTranslation();
  const handleCreateBrand = async () => {
    try {
      if (brand?.id) {
        const res: any = await updateBrand(brand!.id, brand);
        onCreateBrand(res.data);
      } else {
        const res: any = await createBrand(brand);
        onCreateBrand(res.data);
      }

      setShow(false);
    } catch (error) {
      toast.error(`${error}`);
    }
  };




  return (
    <Modal show={show} onClose={() => setShow(false)}>
      <Modal.Header>Brand Form</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col space-y-4">
          <div className="mb-4">
            <Label htmlFor="brand-name" value={t("name")} />
            <TextInput
              id="brand-name"
              placeholder={t("name")}
              value={brand?.name ?? ""}
              onChange={(e) =>
                setBrand({ ...brand!, name: e.target.value })
              }
              className="input-white"
            />
          </div>
         
          <div className="mb-4">
            <Label htmlFor="brand-description" value={t("description")} />
            <Textarea
              rows={7}
              id="brand-description"
              placeholder={t("description")}
              value={brand?.description ?? ""}
              onChange={(e) =>
                setBrand({ ...brand!, description: e.target.value })
              }
              className="input-white"
              style={{ backgroundColor: "white" }}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end w-full">
          <Button onClick={handleCreateBrand}>{t("save")}</Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalBrand;
