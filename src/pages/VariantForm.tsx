import { useEffect, useState, type FC } from "react";
import CurrencyInput from "react-currency-input-field";
import CreatableSelect from "react-select/creatable";
import { ProductModel, VariantModel } from "../models/product";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { invertColor } from "../utils/helper";
import { addTagVariant } from "../services/api/productApi";
import { ProductAttributeModel } from "../models/producy_attribute";
import { getProductAttributes } from "../services/api/productAttributeApi";

interface VariantFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: VariantModel) => void;
  variant?: VariantModel;
  product: ProductModel;
}

const VariantForm: FC<VariantFormProps> = ({
  open,
  onClose,
  onSubmit,
  product,
  variant,
}) => {
  const [attributes, setAttributes] = useState<ProductAttributeModel[]>([]);
  const [attributeIds, setAttributeIds] = useState<string[]>([]);
  //   const [tags, setTags] = useState<Tag[]>([]);

  const [data, setData] = useState<VariantModel>({
    id: "",
    price: product.price,
    product_id: product.id!,
    sku: product.sku,
    barcode: product.barcode,
    attributes: [],
    width: product.width,
    height: product.height,
    length: product.length,
    weight: product.weight,
  });

  useEffect(() => {
    if (open) {
      getProductAttributes({ page: 1, size: 100 }).then((res: any) => {
        setAttributes(res.data.items);
      });
      //   getTags({ page: 1, size: 100 })
      //     .then((v) => v.json())
      //     .then((v) => setTags(v.data.items));
    } else {
      clearForm();
    }
  }, [open]);
  const clearForm = () => {
    setAttributeIds([]);
    setAttributes([]);
    setData({
      id: "",
      price: product.price,
      product_id: product.id!,
      sku: product.sku,
      barcode: product.barcode,
      attributes: [],
      width: product.width,
      height: product.height,
      length: product.length,
      weight: product.weight,
    });
  };
  useEffect(() => {
    if (variant) {
      if (!variant.sku) {
        variant.sku = product.sku;
      }
      if (!variant.barcode) {
        variant.barcode = product.barcode;
      }
      setData(variant);
      setAttributeIds(variant.attributes.map((a) => a.attribute_id!));
    }
  }, [variant]);
  return (
    <Modal
      size={"lg"}
      show={open}
      onClose={() => {
        clearForm();
        onClose();
      }}
    >
      <Modal.Header>Variants Form</Modal.Header>
      <Modal.Body>
        <div className="w-full flex flex-col space-y-4">
          <div className="">
            <label>Attibutes</label>
            <div className="input">
              <div className="grid grid-cols-4 gap-4 ">
                {attributes.map((attr) => (
                  <div className="flex gap-2" key={attr.id}>
                    <Checkbox
                      key={attr.id}
                      value={attr.id}
                      checked={attributeIds.some((a) => a === attr.id)}
                      onChange={(checked) => {
                        if (!attributeIds.includes(attr.id)) {
                          setAttributeIds([...attributeIds, attr.id]);
                        } else {
                          setAttributeIds(
                            attributeIds.filter((a) => a !== attr.id)
                          );
                        }
                      }}
                    />
                    <Label htmlFor={attr.id}>{attr.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="">
            <label>SKU</label>
            <div className="input">
              <TextInput
                name="sku"
                placeholder="SKU"
                value={data.sku}
                onChange={(value) =>
                  setData({ ...data, sku: value.target.value })
                }
              />
            </div>
          </div>
          <div className="">
            <label>Barcode</label>
            <div className="input">
              <TextInput
                name="barcode"
                placeholder="Barcode"
                value={data.barcode}
                onChange={(value) =>
                  setData({ ...data, barcode: value.target.value })
                }
              />
            </div>
          </div>
          <div className="">
            <label>Price</label>
            <div className="input">
              <CurrencyInput
                className="rs-input"
                value={data.price}
                groupSeparator="."
                decimalSeparator=","
                onValueChange={(value, name, values) =>
                  setData({ ...data, price: values?.float ?? 0 })
                }
              />
            </div>
          </div>
          <div className="">
            <label>Weight</label>
            <div className="input">
              <div className="relative">
                <CurrencyInput
                  className="rs-input"
                  value={data.weight}
                  groupSeparator="."
                  decimalSeparator=","
                  onValueChange={(value, name, values) =>
                    setData({ ...data, weight: values?.float ?? 0 })
                  }
                />
                <small className="absolute bottom-2 right-2">gr</small>
              </div>
            </div>
          </div>
          <div className="">
            <label>Dimension (L x W x H)</label>
            <div className="input">
              <div className="grid grid-cols-3 gap-2">
                <div className="relative">
                  <CurrencyInput
                    className="rs-input"
                    value={data.length}
                    groupSeparator="."
                    decimalSeparator=","
                    onValueChange={(value, name, values) =>
                      setData({ ...data, length: values?.float ?? 0 })
                    }
                  />
                  <small className="absolute bottom-2 right-2">cm</small>
                </div>
                <div className="relative">
                  <CurrencyInput
                    className="rs-input"
                    value={data.width}
                    groupSeparator="."
                    decimalSeparator=","
                    onValueChange={(value, name, values) =>
                      setData({ ...data, width: values?.float ?? 0 })
                    }
                  />
                  <small className="absolute bottom-2 right-2">cm</small>
                </div>
                <div className="relative">
                  <CurrencyInput
                    className="rs-input"
                    value={data.height}
                    groupSeparator="."
                    decimalSeparator=","
                    onValueChange={(value, name, values) =>
                      setData({ ...data, height: values?.float ?? 0 })
                    }
                  />
                  <small className="absolute bottom-2 right-2">cm</small>
                </div>
              </div>
            </div>
          </div>
          {/* {variant && (
            <div className="">
              <label>Tag</label>
              <div className="input">
                <CreatableSelect
                  isClearable
                  isMulti
                  value={(data.tags ?? []).map((item) => ({
                    label: item.name,
                    value: item.id,
                    data: item,
                  }))}
                  options={tags.map((item) => ({
                    label: item.name,
                    value: item.id,
                    data: item,
                  }))}
                  styles={{
                    container: (provided) => ({
                      ...provided,
                      width: "100%",
                    }),
                    multiValue(base, props) {
                      return {
                        ...base,
                        backgroundColor: props.data?.data?.color,
                        borderRadius: "10px",
                        padding: "px 10px",
                      };
                    },
                    multiValueLabel(base, props) {
                      return {
                        ...base,
                        color: invertColor(props.data?.data?.color),
                      };
                    },
                  }}
                //   onCreateOption={(value) => {
                //     addTagVariant(product.id!, variant.id, { name: value })
                //       .then((v) => {
                //         setData({
                //           ...data,
                //           tags: [...(data?.tags ?? []), v.data],
                //         });
                //         getTags({ page: 1, size: 100 })
                //           .then((v) => v.json())
                //           .then((v) => setTags(v.data.items));
                //       });
                //   }}
                  onChange={(value) => {
                    // console.log(value);
                    setData({
                      ...data,
                      tags: value.map((item) => item.data),
                    });
                  }}
                />
              </div>
            </div>
          )} */}
          {attributes
            .filter((attr) => attributeIds.includes(attr.id))
            .map((attr) => (
              <div key={attr.id} className="">
                <label>{attr.name}</label>
                <TextInput
                  value={
                    data.attributes.find(
                      (attribute) => attribute.attribute_id === attr.id
                    )?.value || ""
                  }
                  placeholder={attr.name}
                  onChange={(el) => {
                  
                    setData((prevData) => {
                        const attribute = prevData.attributes.find(
                          (attribute) => attribute.attribute_id === attr.id
                        );
                        if (attribute) {
                          return {
                            ...prevData,
                            attributes: prevData.attributes.map((a) =>
                              a.attribute_id === attr.id ? { ...a, value: el.target.value } : a
                            ),
                          };
                        } else {
                          return {
                            ...prevData,
                            attributes: [
                              ...prevData.attributes,
                              {
                                attribute_id: attr.id,
                                variant_id: variant?.id || "",
                                value: el.target.value,
                              },
                            ],
                          };
                        }
                      })
                  }}
                />
              </div>
            ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="pt-4 flex justify-end w-full gap-2">
          <Button
            onClick={() => {
              //   console.log(data);
              onSubmit(data!);
            }}
          >
            Submit
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
export default VariantForm;
