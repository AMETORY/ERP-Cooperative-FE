import { useContext, useEffect, useState, type FC } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/layouts/admin";
import { LoadingContext } from "../contexts/LoadingContext";
import { AssetModel } from "../models/asset";
import { getAssetDetail } from "../services/api/assetApi";
import Moment from "react-moment";
import { money } from "../utils/helper";
import { BsCheck2Circle } from "react-icons/bs";

interface AssetDetailProps {}

const AssetDetail: FC<AssetDetailProps> = ({}) => {
  const { assetId } = useParams();
  const { loading, setLoading } = useContext(LoadingContext);
  const [mounted, setMounted] = useState(false);
  const [asset, setAsset] = useState<AssetModel>();
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && assetId) {
      getAssetDetail(assetId!).then((resp: any) => {
        setAsset(resp.data);
      });
    }
  }, [mounted, assetId]);

  // const getSourceAccounts = async (s: string) => {
  //   try {
  //     let resp: any = await getAccounts({ page: 1, size: 20, search: s });
  //     setSourceAccounts(resp.data.items);
  //   } catch (error) {
  //     toast.error(`${error}`);
  //   }
  // };

  return (
    <AdminLayout permission="finance:asset:update">
      <div className="p-8 h-[calc(100vh-60px)]  overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-4">Info</h3>
            <table className="w-full">
              <tbody className="">
                <tr>
                  <td className="px-2 py-1 font-semibold">Asset Number</td>
                  <td className="px-2 py-1">{asset?.asset_number}</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 font-semibold">Name</td>
                  <td className="px-2 py-1">{asset?.name}</td>
                </tr>

                <tr>
                  <td className="px-2 py-1 font-semibold">Description</td>
                  <td className="px-2 py-1">{asset?.description}</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 font-semibold">Date</td>
                  <td className="px-2 py-1">
                    <Moment format="DD MMM YYYY">{asset?.date}</Moment>
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-1 font-semibold">Acquisition Cost</td>
                  <td className="px-2 py-1">
                    {money(asset?.acquisition_cost)}
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-1 font-semibold">Status</td>
                  <td className="px-2 py-1">{asset?.status}</td>
                </tr>
                {/* Add more rows as needed for other asset details */}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-white rounded shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-4">Depreciation Info</h3>
            {!asset?.is_depreciation_asset && "This asset is not depreciated."}

            {asset?.is_depreciation_asset && (
              <table className="w-full">
                <tbody className="">
                  <tr>
                    <td className="px-2 py-1 font-semibold">Lifetime</td>
                    <td className="px-2 py-1">{asset?.life_time} year</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1 font-semibold">Depreciation Method</td>
                    <td className="px-2 py-1">{asset?.depreciation_method}</td>
                  </tr>

                  <tr>
                    <td className="px-2 py-1 font-semibold">Depreciation Account</td>
                    <td className="px-2 py-1">{asset?.account_depreciation?.name}</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1 font-semibold">Accumulated Depreciation Account</td>
                    <td className="px-2 py-1">{asset?.account_accumulated_depreciation?.name}</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1 font-semibold">Is Monthly</td>
                    <td className="px-2 py-1">
                      {asset?.is_monthly ? <BsCheck2Circle  className="text-green-500" /> : "No"}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1 font-semibold">
                      Salvage Value
                    </td>
                    <td className="px-2 py-1">
                      {money(asset?.salvage_value)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1 font-semibold">
                      Book Value
                    </td>
                    <td className="px-2 py-1">
                      {money(asset?.book_value)}
                    </td>
                  </tr>
                  {/* Add more rows as needed for other asset details */}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default AssetDetail;
