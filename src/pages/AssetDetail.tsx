import { useContext, useEffect, useState, type FC } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/layouts/admin";
import { LoadingContext } from "../contexts/LoadingContext";
import { AssetModel, DepreciationCostModel } from "../models/asset";
import {
  activateAsset,
  depreciationApplyAsset,
  getAssetDetail,
  getAssetPreview,
} from "../services/api/assetApi";
import Moment from "react-moment";
import { generateUUID, money } from "../utils/helper";
import { BsCheck2Circle } from "react-icons/bs";
import {
  Badge,
  Button,
  Checkbox,
  Datepicker,
  Table,
  ToggleSwitch,
} from "flowbite-react";
import Select from "react-select";
import { depreciationOptions } from "../utils/constants";
import { getAccounts } from "../services/api/accountApi";
import { AccountModel } from "../models/account";
import toast from "react-hot-toast";
import moment from "moment";
import { useTranslation } from "react-i18next";

interface AssetDetailProps {}

const AssetDetail: FC<AssetDetailProps> = ({}) => {
  const { t } = useTranslation();
  const { assetId } = useParams();
  const { loading, setLoading } = useContext(LoadingContext);
  const [mounted, setMounted] = useState(false);
  const [asset, setAsset] = useState<AssetModel>();
  const [showModal, setShowModal] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [depreciationCosts, setDepreciationCosts] = useState<
    DepreciationCostModel[]
  >([]);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [fixedAccounts, setFixedAccounts] = useState<AccountModel[]>([]);
  const [assetAccounts, setAssetAccounts] = useState<AccountModel[]>([]);
  const [depreciationAccounts, setDepreciationAccounts] = useState<
    AccountModel[]
  >([]);
  const [accumulationAccounts, setAccumulationAccounts] = useState<
    AccountModel[]
  >([]);
  const [currentAssetType, setCurrentAssetType] = useState("CASH");

  useEffect(() => {
    if (mounted && assetId) {
      getDetail();
      getAccounts({
        page: 1,
        size: 1000,
        search: "",
        type: "ASSET",
        cashflow_group: "fixed_asset",
      }).then((e: any) => {
        setFixedAccounts(e.data.items);
      });
      getAccounts({
        page: 1,
        size: 1000,
        search: "",
        type: "CONTRA_ASSET",
      }).then((e: any) => {
        setAccumulationAccounts(e.data.items);
      });
      getAccounts({
        page: 1,
        size: 1000,
        search: "",
        type: "EXPENSE",
        // cashflow_group: "fixed_asset",
      }).then((e: any) => {
        setDepreciationAccounts(e.data.items);
      });
      getAccounts({
        page: 1,
        size: 1000,
        search: "",
        type: "ASSET,EQUITY",
        cashflow_sub_group: "cash_bank,equity_capital",
      }).then((e: any) => {
        setAssetAccounts(e.data.items);
      });
    }
  }, [mounted, assetId]);

  const getDetail = () => {
    getAssetDetail(assetId!).then((resp: any) => {
      setAsset(resp.data);
      setIsEditable(resp.data.status == "DRAFT");
    });
  };

  let balance = asset?.acquisition_cost ?? 0;

  // const getSourceAccounts = async (s: string) => {
  //   try {
  //     let resp: any = await getAccounts({ page: 1, size: 20, search: s });
  //     setSourceAccounts(resp.data.items);
  //   } catch (error) {
  //     toast.error(`${error}`);
  //   }
  // };

  useEffect(() => {
    if (!asset) return;
  }, [asset, depreciationCosts]);

  return (
    <AdminLayout permission="finance:asset:update">
      <div className="p-8 h-[calc(100vh-60px)]  overflow-y-auto space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-4">Info</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 w-1/2"></th>
                  <th className="px-4 py-2 w-1/2"></th>
                </tr>
              </thead>
              <tbody className="">
                <tr>
                  <td className="px-2 py-2 font-semibold">{t("asset_number")}</td>
                  <td className="px-2 py-2">{asset?.asset_number}</td>
                </tr>
                <tr>
                  <td className="px-2 py-2 font-semibold">{t("name")}</td>
                  <td className="px-2 py-2">{asset?.name}</td>
                </tr>

                <tr>
                  <td className="px-2 py-2 font-semibold">{t("description")}</td>
                  <td className="px-2 py-2">{asset?.description}</td>
                </tr>
                <tr>
                  <td className="px-2 py-2 font-semibold">{t("date")}</td>
                  <td className="px-2 py-2">
                    {isEditable ? (
                      <Datepicker
                        value={moment(asset?.date).toDate()}
                        onChange={(e) => {
                          setAsset((prev) => ({ ...prev!, date: e! }));
                        }}
                      />
                    ) : (
                      <Moment format="DD MMM YYYY">{asset?.date}</Moment>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-2 font-semibold">{t("acquisition_cost")}</td>
                  <td className="px-2 py-2">
                    {money(asset?.acquisition_cost)}
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-1 font-semibold">
                    {t("cash_equity_account")}
                  </td>
                  <td className="px-2 py-1">
                    {isEditable ? (
                      <Select
                        options={assetAccounts.map((v) => ({
                          label: v.name,
                          value: v.id,
                          type: v.type,
                        }))}
                        value={{
                          label: asset?.account_current_asset?.name,
                          value: asset?.account_current_asset?.id,
                          type: asset?.account_current_asset?.type,
                        }}
                        onChange={(e) => {
                          setAsset({
                            ...asset!,
                            account_current_asset_id: e!.value!,
                            account_current_asset: assetAccounts.find(
                              (v) => v.id === e!.value
                            ),
                          });
                          setCurrentAssetType(
                            assetAccounts.find((v) => v.id == e!.value)!.type ==
                              "ASSET"
                              ? "CASH"
                              : "EQUITY"
                          );
                          getAssetPreview(
                            asset!.id!,
                            asset!.depreciation_method,
                            asset!.is_monthly
                          ).then((resp: any) => {
                            setDepreciationCosts(
                              resp.data.map((e: any) => ({
                                ...e,
                                id: generateUUID(),
                              }))
                            );
                          });
                        }}
                        formatOptionLabel={(option) => (
                          <div className="flex justify-between">
                            <span className="text-sm">{option.label}</span>
                            {option.type && (
                              <span
                                className="text-[8pt] text-white rounded-lg px-2 py-0.5 w-fit h-fit"
                                style={{
                                  backgroundColor:
                                    option.type == "ASSET"
                                      ? "#8BC34A"
                                      : "#F56565",
                                }}
                              >
                                {option.type == "ASSET" ? "CASH" : "EQUITY"}
                              </span>
                            )}
                          </div>
                        )}
                      />
                    ) : (
                      <div>{asset?.account_current_asset?.name}</div>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-1 font-semibold">
                    {t("fixed_asset_account")}
                  </td>
                  <td className="px-2 py-1">
                    {isEditable ? (
                      <Select
                        options={fixedAccounts.map((v) => ({
                          label: v.name,
                          value: v.id,
                          type: v.type,
                        }))}
                        value={{
                          label: asset?.account_fixed_asset?.name,
                          value: asset?.account_fixed_asset?.id,
                          type: asset?.account_fixed_asset?.type,
                        }}
                        onChange={(e) => {
                          setAsset({
                            ...asset!,
                            account_fixed_asset_id: e!.value!,
                            account_fixed_asset: fixedAccounts.find(
                              (v) => v.id === e!.value
                            ),
                          });
                        }}
                      />
                    ) : (
                      <div>{asset?.account_fixed_asset?.name}</div>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-1 font-semibold">{t("status")}</td>
                  <td className="px-2 py-1">
                    <div className="w-fit">
                      <Badge
                        color={
                          asset?.status === "DRAFT"
                            ? "gray"
                            : asset?.status === "ACTIVE"
                            ? "success"
                            : asset?.status === "REJECTED"
                            ? "danger"
                            : asset?.status === "DISTRIBUTED"
                            ? "blue"
                            : asset?.status === "SETTLEMENT"
                            ? "indigo"
                            : "gray"
                        }
                      >
                        {asset?.status}
                      </Badge>
                    </div>
                  </td>
                </tr>
                {isEditable && asset?.is_depreciation_asset && (
                  <tr>
                    <td className="px-2 py-1 font-semibold">
                      <Button
                        onClick={async () => {
                          if (!asset?.account_current_asset_id) {
                            toast.error(
                              "Please select a current asset account"
                            );
                            return;
                          }
                          if (!asset?.account_fixed_asset_id) {
                            toast.error("Please select a fixed asset account");
                            return;
                          }
                          if (!asset?.account_depreciation_id) {
                            toast.error("Please select a depreciation account");
                            return;
                          }
                          if (!asset?.account_accumulated_depreciation_id) {
                            toast.error(
                              "Please select a accumulated depreciation account"
                            );
                            return;
                          }

                          if (depreciationCosts.length == 0) {
                            toast.error("Please add depreciation costs");
                            return;
                          }

                          let data = {
                            date: asset?.date,
                            account_current_asset_id:
                              asset?.account_current_asset_id,
                            account_fixed_asset_id:
                              asset?.account_fixed_asset_id,
                            account_depreciation_id:
                              asset?.account_depreciation_id,
                            account_accumulated_depreciation_id:
                              asset?.account_accumulated_depreciation_id,
                            depreciation_costs: depreciationCosts,
                            is_monthly: asset?.is_monthly,
                            depreciation_method: asset?.depreciation_method,
                          };

                          try {
                            setLoading(true);
                            await activateAsset(asset!.id!, data);
                            getDetail();
                          } catch (error) {
                            toast.error(`${error}`);
                          } finally {
                            setLoading(false);
                          }
                        }}
                      >
                        Activate
                      </Button>
                    </td>
                  </tr>
                )}
                {/* Add more rows as needed for other asset details */}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-white rounded shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-4">{t("depreciation_info")}</h3>
            {!asset?.is_depreciation_asset && t("asset_not_depreciated")}

            {asset?.is_depreciation_asset && (
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 w-1/2"></th>
                    <th className="px-4 py-2 w-1/2"></th>
                  </tr>
                </thead>
                <tbody className="">
                  <tr>
                    <td className="px-2 py-1 font-semibold">{t("lifetime")}</td>
                    <td className="px-2 py-1">{asset?.life_time} {t("year")}</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1 font-semibold">
                      {t("depreciation_method")}
                    </td>
                    <td className="px-2 py-1">
                      {isEditable ? (
                        <Select
                          options={depreciationOptions}
                          value={depreciationOptions.find(
                            (v) => v.value == asset?.depreciation_method
                          )}
                          onChange={(e) => {
                            setAsset({
                              ...asset,
                              depreciation_method: e!.value!,
                            });
                            getAssetPreview(
                              asset!.id!,
                              e!.value!,
                              asset!.is_monthly
                            ).then((resp: any) => {
                              setDepreciationCosts(
                                resp.data.map((e: any) => ({
                                  ...e,
                                  id: generateUUID(),
                                }))
                              );
                            });
                          }}
                        />
                      ) : (
                        depreciationOptions.find(
                          (v) => v.value == asset?.depreciation_method
                        )?.label
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td className="px-2 py-1 font-semibold">
                      {t("depreciation_account")}
                    </td>
                    <td className="px-2 py-1">
                      {isEditable ? (
                        <Select
                          options={depreciationAccounts.map((v) => ({
                            label: v.name,
                            value: v.id,
                          }))}
                          value={{
                            label: asset?.account_depreciation?.name,
                            value: asset?.account_depreciation?.id,
                          }}
                          onChange={(e) => {
                            setAsset({
                              ...asset,
                              account_depreciation_id: e!.value!,
                              account_depreciation: depreciationAccounts.find(
                                (v) => v.id == e!.value!
                              ),
                            });
                          }}
                        />
                      ) : (
                        <div>{asset?.account_depreciation?.name}</div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1 font-semibold">
                      {t("accumulated_depreciation_account")}
                    </td>
                    <td className="px-2 py-1">
                      {isEditable ? (
                        <Select
                          options={accumulationAccounts.map((v) => ({
                            label: v.name,
                            value: v.id,
                          }))}
                          value={{
                            label:
                              asset?.account_accumulated_depreciation?.name,
                            value: asset?.account_accumulated_depreciation?.id,
                          }}
                          onChange={(e) => {
                            setAsset({
                              ...asset,
                              account_accumulated_depreciation_id: e!.value!,
                              account_accumulated_depreciation:
                                accumulationAccounts.find(
                                  (v) => v.id == e!.value!
                                ),
                            });
                          }}
                        />
                      ) : (
                        <div>
                          {asset?.account_accumulated_depreciation?.name}
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1 font-semibold">
                      {t("is_monthly")}
                    </td>
                    <td className="px-2 py-1">
                      {isEditable ? (
                        <ToggleSwitch
                          checked={asset?.is_monthly}
                          onChange={(e) => {
                            setAsset({
                              ...asset,
                              is_monthly: e,
                            });
                            getAssetPreview(
                              asset!.id!,
                              asset!.depreciation_method,
                              e
                            ).then((resp: any) => {
                              setDepreciationCosts(
                                resp.data.map((e: any) => ({
                                  ...e,
                                  id: generateUUID(),
                                }))
                              );
                            });
                          }}
                        />
                      ) : (
                        <div>
                          {asset?.is_monthly ? (
                            <BsCheck2Circle className="text-green-500" />
                          ) : (
                            t("no")
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-2 py-2 font-semibold">
                      {t("salvage_value")}
                    </td>
                    <td className="px-2 py-2">{money(asset?.salvage_value)}</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-2 font-semibold">
                      {t("book_value")}
                    </td>
                    <td className="px-2 py-2">{money(asset?.book_value)}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
        {!isEditable && (
          <div className="p-4 bg-white rounded shadow hover:shadow-lg transition-shadow">
            <div className="flex justify-between mb-4">
              <h4 className="font-semibold text-2xl ">{t("depreciation")}</h4>
              {(asset?.depreciations ?? []).map((e) => e.is_checked).length >
                0 && (
                <Button
                  size="xs"
                  color="purple"
                  onClick={async () => {
                    if (
                      !window.confirm(
                        "Are you sure you want to apply this depreciation?"
                      )
                    ) {
                      return;
                    }

                    for (const element of asset?.depreciations ?? []) {
                      try {
                        setLoading(true);
                        if (element.is_checked) {
                          await depreciationApplyAsset(asset?.id!, element.id);
                        }
                      } catch (error) {
                        toast.error(
                          "Failed to apply depreciation #" + element.seq_number
                        );
                      } finally {
                        setLoading(false);
                      }
                    }
                    getDetail();
                  }}
                >
                  {t('apply_depreciation')}
                </Button>
              )}
            </div>
            <Table striped>
              <Table.Head>
                <Table.HeadCell>
                  <div className="flex gap-2">
                    <Checkbox
                      checked={(asset?.depreciations ?? [])
                        .filter((v) => v.status == "ACTIVE")
                        .every((v) => v.is_checked)}
                      onChange={(e) => {
                        setAsset({
                          ...asset!,
                          depreciations: (asset?.depreciations ?? []).map(
                            (v) => ({
                              ...v,
                              is_checked:
                                v.status == "ACTIVE" ? e.target.checked : false,
                            })
                          ),
                        });
                      }}
                    />
                    <span>No</span>
                  </div>
                </Table.HeadCell>
                <Table.HeadCell>Tahun</Table.HeadCell>
                <Table.HeadCell>Bulan</Table.HeadCell>
                <Table.HeadCell>Penyusutan</Table.HeadCell>
                <Table.HeadCell>Nilai Buku</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell style={{ width: "60px" }}></Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {(asset?.depreciations ?? []).map((item, index) => {
                  balance -= item.amount;
                  return (
                    <Table.Row key={index}>
                      <Table.Cell>
                        <div className="flex gap-2">
                          <Checkbox
                            disabled={item.status != "ACTIVE"}
                            checked={item.is_checked}
                            onChange={(e) => {
                              item.is_checked = e.target.checked;
                              setDepreciationCosts((prev) => {
                                let total = prev
                                  .filter((v) => v.is_checked)
                                  .map((v) => v.amount)
                                  .reduce((a, b) => a + b, 0);
                                setAsset({
                                  ...asset!,
                                  book_value: asset!.acquisition_cost! - total,
                                });
                                return [
                                  ...depreciationCosts.map((v) => {
                                    if (v.id == item.id) {
                                      return item;
                                    }
                                    return v;
                                  }),
                                ];
                              });
                            }}
                          />

                          <span>{item.seq_number}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <span>
                          {moment(asset?.date)
                            .add(item.period - 1, "years")
                            .format("YYYY")}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        {" "}
                        {item.month > 0 && (
                          <span>
                            {moment(asset?.date)
                              .add(item.period - 1, "years")
                              .add(item.month - 1, "months")
                              .format("MMMM")}
                          </span>
                        )}
                      </Table.Cell>
                      <Table.Cell>{money(item.amount, 0)}</Table.Cell>
                      <Table.Cell>{money(balance, 0)}</Table.Cell>
                      <Table.Cell>
                        <div className="w-fit">
                          <Badge
                            color={
                              item.status === "PENDING"
                                ? "gray"
                                : item?.status === "ACTIVE"
                                ? "blue"
                                : item?.status === "DONE"
                                ? "green"
                                : "gray"
                            }
                          >
                            {item?.status}
                          </Badge>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        {item.status == "ACTIVE" && (
                          <Button
                            size="xs"
                            color="purple"
                            onClick={async () => {
                              if (
                                !window.confirm(
                                  "Are you sure you want to apply this depreciation?"
                                )
                              ) {
                                return;
                              }
                              try {
                                setLoading(true);
                                await depreciationApplyAsset(
                                  asset?.id!,
                                  item.id
                                );
                                getDetail();
                              } catch (error) {
                                toast.error(
                                  "Failed to apply depreciation #" +
                                    item.seq_number
                                );
                              } finally {
                                setLoading(false);
                              }
                            }}
                          >
                            Apply
                          </Button>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
            {currentAssetType == "EQUITY" && (
              <small className="italic">
                {"*) Check if item is already depreciated"}
              </small>
            )}
          </div>
        )}
        {isEditable && (
          <div className="p-4 bg-white rounded shadow hover:shadow-lg transition-shadow">
            <Table striped>
              <Table.Head>
                <Table.HeadCell>
                  <div className="flex gap-2">
                    {currentAssetType == "EQUITY" && (
                      <Checkbox
                        checked={depreciationCosts.every((v) => v.is_checked)}
                        onChange={(e) => {
                          setDepreciationCosts((prev) => {
                            // setAsset({
                            //   ...asset!,
                            //   book_value: asset!.acquisition_cost! - total,
                            // });
                            return depreciationCosts.map((v) => ({
                              ...v,
                              is_checked: e.target.checked,
                            }));
                          });

                          if (e.target.checked) {
                            let total = depreciationCosts
                              .map((v) => v.amount)
                              .reduce((a, b) => a + b, 0);
                            setAsset({
                              ...asset!,
                              book_value: asset!.acquisition_cost! - total,
                            });
                          }
                        }}
                      />
                    )}
                    <span>No</span>
                  </div>
                </Table.HeadCell>
                <Table.HeadCell>Tahun</Table.HeadCell>
                <Table.HeadCell>Bulan</Table.HeadCell>
                <Table.HeadCell>Penyusutan</Table.HeadCell>
                <Table.HeadCell>Nilai Buku</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {depreciationCosts.map((item, index) => {
                  balance -= item.amount;
                  return (
                    <Table.Row key={index}>
                      <Table.Cell>
                        <div className="flex gap-2">
                          {currentAssetType == "EQUITY" && (
                            <Checkbox
                              checked={item.is_checked}
                              onChange={(e) => {
                                item.is_checked = e.target.checked;
                                setDepreciationCosts((prev) => {
                                  let total = prev
                                    .filter((v) => v.is_checked)
                                    .map((v) => v.amount)
                                    .reduce((a, b) => a + b, 0);
                                  setAsset({
                                    ...asset!,
                                    book_value:
                                      asset!.acquisition_cost! - total,
                                  });
                                  return [
                                    ...depreciationCosts.map((v) => {
                                      if (v.id == item.id) {
                                        return item;
                                      }
                                      return v;
                                    }),
                                  ];
                                });
                              }}
                            />
                          )}
                          <span>{item.seq_number}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>{item.period}</Table.Cell>
                      <Table.Cell>{item.month}</Table.Cell>
                      <Table.Cell>{money(item.amount, 0)}</Table.Cell>
                      <Table.Cell>{money(balance, 0)}</Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
            {currentAssetType == "EQUITY" && (
              <small className="italic">
                {"*) Check if item is already depreciated"}
              </small>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
export default AssetDetail;
