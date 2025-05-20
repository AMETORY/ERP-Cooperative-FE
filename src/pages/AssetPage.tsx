import { useContext, useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import {
  Badge,
  Button,
  Datepicker,
  Label,
  Modal,
  Table,
  Textarea,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import { LuFilter } from "react-icons/lu";
import { AssetModel } from "../models/asset";
import { SearchContext } from "../contexts/SearchContext";
import { LoadingContext } from "../contexts/LoadingContext";
import { PaginationResponse } from "../objects/pagination";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createAsset, deleteAsset, getAssets } from "../services/api/assetApi";
import { getPagination, money } from "../utils/helper";
import Moment from "react-moment";
import { HiFire } from "react-icons/hi";
import CurrencyInput from "react-currency-input-field";
import { useTranslation } from "react-i18next";

interface AssetPageProps {}

const AssetPage: FC<AssetPageProps> = ({}) => {
  const { t, i18n } = useTranslation();

  const { search, setSearch } = useContext(SearchContext);
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);
  const [assets, setAssets] = useState<AssetModel[]>([]);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(1000);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const [selectedAccount, setSelectedAccount] = useState<AssetModel>();
  const nav = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [acquisition_cost, setAcquisitionCost] = useState<number>(0);
  const [is_depreciated, setIsDepreciated] = useState(false);
  const [asset_number, setAssetNumber] = useState<string>("");
  const [salvageValue, setSalvageValue] = useState<number>(0);
  const [lifetime, setLifetime] = useState<number>(0);

  const saveAsset = async () => {
    try {
      if (name === "") {
        toast.error("Name is required");
        return;
      }
      if (description === "") {
        toast.error("Description is required");
        return;
      }
      if (acquisition_cost <= 0) {
        toast.error("Acquisition Cost must be greater than 0");
        return;
      }
      if (is_depreciated) {
        if (lifetime <= 0) {
          toast.error("Lifetime must be greater than 0");
          return;
        }
      }
      setLoading(true);
      let resp: any = await createAsset({
        date: date.toISOString(),
        description: description,
        name: name,
        depreciation_method: "SLN",
        acquisition_cost: acquisition_cost,
        is_depreciation_asset: is_depreciated,
        asset_number: asset_number,
        salvage_value: salvageValue,
        life_time: lifetime,
      });
      toast.success("Asset created successfully");
      nav(`/asset/${resp.data.id}`);
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      getAllAssets();
    }
  }, [mounted, page, size, search]);

  const getAllAssets = () => {
    setLoading(true);
    getAssets({ page, size, search })
      .then((e: any) => {
        setAssets(e.data.items);
        setPagination(getPagination(e.data));
      })
      .catch((error) => {
        toast.error(`${error}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <AdminLayout permission="finance:asset:read">
      <div className="p-8 ">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold ">Asset</h1>
          <div className="flex items-center gap-2">
            <Button
              gradientDuoTone="purpleToBlue"
              pill
              onClick={() => {
                setShowModal(true);
              }}
            >
              + Create new asset
            </Button>
            <LuFilter
              className=" cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowFilter(true);
              }}
            />
          </div>
        </div>
        <div className="h-[calc(100vh-200px)] overflow-y-auto">
          <Table>
            <Table.Head>
              <Table.HeadCell>{t("date")}</Table.HeadCell>
              <Table.HeadCell>{t("asset_number")}</Table.HeadCell>
              <Table.HeadCell>{t("name")}</Table.HeadCell>
              <Table.HeadCell>{t("acquisition_cost")}</Table.HeadCell>
              <Table.HeadCell>{t("book_value")}</Table.HeadCell>
              <Table.HeadCell>{t("status")}</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {assets.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center">
                    No assets found.
                  </Table.Cell>
                </Table.Row>
              )}
              {assets.map((asset, i) => (
                <Table.Row
                  key={i}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    <Moment format="DD MMM YYYY">{asset.date}</Moment>
                  </Table.Cell>
                  <Table.Cell>{asset.asset_number}</Table.Cell>
                  <Table.Cell>{asset.name}</Table.Cell>
                  <Table.Cell>{money(asset.acquisition_cost)}</Table.Cell>
                  <Table.Cell>{money(asset.book_value)}</Table.Cell>
                  <Table.Cell>
                    <div className="w-fit">
                      <Badge
                        color={
                          asset.status === "ACTIVE"
                            ? "green"
                            : asset.status === "INACTIVE"
                            ? "red"
                            : "gray"
                        }
                      >
                        {asset.status}
                      </Badge>
                    </div>
                  </Table.Cell>

                  <Table.Cell width={200}>
                    <Link
                      to={`/asset/${asset.id}`}
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                    >
                      View
                    </Link>
                    <a
                      href="#"
                      className="font-medium text-red-600 hover:underline dark:text-red-500 ms-2"
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          window.confirm(
                            `Are you sure you want to delete asset ${asset.description}?`
                          )
                        ) {
                          deleteAsset(asset?.id!).then(() => {
                            getAllAssets();
                          });
                        }
                      }}
                    >
                      Delete
                    </a>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
      {showModal && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          aria-labelledby="create-asset-modal"
        >
          <Modal.Header>{t("create_new_asset")}</Modal.Header>
          <Modal.Body>
            <form>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="asset-title" value={t("date")} />
                  <Datepicker
                    value={date}
                    onChange={(val) => {
                      setDate(val!);
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="asset-asset_number" value={t("asset_number")} />
                  <TextInput
                    value={asset_number}
                    onChange={(e) => {
                      setAssetNumber(e.target.value);
                    }}
                    id="asset-asset_number"
                    placeholder={t("asset_number")}
                  />
                </div>

                <div>
                  <Label htmlFor="asset-name" value={t("asset_name")} />
                  <TextInput
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    id="asset-name"
                    placeholder={t("asset_name")}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="asset-acquisition_cost"
                    value={t("acquisition_cost")}
                  />
                  <CurrencyInput
                    value={acquisition_cost}
                    groupSeparator=","
                    decimalSeparator="."
                    onValueChange={(_, __, val) => {
                      setAcquisitionCost(val?.float ?? 0);
                    }}
                    id="asset-acquisition_cost"
                    placeholder={t("acquisition_cost")}
                    className="rs-input "
                  />
                </div>
                <div>
                  <Label htmlFor="asset-title" value={t("description")} />
                  <Textarea
                    rows={5}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    id="asset-description"
                    placeholder={t("description")}
                    required
                  />
                </div>
                <div>
                  <ToggleSwitch
                    id="asset-is_depreciation"
                    checked={is_depreciated}
                    onChange={(val) => {
                      setIsDepreciated(val);
                    }}
                    label={t("is_depreciated")}
                  />
                </div>
                {is_depreciated && (
                  <>
                    <div>
                      <Label htmlFor="asset-lifetime" value={t("lifetime")} />
                      <TextInput
                        value={lifetime}
                        onChange={(e) => {
                          setLifetime(Number(e.target.value));
                        }}
                        id="asset-lifetime"
                        placeholder={t("lifetime")}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="asset-salvage_value"
                        value={t("salvage_value")}
                      />
                      <CurrencyInput
                        value={salvageValue}
                        groupSeparator=","
                        decimalSeparator="."
                        onValueChange={(_, __, val) => {
                          setSalvageValue(val?.float ?? 0);
                        }}
                        id="asset-salvage_value"
                        placeholder={t("salvage_value")}
                        className="rs-input"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="mt-16"></div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex justify-end w-full">
              <Button onClick={saveAsset}>{t("save")}</Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </AdminLayout>
  );
};
export default AssetPage;
