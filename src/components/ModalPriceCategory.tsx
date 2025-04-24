import { Button, Label, Modal, Textarea, TextInput } from "flowbite-react";
import { useState, type FC } from "react";
import { createProductCategory } from "../services/api/productCategoryApi";
import {
  createPriceCategory,
  updatePriceCategory,
} from "../services/api/priceCategoryApi";
import { PriceCategoryModel } from "../models/price_category";

interface ModalPriceCategoryProps {
  show: boolean;
  setShow: (show: boolean) => void;
  onCreate: () => void;
  category: PriceCategoryModel | null;
  setCategory: (category: PriceCategoryModel) => void;
}

const ModalPriceCategory: FC<ModalPriceCategoryProps> = ({
  show,
  setShow,
  onCreate,
  category,
  setCategory,
}) => {
  const [name, setName] = useState("");
  return (
    <Modal show={show} onClose={() => setShow(false)}>
      <Modal.Header> Price Category</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div className="mb-2 block">
            <Label htmlFor="name" value="Name" />
            <TextInput
              id="name"
              type="text"
              placeholder="Name"
              required={true}
              value={category?.name}
              onChange={(e) =>
                setCategory({
                  ...category!,
                  name: e.target.value,
                })
              }
              className="input-white"
            />
          </div>
          <div className="mb-2 block">
            <Label htmlFor="description" value="Description" />
            <Textarea
              id="description"
              placeholder="Description"
              rows={4}
              value={category?.description}
              onChange={(e) =>
                setCategory({
                  ...category!,
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
                if (category?.id) {
                  await updatePriceCategory(category.id, category);
                } else {
                  await createPriceCategory(category);
                }
                onCreate();
                setShow(false);
                setCategory({
                  name: "",
                  description: "",
                });
              } catch (error) {
                console.error(error);
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
export default ModalPriceCategory;
