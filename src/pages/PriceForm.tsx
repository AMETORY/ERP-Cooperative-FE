import { useContext, useEffect, useState, useTransition, type FC } from "react";

import CurrencyInput from "react-currency-input-field";
import { ProductPriceModel } from "../models/price";
import { PriceCategoryModel } from "../models/price_category";
import { getPriceCategories } from "../services/api/priceCategoryApi";
import { Button, Datepicker, Modal, TextInput } from "flowbite-react";
import Select, { InputActionMeta } from "react-select";
import { ProductModel } from "../models/product";
import { LoadingContext } from "../contexts/LoadingContext";
import toast from "react-hot-toast";
import { addPriceProduct } from "../services/api/productApi";
import { useTranslation } from "react-i18next";
import { PiPercent } from "react-icons/pi";

interface PriceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProductPriceModel) => void;
  price?: ProductPriceModel;
  product?: ProductModel;
}

const PriceForm: FC<PriceFormProps> = ({
  open,
  onClose,
  onSubmit,
  price,
  product,
}) => {
  const { t } = useTranslation();
  const { loading, setLoading } = useContext(LoadingContext);
  const [markup, setMarkup] = useState(0);
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
          <div className=" ">
            <label>{t("category")}</label>
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
          <div className="">
            <label>{t("base_price")}</label>
            <div className="grid grid-cols-4 w-full gap-4">
              <CurrencyInput
                className="rs-input col-span-3"
                readOnly
                value={product?.price}
                groupSeparator="."
                decimalSeparator=","
                onValueChange={(value, name, values) =>
                  setData({ ...data, amount: values?.float ?? 0 })
                }
              />
              <div>
                <TextInput
                  rightIcon={PiPercent}
                  value={markup}
                  onChange={(value) => {
                    setMarkup(Number(value.target.value));
                    setData({
                      ...data,
                      amount:
                        product?.price! +
                        product?.price! * (Number(value.target.value) / 100),
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="">
            <label>{t("price")}</label>
            <CurrencyInput
              className="rs-input"
              value={data.amount}
              groupSeparator="."
              decimalSeparator=","
              onValueChange={(value, name, values) => {
                setData({ ...data, amount: values?.float ?? 0 });
                setMarkup(
                  ((data.amount - product?.price!) / product?.price!) * 100
                );
              }}
            />
          </div>
          <div className="">
            <label>{t("min_quantity")}</label>
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
          <div className="">
            <label>{t("effective_date")}</label>
            <div className="input">
              <Datepicker
                value={data.effective_date}
                onChange={(value) => {
                  setData({ ...data, effective_date: value! });
                }}
                className="w-full input-white"
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
