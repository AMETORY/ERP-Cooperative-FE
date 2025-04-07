import {
  Button,
  Datepicker,
  Label,
  Modal,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useContext, useState, type FC } from "react";
import { SalesModel } from "../models/sales";
import Select from "react-select";
import { createSalesReturn } from "../services/api/salesReturnApi";
import toast from "react-hot-toast";
import { LoadingContext } from "../contexts/LoadingContext";

interface ModalSalesReturnProps {
  show: boolean;
  onClose: () => void;
  sales?: SalesModel;
  setSales: (sales: SalesModel) => void;
  salesList: SalesModel[];
  onInputChange: (e: string) => void;
  onSuccess: (saless: SalesModel) => void;
  hideSelectSales?: boolean;
}

const ModalSalesReturn: FC<ModalSalesReturnProps> = ({
  show,
  onClose,
  sales,
  salesList,
  setSales,
  onInputChange,
  onSuccess,
  hideSelectSales,
}) => {
  const { loading, setLoading } = useContext(LoadingContext);
  const [date, setDate] = useState<Date>(new Date());
  const [returnNumber, setReturnNumber] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Create Sales Return</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Datepicker
              id="date"
              name="date"
              value={date}
              onChange={(val) => setDate(val!)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="return-number">Return Number</Label>
            <TextInput
              id="return-number"
              type="text"
              placeholder={`Return Number`}
              required={true}
              value={returnNumber}
              onChange={(e) => setReturnNumber(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="return-number">Invoice</Label>
            {hideSelectSales ? (
              <div>{sales?.sales_number}</div>
            ) : (
              <Select
                options={salesList.map((p) => {
                  return {
                    value: p.id,
                    label: p.sales_number,
                    supplier: p.contact_data_parsed?.name,
                  };
                })}
                value={{
                  value: sales?.id,
                  label: sales?.sales_number,
                  supplier: sales?.contact_data_parsed?.name,
                }}
                onChange={(option) => {
                  let selected = salesList.find((p) => p.id === option?.value!);
                  setSales(selected!);
                }}
                formatOptionLabel={(option) => (
                  <div className="flex space-x-2 flex-row justify-between">
                    <p>{option.label}</p>
                    <p className="text-gray-400 text-sm">{option.supplier}</p>
                  </div>
                )}
                onInputChange={onInputChange}
                isSearchable
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              rows={7}
              id="description"
              placeholder="Description"
              required={true}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={async () => {
            try {
              if (!sales) {
                throw new Error("Please select a invoice");
              }
              setLoading(true);
              let data = {
                date,
                ref_id: sales?.id,
                return_number: returnNumber,
                notes,
                description,
              };
              let resp: any = await createSalesReturn(data);
              onSuccess(resp.data);
            } catch (error) {
              toast.error(`${error}`);
            } finally {
              setLoading(false);
            }
          }}
        >
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalSalesReturn;
