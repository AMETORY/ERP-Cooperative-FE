import {
  Button,
  Datepicker,
  Label,
  Modal,
  Textarea,
  TextInput,
} from "flowbite-react";
import type { FC } from "react";
import { SalesModel } from "../models/sales";
import moment from "moment";
import { salesTypes } from "../utils/constants";

interface ModalSalesProps {
  show: boolean;
  onClose: () => void;
  title: string;
  sales: SalesModel;
  setSales: (sales: SalesModel) => void;
  saveSales: (sales: SalesModel) => void;
}

const ModalSales: FC<ModalSalesProps> = ({
  show,
  onClose,
  title,
  sales,
  setSales,
  saveSales,
}) => {
  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Create {title}</Modal.Header>
      <Modal.Body>
        <form>
          <div className=" space-y-6">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Datepicker
                id="date"
                value={moment(sales?.sales_date).toDate()}
                onChange={(val) =>
                  setSales({
                    ...sales,
                    sales_date: val!.toISOString(),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sales-number">{title} Number</Label>
              <TextInput
                id="sales-number"
                type="text"
                placeholder={`${title} Number`}
                required={true}
                value={sales?.sales_number}
                onChange={(e) =>
                  setSales({ ...sales, sales_number: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                rows={7}
                id="notes"
                placeholder="Description"
                required={true}
                value={sales?.notes}
                onChange={(e) => setSales({ ...sales, notes: e.target.value })}
              />
            </div>
          </div>
          <div className="h-32"></div>
        </form>
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button type="submit" onClick={() => saveSales(sales)}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalSales;
