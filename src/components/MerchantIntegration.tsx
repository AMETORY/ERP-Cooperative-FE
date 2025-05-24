import type { FC } from "react";
import { MerchantModel } from "../models/merchant";
import { useTranslation } from "react-i18next";
import { Button, Label, TextInput, ToggleSwitch } from "flowbite-react";
import { updateMerchant } from "../services/api/merchantApi";
import toast from "react-hot-toast";
import CurrencyInput from "react-currency-input-field";

interface MerchantIntegrationProps {
  merchant: MerchantModel;
  setMerchant: (merchant: MerchantModel) => void;
  onUpdate: () => void;
}

const MerchantIntegration: FC<MerchantIntegrationProps> = ({
  merchant,
  setMerchant,
  onUpdate,
}) => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col space-y-4">
        <div>
          <Label>{t("xendit_enabled")}</Label>
          <ToggleSwitch
            checked={merchant.enable_xendit ?? false}
            onChange={(e) => {
              setMerchant({
                ...merchant,
                enable_xendit: e,
              });
            }}
          />
        </div>
        {merchant.enable_xendit && (
          <div>
            <Label>{t("xendit_api_key")}</Label>
            <TextInput
              value={merchant?.xendit_api_key}
              onChange={(e) =>
                setMerchant({
                  ...merchant!,
                  xendit_api_key: e.target.value,
                })
              }
              placeholder={
                merchant.xendit_api_key_censored ?? t("xendit_api_key")
              }
            />
          </div>
        )}
        {merchant.enable_xendit && (
          <div>
            <Label>{t("qris_enabled")}</Label>
            <ToggleSwitch
              checked={merchant.xendit?.enable_qris ?? false}
              onChange={(e) => {
                setMerchant({
                  ...merchant,
                  xendit: {
                    ...merchant.xendit,
                    enable_qris: e,
                  },
                });
              }}
            />
          </div>
        )}
        {merchant.enable_xendit && (
          <div>
            <Label>{t("qris_fee")}</Label>
            <CurrencyInput
            className="rs-input"
              defaultValue={merchant?.xendit?.qris_fee ?? 0}
              onValueChange={(e,_ , values) => {
                setMerchant({
                  ...merchant,
                  xendit: {
                    ...merchant.xendit,
                    qris_fee: values?.float ?? 0,
                  },
                });
              }}
              placeholder={t("qris_fee")}
            />
          </div>
        )}

        <div>
          <Button
            onClick={() =>
              updateMerchant(merchant!.id!, {
                ...merchant!,
              }).then(() => {
                toast.success("Merchant updated successfully");
                onUpdate();
              })
            }
          >
            {t("save")}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default MerchantIntegration;
