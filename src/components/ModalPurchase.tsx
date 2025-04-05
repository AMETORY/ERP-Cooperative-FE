import {
  Button,
  Datepicker,
  Label,
  Modal,
  Textarea,
  TextInput,
} from "flowbite-react";
import type { FC } from "react";
import { PurchaseModel } from "../models/purchase";
import moment from "moment";
import { purchaseTypes } from "../utils/constants";

interface ModalPurchaseProps {
  show: boolean;
  onClose: () => void;
  title: string;
  purchase: PurchaseModel;
  setPurchase: (purchase: PurchaseModel) => void;
  savePurchase: (purchase: PurchaseModel) => void;
}

const ModalPurchase: FC<ModalPurchaseProps> = ({
  show,
  onClose,
  title,
  purchase,
  setPurchase,
  savePurchase,
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
                value={moment(purchase?.purchase_date).toDate()}
                onChange={(val) =>
                  setPurchase({
                    ...purchase,
                    purchase_date: val!.toISOString(),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchase-number">{title} Number</Label>
              <TextInput
                id="purchase-number"
                type="text"
                placeholder={`${title} Number`}
                required={true}
                value={purchase?.purchase_number}
                onChange={(e) =>
                  setPurchase({ ...purchase, purchase_number: e.target.value })
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
                value={purchase?.notes}
                onChange={(e) => setPurchase({ ...purchase, notes: e.target.value })}
              />
            </div>
          </div>
          <div className="h-32"></div>
        </form>
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button type="submit" onClick={() => savePurchase(purchase)}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalPurchase;
