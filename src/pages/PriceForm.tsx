import { useEffect, useState, type FC } from "react";

import CurrencyInput from "react-currency-input-field";
import { ProductPriceModel } from "../models/price";
import { PriceCategoryModel } from "../models/price_category";
import { getPriceCategories } from "../services/api/priceCategoryApi";
import { Button, Datepicker, Modal } from "flowbite-react";
import Select, { InputActionMeta } from "react-select";
interface PriceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProductPriceModel) => void;
  price?: ProductPriceModel;
}

const PriceForm: FC<PriceFormProps> = ({ open, onClose, onSubmit, price }) => {
  const [priceCategories, setPriceCategories] = useState<PriceCategoryModel[]>(
    []
  );
  const [data, setData] = useState<ProductPriceModel>({
    id: "",
    amount: 0,
    currency: "",
    price_category_id: "",
    effective_date: new Date(),
    min_quantity: 0,
  });

  useEffect(() => {
    getPriceCategories({ page: 1, size: 100 }).then((res: any) => {
      setPriceCategories(res.data.items);
    });
  }, []);
  return (
    <Modal show={open} onClose={onClose}>
      <Modal.Header>Price Form</Modal.Header>
      <Modal.Body>
        <div className="w-full">
          <div className="form-group">
            <label>Category</label>
            <div className="input">
              <Select
                options={priceCategories}
                value={data?.price_category}
                onChange={(value) => {
                  setData({
                    ...data,
                    price_category: value!,
                    price_category_id: value!.id!,
                  });
                }}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Amount</label>
            <CurrencyInput
              className="rs-input"
              value={data.amount}
              groupSeparator="."
              decimalSeparator=","
              onValueChange={(value, name, values) =>
                setData({ ...data, amount: values?.float ?? 0 })
              }
            />
          </div>
          <div className="form-group">
            <label>Min Qty</label>
            <CurrencyInput
              className="rs-input"
              value={data.min_quantity}
              groupSeparator="."
              decimalSeparator=","
              onValueChange={(value, name, values) =>
                setData({ ...data, min_quantity: values?.float ?? 0 })
              }
            />
          </div>
          <div className="form-group">
            <label>Effective Date</label>
            <div className="input">
              <Datepicker
                value={data.effective_date}
                onChange={(value) => {
                  setData({ ...data, effective_date: value! });
                }}
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="pt-4">
          <Button onClick={() => onSubmit(data!)}>Submit</Button>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
export default PriceForm;
