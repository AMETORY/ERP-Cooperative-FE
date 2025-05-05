import { Button, Label, Modal, Textarea, TextInput } from "flowbite-react";
import { useEffect, useState, type FC } from "react";
import { ProductModel } from "../models/product";
import { createProduct, updateProduct } from "../services/api/productApi";
import toast from "react-hot-toast";
import { ProductCategoryModel } from "../models/product_category";
import { getProductCategories } from "../services/api/productCategoryApi";
import Select, { InputActionMeta } from "react-select";
import Barcode from "react-barcode";
import CurrencyInput from "react-currency-input-field";
import { useTranslation } from 'react-i18next';
interface ModalProductProps {
  show: boolean;
  setShow: (show: boolean) => void;
  product?: ProductModel | undefined;
  setProduct: (product: ProductModel) => void;
  onCreateProduct: (product: ProductModel) => void;
}

const ModalProduct: FC<ModalProductProps> = ({
  show,
  setShow,
  product,
  setProduct,
  onCreateProduct,
}) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<ProductCategoryModel[]>([]);
  const handleCreateProduct = async () => {
    try {
      if (product?.id) {
        const res: any = await updateProduct(product!.id, product);
        onCreateProduct(res.data);
      } else {
        const res: any = await createProduct(product);
        onCreateProduct(res.data);
      }

      setShow(false);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    searchCategory("");
  }, []);

  const searchCategory = (s: string) => {
    getProductCategories({ page: 1, size: 10, search: s }).then((res: any) => {
      setCategories(res.data.items);
    });
  };
  return (
    <Modal show={show} onClose={() => setShow(false)}>
      <Modal.Header>{product?.id ? t("edit_product") : t("create_product")}</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col space-y-4">
          <div className="mb-4">
            <Label htmlFor="product-name" value={t("product_name")} />
            <TextInput
              id="product-name"
              placeholder={t("product_name")}
              value={product?.name ?? ""}
              onChange={(e) =>
                setProduct({ ...product!, name: e.target.value })
              }
              className="input-white"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="product-sku" value={t("SKU")} />
            <TextInput
              id="product-sku"
              placeholder={t("SKU")}
              value={product?.sku ?? ""}
              onChange={(e) => setProduct({ ...product!, sku: e.target.value })}
              className="input-white"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="product-barcode" value={t("Barcode")} />
            <TextInput
              id="product-barcode"
              placeholder={t("Barcode")}
              value={product?.barcode ?? ""}
              onChange={(e) =>
                setProduct({ ...product!, barcode: e.target.value })
              }
              className="input-white"
            />
            {product?.barcode && (
              <Barcode className="mt-2" height={50} value={product.barcode} />
            )}
          </div>
          <div className="mb-4">
            <Label htmlFor="product-price" value={t("price")} />
            <CurrencyInput
              className="rs-input !p-1.5 "
              defaultValue={product?.price ?? 0}
              groupSeparator="."
              decimalSeparator=","
              onValueChange={(value, name, values) => {
                setProduct({
                  ...product!,
                  price: values?.float ?? 0,
                });
              }}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="product-category" value={t("category")} />
            <Select
              id="product-category"
              value={
                product?.category
                  ? { label: product.category.name, value: product.category.id }
                  : null
              }
              onChange={(e) =>
                setProduct({
                  ...product!,
                  category: { id: e!.value, name: e!.label },
                  category_id: e!.value,
                })
              }
              options={categories.map((c) => ({ label: c.name, value: c.id }))}
              onInputChange={(e) => searchCategory(e)}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="product-description" value={t("description")} />
            <Textarea
              rows={7}
              id="product-description"
              placeholder={t("description")}
              value={product?.description ?? ""}
              onChange={(e) =>
                setProduct({ ...product!, description: e.target.value })
              }
              className="input-white"
              style={{ backgroundColor: "white" }}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end w-full">
          <Button onClick={handleCreateProduct}>{t("save")}</Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalProduct;
