import { Button, Label, Modal, Textarea, TextInput, ToggleSwitch } from "flowbite-react";
import type { FC } from "react";
import { ContactModel } from "../models/contact";
import { useTranslation } from 'react-i18next';
import CurrencyInput from "react-currency-input-field";

interface ModalContactProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  selectedContact?: ContactModel | undefined;
  setSelectedContact: (value: ContactModel | undefined) => void;
  handleCreateContact: () => void;
}

const ModalContact: FC<ModalContactProps> = ({
  showModal,
  setShowModal,
  selectedContact,
  setSelectedContact,
  handleCreateContact

}) => {
  const { t } = useTranslation();
  return (
    <Modal show={showModal} onClose={() => setShowModal(false)}>
      <Modal.Header>
 {t('contact')}
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <div>
            <Label htmlFor="contactName" value={t('name')} />
            <TextInput
              id="contactName"
              name="name"
              placeholder={t('name')}
              required
              value={selectedContact?.name ?? ""}
              onChange={(e) =>
                setSelectedContact({
                  ...selectedContact!,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="contactEmail" value={t('email')} />
            <TextInput
              id="contactEmail"
              name="email"
              type="email"
              placeholder={t('email')}
              value={selectedContact?.email ?? ""}
              onChange={(e) =>
                setSelectedContact({
                  ...selectedContact!,
                  email: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="contactPhone" value={t('phone')} />
            <TextInput
              id="contactPhone"
              name="phone"
              type="tel"
              placeholder={t('phone')}
              value={selectedContact?.phone ?? ""}
              onChange={(e) =>
                setSelectedContact({
                  ...selectedContact!,
                  phone: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="contactAddress" value={t('address')} />
            <Textarea
              id="contactAddress"
              name="address"
              placeholder={t('address')}
              value={selectedContact?.address ?? ""}
              onChange={(e) =>
                setSelectedContact({
                  ...selectedContact!,
                  address: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="contactPersonPosition" value={t('position')} />
            <TextInput
              id="contactPersonPosition"
              name="contact_person_position"
              type="text"
              placeholder={t('position')}
              value={selectedContact?.contact_person_position ?? ""}
              onChange={(e) =>
                setSelectedContact({
                  ...selectedContact!,
                  contact_person_position: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="receivablesLimit" value={t('receivables_limit')} />
            <CurrencyInput
              groupSeparator="."
                  decimalSeparator=","
              id="receivablesLimit"
              name="receivables_limit"
              placeholder={t('receivables_limit')}
              value={selectedContact?.receivables_limit ?? 0}
              onValueChange={(v) =>
                setSelectedContact({
                  ...selectedContact!,
                  receivables_limit: Number(v),
                })
              }
              className="rs-input"
            />
          </div>
          <div>
            <Label htmlFor="debtLimit" value={t('debt_limit')} />
            <CurrencyInput
              groupSeparator="."
                  decimalSeparator=","
              id="debtLimit"
              name="debt_limit"
              placeholder={t('debt_limit')}
              value={selectedContact?.debt_limit ?? 0}
              onValueChange={(v) =>
                setSelectedContact({
                  ...selectedContact!,
                  debt_limit: Number(v),
                })
              }
              className="rs-input"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <ToggleSwitch
              id="is_customer"
              name="is_customer"
              checked={selectedContact?.is_customer ?? false}
              onChange={(e) =>
                setSelectedContact({
                  ...selectedContact!,
                  is_customer: e!,
                })
              }
              label={t('customer')}
            />
            <div>
              <ToggleSwitch
                id="is_vendor"
                name="is_vendor"
                checked={selectedContact?.is_vendor ?? false}
                onChange={(e) =>
                  setSelectedContact({
                    ...selectedContact!,
                    is_vendor: e!,
                  })
                }
                label={t('vendor')}
              />
            </div>
            <div>
              <ToggleSwitch
                id="is_supplier"
                name="is_supplier"
                checked={selectedContact?.is_supplier ?? false}
                onChange={(e) =>
                  setSelectedContact({
                    ...selectedContact!,
                    is_supplier: e!,
                  })
                }
                label={t('supplier')}
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end w-full">
          <Button onClick={handleCreateContact}>
            {selectedContact?.id ? t('edit') : t('create')} {t('contact')}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalContact;
