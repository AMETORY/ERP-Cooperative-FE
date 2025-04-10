import { useContext, useEffect, useState, type FC } from "react";
import { getSetting } from "../../services/api/commonApi";
import { AccountModel } from "../../models/account";
import { getAccounts } from "../../services/api/accountApi";
import { CompanyModel } from "../../models/company";
import { CooperationSetting } from "../../models/setting";
import { Badge, Button, HR, Label, Textarea, TextInput } from "flowbite-react";
import Select from "react-select";
import CurrencyInput from "react-currency-input-field";
import { AUTO_NUMERIC_FORMAL } from "../../utils/constants";
import Chart from "react-google-charts";
import { TbPercentage } from "react-icons/tb";
import { Editor } from "@tinymce/tinymce-react";
import { LoadingContext } from "../../contexts/LoadingContext";
import { updateCooperativeSetting } from "../../services/api/cooperativeApi";
import toast from "react-hot-toast";

interface CooperativeSettingProps {}

const CooperativeSetting: FC<CooperativeSettingProps> = ({}) => {
  const { loading, setLoading } = useContext(LoadingContext);
  const [mounted, setMounted] = useState(false);
  const [setting, setSetting] = useState<CooperationSetting>();
  const [remainAllocation, setRemainAllocation] = useState(0);
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  const [error, setError] = useState("");
  const [equityAccounts, setEquityAccounts] = useState<AccountModel[]>([]);
  const [incomeAccounts, setIncomeAccounts] = useState<AccountModel[]>([]);
  const [receivableAccounts, setReceivableAccounts] = useState<AccountModel[]>(
    []
  );
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      getSetting().then((res: any) => {
        setSetting(res.data.cooperative_setting);
      });
      getAccounts({ page: 1, size: 100, type: "EQUITY" }).then((res: any) =>
        setEquityAccounts(res.data.items)
      );
      getAccounts({
        page: 1,
        size: 100,
        type: "RECEIVABLE,ASSET",
        cashflow_sub_group: "investment_partnership,acceptance_from_customers",
      }).then((res: any) => setReceivableAccounts(res.data.items));
      getAccounts({
        page: 1,
        size: 100,
        type: "INCOME,REVENUE",
      }).then((res: any) => setIncomeAccounts(res.data.items));
    }
  }, [mounted]);
  const handleEditorChange = (e: any) => {
    setSetting({
      ...setting!,
      term_condition: e.target.getContent(),
    });
  };
  useEffect(() => {
    if (setting) {
      setRemainAllocation(
        100 -
          (setting.net_surplus_reserve +
            setting.net_surplus_mandatory_savings +
            setting.net_surplus_business_profit +
            setting.net_surplus_social_fund +
            setting.net_surplus_education_fund +
            setting.net_surplus_management +
            setting.net_surplus_other_funds)
      );
      setMax(
        100 -
          (setting.net_surplus_reserve +
            setting.net_surplus_mandatory_savings +
            setting.net_surplus_business_profit +
            setting.net_surplus_social_fund +
            setting.net_surplus_education_fund +
            setting.net_surplus_management +
            setting.net_surplus_other_funds)
      );
      setError(
        setting.net_surplus_reserve +
          setting.net_surplus_mandatory_savings +
          setting.net_surplus_business_profit +
          setting.net_surplus_social_fund +
          setting.net_surplus_education_fund +
          setting.net_surplus_management +
          setting.net_surplus_other_funds >
          100
          ? "Total tidak boleh melebihi 100%"
          : ""
      );
    }
  }, [setting]);
  useEffect(() => {}, []);
  const renderTerms = () => (
    <div className="rounded-lg border p-4">
      <div className="">
        <h3 className="font-bold text-lg mb-4">Loan Term</h3>
        <div className="flex flex-col space-y-4">
          <Editor
            apiKey={process.env.REACT_APP_TINY_MCE_KEY}
            init={{
              plugins:
                "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount ",
              toolbar:
                "closeButton saveButton aiButton | undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat ",

              menubar: "file edit view insert format tools table custom",
              menu: {
                custom: {
                  title: "Editor",
                  items: "closeButton saveButton",
                },
              },
            }}
            initialValue={setting?.term_condition ?? ""}
            onChange={handleEditorChange}
          />
        </div>
      </div>
    </div>
  );
  const renderAccounts = () => (
    <div className="rounded-lg border p-4">
      <div className="">
        <h3 className="font-bold text-lg mb-4">Accounts</h3>
        <div className="flex flex-col space-y-4">
          <div>
            <Label>Simpanan Pokok</Label>
            <Select
              options={equityAccounts.map((e) => ({
                value: e.id,
                label: e.name,
              }))}
              value={{
                value: setting?.principal_savings_account_id,
                label: setting?.principal_savings_account?.name,
              }}
              onChange={(val) => {
                let selected = equityAccounts.find((e) => e.id == val?.value);
                setSetting({
                  ...setting!,
                  principal_savings_account_id: val?.value!,
                  principal_savings_account: selected,
                });
              }}
            />
          </div>
          <div>
            <Label>Simpanan Wajib</Label>
            <Select
              options={equityAccounts.map((e) => ({
                value: e.id,
                label: e.name,
              }))}
              value={{
                value: setting?.mandatory_savings_account_id,
                label: setting?.mandatory_savings_account?.name,
              }}
              onChange={(val) => {
                let selected = equityAccounts.find((e) => e.id == val?.value);
                setSetting({
                  ...setting!,
                  mandatory_savings_account_id: val?.value!,
                  mandatory_savings_account: selected,
                });
              }}
            />
          </div>

          <div>
            <Label>Simpanan Sukarela</Label>
            <Select
              options={equityAccounts.map((e) => ({
                value: e.id,
                label: e.name,
              }))}
              value={{
                value: setting?.voluntary_savings_account_id,
                label: setting?.voluntary_savings_account?.name,
              }}
              onChange={(val) => {
                let selected = equityAccounts.find((e) => e.id == val?.value);
                setSetting({
                  ...setting!,
                  voluntary_savings_account_id: val?.value!,
                  voluntary_savings_account: selected,
                });
              }}
            />
          </div>
          <HR />
          <div>
            <Label>Piutang Pinjaman </Label>
            <Select
              options={receivableAccounts.map((e) => ({
                value: e.id,
                label: e.name,
              }))}
              value={{
                value: setting?.loan_account_id,
                label: setting?.loan_account?.name,
              }}
              onChange={(val) => {
                let selected = receivableAccounts.find(
                  (e) => e.id == val?.value
                );
                setSetting({
                  ...setting!,
                  loan_account_id: val?.value!,
                  loan_account: selected,
                });
              }}
            />
          </div>
          <div>
            <Label>Pendapatan Pinjaman </Label>
            <Select
              options={incomeAccounts.map((e) => ({
                value: e.id,
                label: e.name,
              }))}
              value={{
                value: setting?.loan_account_income_id,
                label: setting?.loan_account_income?.name,
              }}
              onChange={(val) => {
                let selected = incomeAccounts.find((e) => e.id == val?.value);
                setSetting({
                  ...setting!,
                  loan_account_income_id: val?.value!,
                  loan_account_income: selected,
                });
              }}
            />
          </div>
          <div>
            <Label>Biaya Admin </Label>
            <Select
              options={incomeAccounts.map((e) => ({
                value: e.id,
                label: e.name,
              }))}
              value={{
                value: setting?.loan_account_admin_fee_id,
                label: setting?.loan_account_admin_fee?.name,
              }}
              onChange={(val) => {
                let selected = incomeAccounts.find((e) => e.id == val?.value);
                setSetting({
                  ...setting!,
                  loan_account_admin_fee_id: val?.value!,
                  loan_account_admin_fee: selected,
                });
              }}
            />
          </div>
          <HR />
          <div>
            <Label>SHU Jasa Modal </Label>
            <Select
              options={equityAccounts.map((e) => ({
                value: e.id,
                label: e.name,
              }))}
              value={{
                value: setting?.net_surplus_mandatory_savings_account_id,
                label: setting?.net_surplus_mandatory_savings_account?.name,
              }}
              onChange={(val) => {
                let selected = equityAccounts.find((e) => e.id == val?.value);
                setSetting({
                  ...setting!,
                  net_surplus_mandatory_savings_account_id: val?.value!,
                  net_surplus_mandatory_savings_account: selected,
                });
              }}
            />
          </div>
          <div>
            <Label>SHU Jasa Usaha </Label>
            <Select
              options={equityAccounts.map((e) => ({
                value: e.id,
                label: e.name,
              }))}
              value={{
                value: setting?.net_surplus_business_profit_account_id,
                label: setting?.net_surplus_business_profit_account?.name,
              }}
              onChange={(val) => {
                let selected = equityAccounts.find((e) => e.id == val?.value);
                setSetting({
                  ...setting!,
                  net_surplus_business_profit_account_id: val?.value!,
                  net_surplus_business_profit_account: selected,
                });
              }}
            />
          </div>
          <div>
            <Label>SHU Dana Cadangan </Label>
            <Select
              options={equityAccounts.map((e) => ({
                value: e.id,
                label: e.name,
              }))}
              value={{
                value: setting?.net_surplus_reserve_account_id,
                label: setting?.net_surplus_reserve_account?.name,
              }}
              onChange={(val) => {
                let selected = equityAccounts.find((e) => e.id == val?.value);
                setSetting({
                  ...setting!,
                  net_surplus_reserve_account_id: val?.value!,
                  net_surplus_reserve_account: selected,
                });
              }}
            />
          </div>
          <div>
            <Label>SHU Dana Sosial </Label>
            <Select
              options={equityAccounts.map((e) => ({
                value: e.id,
                label: e.name,
              }))}
              value={{
                value: setting?.net_surplus_social_fund_account_id,
                label: setting?.net_surplus_social_fund_account?.name,
              }}
              onChange={(val) => {
                let selected = equityAccounts.find((e) => e.id == val?.value);
                setSetting({
                  ...setting!,
                  net_surplus_social_fund_account_id: val?.value!,
                  net_surplus_social_fund_account: selected,
                });
              }}
            />
          </div>
          <div>
            <Label>SHU Dana Pendidikan </Label>
            <Select
              options={equityAccounts.map((e) => ({
                value: e.id,
                label: e.name,
              }))}
              value={{
                value: setting?.net_surplus_education_fund_account_id,
                label: setting?.net_surplus_education_fund_account?.name,
              }}
              onChange={(val) => {
                let selected = equityAccounts.find((e) => e.id == val?.value);
                setSetting({
                  ...setting!,
                  net_surplus_education_fund_account_id: val?.value!,
                  net_surplus_education_fund_account: selected,
                });
              }}
            />
          </div>
          <div>
            <Label>SHU Dana Pengurus </Label>
            <Select
              options={equityAccounts.map((e) => ({
                value: e.id,
                label: e.name,
              }))}
              value={{
                value: setting?.net_surplus_management_account_id,
                label: setting?.net_surplus_management_account?.name,
              }}
              onChange={(val) => {
                let selected = equityAccounts.find((e) => e.id == val?.value);
                setSetting({
                  ...setting!,
                  net_surplus_management_account_id: val?.value!,
                  net_surplus_management_account: selected,
                });
              }}
            />
          </div>
          <div>
            <Label>SHU Dana Lainnya </Label>
            <Select
              options={equityAccounts.map((e) => ({
                value: e.id,
                label: e.name,
              }))}
              value={{
                value: setting?.net_surplus_other_funds_account_id,
                label: setting?.net_surplus_other_funds_account?.name,
              }}
              onChange={(val) => {
                let selected = equityAccounts.find((e) => e.id == val?.value);
                setSetting({
                  ...setting!,
                  net_surplus_other_funds_account_id: val?.value!,
                  net_surplus_other_funds_account: selected,
                });
              }}
            />
          </div>
          <HR />
          <div>
            <Label>Nominal Simpanan Pokok </Label>
            <CurrencyInput
              className="rs-input !p-1.5 "
              value={setting?.principal_savings_amount ?? 0}
              onValueChange={(_, __, val) => {
                setSetting({
                  ...setting!,
                  principal_savings_amount: val?.float ?? 0,
                });
              }}
            />
          </div>
          <div>
            <Label>Nominal Simpanan Wajib </Label>
            <CurrencyInput
              className="rs-input !p-1.5 "
              value={setting?.mandatory_savings_amount ?? 0}
              onValueChange={(_, __, val) => {
                setSetting({
                  ...setting!,
                  mandatory_savings_amount: val?.float ?? 0,
                });
              }}
            />
          </div>
          <div>
            <Label>Nominal Simpanan Sukarela </Label>
            <CurrencyInput
              className="rs-input !p-1.5 "
              value={setting?.voluntary_savings_amount ?? 0}
              onValueChange={(_, __, val) => {
                setSetting({
                  ...setting!,
                  voluntary_savings_amount: val?.float ?? 0,
                });
              }}
            />
            <small>Minimal</small>
          </div>
          {setting?.is_islamic ? (
            <div>
              <Label>Proyeksi Keuntungan Per Bulan (%) </Label>
              <CurrencyInput
                className="rs-input !p-1.5 "
                value={setting?.expected_profit_rate_per_month ?? 0}
                onValueChange={(_, __, val) => {
                  setSetting({
                    ...setting!,
                    expected_profit_rate_per_month: val?.float ?? 0,
                  });
                }}
              />
              <small>Minimal</small>
            </div>
          ) : (
            <div>
              <Label>Bunga Per Bulan (%) </Label>
              <CurrencyInput
                className="rs-input !p-1.5 "
                value={setting?.interest_rate_per_month ?? 0}
                onValueChange={(_, __, val) => {
                  setSetting({
                    ...setting!,
                    interest_rate_per_month: val?.float ?? 0,
                  });
                }}
              />
              <small>Minimal</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  const renderAllocation = () => (
    <div className="rounded-lg border p-4">
      <div className="">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg mb-4">Alokasi SHU</h3>
          <Button
            onClick={() => {
              setLoading(true);
              updateCooperativeSetting(setting)
                .then(() => toast.success("setting updated succesfully"))
                .catch(toast.error)
                .finally(() => {
                  setLoading(false);
                });
            }}
          >
            Update
          </Button>
        </div>
        <div className="flex flex-col space-y-4">
          <Chart
            style={{ borderRadius: "8px" }}
            chartType="PieChart"
            data={[
              ["Allocation", "Amount Percentage"],
              ["Jasa Usaha", setting?.net_surplus_business_profit],
              ["Jasa Modal", setting?.net_surplus_mandatory_savings],
              ["Dana Cadangan", setting?.net_surplus_reserve],
              ["Dana Sosial", setting?.net_surplus_social_fund],
              ["Dana Pendidikan", setting?.net_surplus_education_fund],
              ["Dana Pengurus", setting?.net_surplus_management],
              ["Dana Lainnya", setting?.net_surplus_other_funds],
            ]}
            options={{
              is3D: true,
              title: "Net Surplus Allocation",
            }}
            height={"400px"}
          />
          <div>
            <Label>Jasa Modal</Label>
            <TextInput
              rightIcon={TbPercentage}
              type="number"
              value={setting?.net_surplus_mandatory_savings ?? 0}
              onChange={(e) =>
                setSetting({
                  ...setting!,
                  net_surplus_mandatory_savings: Number(e.target.value),
                })
              }
              className="input-white"
            />
          </div>
          <div>
            <Label>Jasa Usaha</Label>
            <TextInput
              rightIcon={TbPercentage}
              type="number"
              value={setting?.net_surplus_business_profit ?? 0}
              onChange={(e) =>
                setSetting({
                  ...setting!,
                  net_surplus_business_profit: Number(e.target.value),
                })
              }
              className="input-white"
            />
          </div>
          <div>
            <Label>Dana Cadangan</Label>
            <TextInput
              rightIcon={TbPercentage}
              type="number"
              value={setting?.net_surplus_reserve ?? 0}
              onChange={(e) =>
                setSetting({
                  ...setting!,
                  net_surplus_reserve: Number(e.target.value),
                })
              }
              className="input-white"
            />
          </div>
          <div>
            <Label>Dana Sosial</Label>
            <TextInput
              rightIcon={TbPercentage}
              type="number"
              value={setting?.net_surplus_social_fund ?? 0}
              onChange={(e) =>
                setSetting({
                  ...setting!,
                  net_surplus_social_fund: Number(e.target.value),
                })
              }
              className="input-white"
            />
          </div>
          <div>
            <Label>Dana Pendidikan</Label>
            <TextInput
              rightIcon={TbPercentage}
              type="number"
              value={setting?.net_surplus_education_fund ?? 0}
              onChange={(e) =>
                setSetting({
                  ...setting!,
                  net_surplus_education_fund: Number(e.target.value),
                })
              }
              className="input-white"
            />
          </div>
          <div>
            <Label>Dana Pengurus</Label>
            <TextInput
              rightIcon={TbPercentage}
              type="number"
              value={setting?.net_surplus_management ?? 0}
              onChange={(e) =>
                setSetting({
                  ...setting!,
                  net_surplus_management: Number(e.target.value),
                })
              }
              className="input-white"
            />
          </div>
          <div>
            <Label>Dana Lainnya</Label>
            <TextInput
              rightIcon={TbPercentage}
              type="number"
              value={setting?.net_surplus_other_funds ?? 0}
              onChange={(e) =>
                setSetting({
                  ...setting!,
                  net_surplus_other_funds: Number(e.target.value),
                })
              }
              className="input-white"
            />
          </div>
          {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
          {remainAllocation > 0 && (
            <div>
              <Label>Remain Allocation</Label>
              <TextInput
                rightIcon={TbPercentage}
                type="number"
                value={remainAllocation}
                readOnly
                className="input-white"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
  const renderLoan = () => (
    <div className="rounded-lg border p-4">
      <h3 className="font-bold text-lg mb-4">Auto Number</h3>
      <div className="flex flex-col space-y-4">
        <div>
          <Label>Panjang Auto Number</Label>
          <TextInput
            type="number"
            value={setting?.auto_numeric_length ?? 0}
            onChange={(e) =>
              setSetting({
                ...setting!,
                auto_numeric_length: Number(e.target.value),
              })
            }
            className="input-white"
          />
        </div>
        <div>
          <Label>Format Nomor</Label>
          <div>
            <Textarea
              value={setting?.number_format}
              onChange={(val) =>
                setSetting({
                  ...setting!,
                  number_format: val.target.value,
                })
              }
              style={{
                backgroundColor: "white",
              }}
            />
          </div>
          <div className="flex flex-wrap">
            {AUTO_NUMERIC_FORMAL.map((e, i) => (
              <Badge
                className="m-1 cursor-pointer"
                key={i}
                style={{
                  backgroundColor: setting?.number_format.includes(e)
                    ? "magenta"
                    : "#dedede",
                  color: setting?.number_format.includes(e) ? "white" : "black",
                }}
                onClick={() => {
                  setSetting((prev) => ({
                    ...setting!,
                    number_format: `${prev?.number_format}${e}`,
                  }));
                }}
              >
                {e}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label>Panjang Random Karakter</Label>
          <TextInput
            type="number"
            value={setting?.random_character_length ?? 0}
            onChange={(e) =>
              setSetting({
                ...setting!,
                random_character_length: Number(e.target.value),
              })
            }
            className="input-white"
          />
        </div>
        <div>
          <Label>Panjang Random Nomber</Label>
          <TextInput
            type="number"
            value={setting?.random_numeric_length ?? 0}
            onChange={(e) =>
              setSetting({
                ...setting!,
                random_numeric_length: Number(e.target.value),
              })
            }
            className="input-white"
          />
        </div>

        <div>
          <Label>Loan Static Character</Label>
          <TextInput
            value={setting?.static_character ?? 0}
            onChange={(e) =>
              setSetting({
                ...setting!,
                static_character: e.target.value,
              })
            }
            className="input-white"
          />
        </div>
        <div>
          <Label>Saving Static Character</Label>
          <TextInput
            value={setting?.saving_static_character ?? 0}
            onChange={(e) =>
              setSetting({
                ...setting!,
                saving_static_character: e.target.value,
              })
            }
            className="input-white"
          />
        </div>
        <div>
          <Label>Net Surplus Static Character</Label>
          <TextInput
            value={setting?.net_surplus_static_character ?? 0}
            onChange={(e) =>
              setSetting({
                ...setting!,
                net_surplus_static_character: e.target.value,
              })
            }
            className="input-white"
          />
        </div>
      </div>
    </div>
  );
  return (
    <div className="flex flex-col gap-4 overflow-y-auto h-[calc(100vh-200px)] p-2">
      <h1 className="text-3xl font-bold">Cooperative Setting</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className=" flex flex-col space-y-4">
          {renderAccounts()}
          {renderLoan()}
        </div>
        <div className=" flex flex-col space-y-4">
          {renderAllocation()}
          {renderTerms()}
        </div>
      </div>
    </div>
  );
};
export default CooperativeSetting;
