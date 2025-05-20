import { Button, Label, Modal, ToggleSwitch } from "flowbite-react";
import { useEffect, useState, type FC } from "react";
import Select from "react-select";
import { ProductModel } from "../models/product";
import { UnitModel } from "../models/unit";
import { getUnits } from "../services/api/unitApi";
import CurrencyInput from "react-currency-input-field";
import { addProductUnit } from "../services/api/productApi";
import toast from "react-hot-toast";
interface ModalProductUnitProps {
  product: ProductModel;
  show: boolean;
  setShow: (show: boolean) => void;
  onCreate: () => void;
}

const ModalProductUnit: FC<ModalProductUnitProps> = ({
  product,
  show,
  setShow,
  onCreate,
}) => {
  const [units, setUnits] = useState<UnitModel[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<UnitModel>();
  const [defaultUnit, setDefaultUnit] = useState<UnitModel>();
  const [value, setValue] = useState(1);
  const [isDefault, setIsDefault] = useState(false);
  const [mountedValue, setMountedValue] = useState(true);

  useEffect(() => {
    searchUnit("");
  }, []);
  const searchUnit = (s: string) => {
    getUnits({ page: 1, size: 10, search: s }).then((res: any) => {
      setUnits(res.data.items);
    });
  };

  useEffect(() => {
    if ((product?.units ?? []).length > 0) {
    } else {
      setIsDefault(true);
    }
    if (product?.default_unit) {
      setDefaultUnit(product?.default_unit);
    }
  }, [product]);
  return (
    <Modal show={show} onClose={() => setShow(false)}>
      <Modal.Header>Product Unit Form</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div className="mb-2 block">
            <Label htmlFor="unit" value="Unit" />
            <Select
              options={units}
              value={selectedUnit}
              onChange={(e: any) => setSelectedUnit(e)}
              formatOptionLabel={(unit: any) => (
                <div className="flex justify-between items-center space-x-2">
                  <span>{unit.name}</span>
                  <span>{unit.code}</span>
                </div>
              )}
              getOptionLabel={(unit: any) => unit.name}
              getOptionValue={(unit: any) => unit.id}
              placeholder="Select a unit"
            />
          </div>
          <div className="mb-2 block">
            <Label htmlFor="value" value="Value" />
            <div className="relative">
              {mountedValue &&
              <CurrencyInput
                className="rs-input !p-1.5 "
                // value={value ?? 0}
                groupSeparator=","
                decimalSeparator="."
                decimalsLimit={4}
                onValueChange={(value, name, values) => {
                  console.log(value);
                  setValue(Number(value));
                }}
              />
}
              <span  className="absolute top-2 right-2 text-sm">
                {defaultUnit?.code}
              </span>
            </div>
          </div>
          <div className="mb-2 block">
            <ToggleSwitch
              checked={isDefault}
              onChange={(e) => setIsDefault(e)}
              label="Is Default"
            />
          </div>
        </div>
        <div className="h-[200px]"></div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex w-full justify-end">
          <Button
            onClick={async () => {
              let data = {
                unit_id: selectedUnit?.id,
                is_default: isDefault,
                value,
              };
              try {
                await addProductUnit(product!.id!, data);
                onCreate();
              } catch (error) {
                toast.error(`${error}`);
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
export default ModalProductUnit;
