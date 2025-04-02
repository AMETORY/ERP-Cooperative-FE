import { useContext, useEffect, useState, type FC } from "react";

import CurrencyInput from "react-currency-input-field";
import { ProductPriceModel } from "../models/price";
import { PriceCategoryModel } from "../models/price_category";
import { getPriceCategories } from "../services/api/priceCategoryApi";
import { Button, Datepicker, Modal } from "flowbite-react";
import Select, { InputActionMeta } from "react-select";
import { ProductModel } from "../models/product";
import { LoadingContext } from "../contexts/LoadingContext";
import toast from "react-hot-toast";
import { addPriceProduct } from "../services/api/productApi";
interface PriceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProductPriceModel) => void;
  price?: ProductPriceModel;
  product?: ProductModel;
}

const PriceForm: FC<PriceFormProps> = ({ open, onClose, onSubmit, price, product }) => {
  const {loading, setLoading} = useContext(LoadingContext);
  const [priceCategories, setPriceCategories] = useState<PriceCategoryModel[]>(
    []
  );
  const [data, setData] = useState<ProductPriceModel>({
    id: "",
    amount: product?.price ?? 0,
    currency: "",
    price_category_id: "",
    effective_date: new Date(),
    min_quantity: 0,
  });


  const addPrice = async (data: ProductPriceModel) => {
    try {
      setLoading(true);
      let resp = await addPriceProduct(product!.id!, data);
      onSubmit(data);
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPriceCategories({ page: 1, size: 100 }).then((res: any) => {
      setPriceCategories(res.data.items);
    });
  }, []);
  return (
    <Modal show={open} onClose={onClose}>
      <Modal.Header>Price Form</Modal.Header>
      <Modal.Body>
        <div className="w-full flex-col space-y-4">
          <div className="form-group ">
            <label>Category</label>
            <div className="input">
              <Select
                options={priceCategories}
                value={data?.price_category}
                formatOptionLabel={(option) => option.name}
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
        <div className="flex justify-end w-full">
          <Button onClick={() => addPrice(data!)}>Submit</Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
export default PriceForm;
