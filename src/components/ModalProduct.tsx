import { Button, Label, Modal, TextInput } from "flowbite-react";
import type { FC } from "react";
import { ProductModel } from "../models/product";
import { createProduct } from "../services/api/productApi";
import toast from "react-hot-toast";

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
  onCreateProduct
}) => {
  const handleCreateProduct = () => {
    createProduct(product).then((res: any) => {
      onCreateProduct(res.data);
    }).then(() => setShow(false)).catch(toast.error);
    // Add logic to create product
  };
  return (
    <Modal show={show} onClose={() => setShow(false)}>
      <Modal.Header>Create Product</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col space-y-4">
          <div className="mb-4">
            <Label htmlFor="product-name" value="Product Name" />
            <TextInput
              id="product-name"
              placeholder="Product Name"
              value={product?.name ?? ""}
              onChange={(e) =>
                setProduct({ ...product!, name: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="product-price" value="Product Price" />
            <TextInput
              id="product-price"
              placeholder="Product Price"
              value={product?.price ?? ""}
              onChange={(e) =>
                setProduct({
                  ...product!,
                  price: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end w-full">
          <Button onClick={handleCreateProduct}>Create</Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalProduct;
