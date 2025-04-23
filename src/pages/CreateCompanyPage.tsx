import { useContext, useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { getChartOfAccounts } from "../services/api/accountApi";
import {
  Button,
  Label,
  Textarea,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import { createCompany, getSectors } from "../services/api/companyApi";
import { CompanyCategoryModel, CompanySectorModel } from "../models/company";
import Select, { InputActionMeta } from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDistricts,
  getProvinces,
  getRegencies,
  getVillages,
} from "../services/api/regionalApi";
import { LoadingContext } from "../contexts/LoadingContext";
import toast from "react-hot-toast";
import { asyncStorage } from "../utils/async_storage";
import {
  LOCAL_STORAGE_COMPANIES,
  LOCAL_STORAGE_COMPANY_ID,
} from "../utils/constants";
interface CreateCompanyPageProps {}

const CreateCompanyPage: FC<CreateCompanyPageProps> = ({}) => {
  const nav = useNavigate();
  const { loading, setLoading } = useContext(LoadingContext);
  const { companyType } = useParams();
  const [mounted, setMounted] = useState(false);
  const [template, setTemplate] = useState("");
  const [sectors, setSectors] = useState<CompanySectorModel[]>([]);
  const [selectedSector, setSelectedSector] = useState<CompanySectorModel>();
  const [categories, setCategories] = useState<CompanyCategoryModel[]>([]);
  const [isIslamic, setIsIslamic] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [provinces, setProvinces] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedProvince, setSelectedProvince] = useState<{
    label: string;
    value: string;
  }>();
  const [regencies, setRegencies] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedRegency, setSelectedRegency] = useState<{
    label: string;
    value: string;
  }>();
  const [districts, setDistricts] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedDistrict, setSelectedDistrict] = useState<{
    label: string;
    value: string;
  }>();
  const [villages, setVillages] = useState<{ label: string; value: string }[]>(
    []
  );
  const [selectedVillage, setSelectedVillage] = useState<{
    label: string;
    value: string;
  }>();
  const [selectedCategory, setSelectedCategory] =
    useState<CompanyCategoryModel>();
  const [zipCode, setZipCode] = useState("");
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      getSectors().then((resp: any) => {
        setSectors(resp.data);
      });
      getProvinces().then((resp: any) => {
        setProvinces(
          resp.data.map((p: any) => ({ label: p.name, value: p.id }))
        );
      });
    }
  }, [mounted]);

  useEffect(() => {
    if (companyType == "cooperative") {
      setTemplate("cooperative");
    }
  }, [companyType]);
  useEffect(() => {
    getChartOfAccounts(template).then((resp: any) => {
      setAccounts(resp.data);
    });
  }, [template]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      let data = {
        name,
        address,
        email,
        phone,
        sector_id: selectedSector?.id!,
        company_category_id: selectedCategory?.id!,
        is_islamic: isIslamic,
        province_id: selectedProvince?.value!,
        regency_id: selectedRegency?.value!,
        district_id: selectedDistrict?.value!,
        village_id: selectedVillage?.value!,
        zip_code: zipCode,
        is_cooperation: companyType == "cooperative",
        accounts: accounts,
      };
      // console.log(data)
      // return
      let resp: any = await createCompany(data);
      toast.success("Company Created");

      await asyncStorage.setItem(LOCAL_STORAGE_COMPANY_ID, resp.data.id);
      await asyncStorage.setItem(
        LOCAL_STORAGE_COMPANIES,
        JSON.stringify(resp.companies)
      );
      nav(`/setting`);
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
  };

  const renderCreateCompany = () => {
    return (
      <div
        className="flex flex-row items-center justify-center h-full   w-full"
        style={{
          backgroundSize: "cover",
          backgroundImage:
            'url("https://images.unsplash.com/photo-1738251396922-b6ef53f67b72")',
          backgroundPosition: "center",
        }}
      >
        <div className="bg-white p-16 bg-opacity-50 rounded-lg shadow-md w-1/2">
          <div className="mb-8">
            <h2 className="text-lg font-bold">
              Create Company/Organization First
            </h2>
            <p>
              You need to create a company/organization first to access this
              page
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-16 rounded-lg shadow-lg min-h-[400px] flex space-y-8 flex-col justify-between items-center">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-center">
                  <img src="/logo-koperasi.jpg" alt="" className="w-12" />
                </div>
                <h2 className="text-lg font-bold text-center">Cooperative</h2>
                <p className="text-center">
                  A cooperative is a jointly owned business operated by its
                  members for their mutual benefit.
                </p>
              </div>
              <Button
                onClick={() => nav("/create/company/cooperative")}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Create Cooperative
              </Button>
            </div>
            <div className="bg-white p-16 rounded-lg shadow-lg min-h-[400px] flex space-y-8 flex-col justify-between items-center">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-center">
                  <img src="/sme.png" alt="" className="w-12" />
                </div>
                <h2 className="text-lg font-bold text-center">
                  Small Medium Enterprise
                </h2>
                <p className="text-center">
                  A business with fewer than 500 employees and annual revenues
                  of $1 million to $2.5 million.
                </p>
              </div>
              <Button
                onClick={() => nav("/create/company/sme")}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Create SME
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      {!companyType ? (
        renderCreateCompany()
      ) : (
        <div
          className="flex justify-center  h-[calc(100vh-65px)] bg-gray-50 dark:bg-gray-900 bg-no-repeat bg-cover w-full py-16"
          style={{
            backgroundSize: "cover",
            backgroundImage:
              'url("https://images.unsplash.com/photo-1738251396922-b6ef53f67b72")',
            backgroundPosition: "center",
          }}
        >
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/2 bg-opacity-70 overflow-y-auto">
          <h1 className="text-xl font-bold">
              Create {companyType == "cooperative" ? "Cooperative" : "Company"}
            </h1>
            <form className="flex flex-col space-y-8 my-8" onSubmit={onSubmit}>
              <div>
                <Label htmlFor="name">Name</Label>
                <TextInput
                  id="name"
                  type="text"
                  placeholder={
                    companyType == "cooperative"
                      ? "Cooperative Name"
                      : "Company Name"
                  }
                  className="mt-1"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="sector">Sector</Label>
                <Select
                  required
                  options={[
                    ...sectors
                      .filter((s) => {
                        if (companyType == "cooperative") {
                          return s.is_cooperative;
                        } else {
                          return !s.is_cooperative;
                        }
                      })
                      .map((s) => ({
                        value: s.id,
                        label: s.name,
                      })),
                    {
                      value: "other",
                      label: "Other",
                    },
                  ]}
                  onChange={(option) => {
                    let selected = sectors.find((s) => s.id === option?.value);
                    setSelectedSector(
                      selected || {
                        id: "other",
                        name: "Other",
                        categories: [],
                        is_cooperative: false,
                      }
                    );
                    setSelectedCategory(undefined);
                    setCategories(selected?.categories || []);
                  }}
                  value={
                    selectedSector
                      ? {
                          value: selectedSector.id,
                          label: selectedSector.name,
                        }
                      : null
                  }
                />
              </div>
              {categories.length > 0 && selectedSector?.id !== "other" && (
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    required
                    options={categories.map((s) => ({
                      value: s.id,
                      label: s.name,
                    }))}
                    onChange={(option) => {
                      let selected = categories.find(
                        (s) => s.id === option?.value
                      );
                      setSelectedCategory(selected);
                    }}
                    value={
                      selectedCategory
                        ? {
                            value: selectedCategory.id,
                            label: selectedCategory.name,
                          }
                        : null
                    }
                  />
                </div>
              )}
              {companyType == "cooperative" && (
                <div>
                  <ToggleSwitch
                    id="is_cooperative"
                    label="Shareea Cooperative"
                    checked={isIslamic}
                    onChange={(val) => {
                      setIsIslamic(val);
                      if (val) {
                        setTemplate("islamic-cooperative");
                      }
                    }}
                  />
                </div>
              )}
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  required
                  id="address"
                  rows={7}
                  placeholder={
                    companyType == "cooperative"
                      ? "Cooperative Address"
                      : "Company Address"
                  }
                  className="mt-1"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <TextInput
                  id="email"
                  type="email"
                  placeholder={"Email address"}
                  className="mt-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Phone</Label>
                <TextInput
                  id="phone"
                  type="text"
                  placeholder={"Phone Number"}
                  className="mt-1"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="province">Province</Label>
                <Select
                  required
                  options={provinces}
                  value={selectedProvince}
                  onChange={(option) => {
                    setSelectedProvince(option!);
                    getRegencies(option!.value).then((resp: any) => {
                      setRegencies(
                        resp.data.map((s: any) => ({
                          value: s.id,
                          label: s.name,
                        }))
                      );
                    });
                  }}
                />
              </div>
              <div>
                <Label htmlFor="regency">Regency</Label>
                <Select
                  required
                  options={regencies}
                  value={selectedRegency}
                  onChange={(option) => {
                    setSelectedRegency(option!);
                    getDistricts(option!.value).then((resp: any) => {
                      setDistricts(
                        resp.data.map((s: any) => ({
                          value: s.id,
                          label: s.name,
                        }))
                      );
                    });
                  }}
                />
              </div>
              <div>
                <Label htmlFor="district">District</Label>
                <Select
                  required
                  options={districts}
                  value={selectedDistrict}
                  onChange={(option) => {
                    setSelectedDistrict(option!);
                    getVillages(option!.value).then((resp: any) => {
                      setVillages(
                        resp.data.map((s: any) => ({
                          value: s.id,
                          label: s.name,
                        }))
                      );
                    });
                  }}
                />
              </div>
              <div>
                <Label htmlFor="village">Village</Label>
                <Select
                  required
                  options={villages}
                  value={selectedVillage}
                  onChange={(option) => {
                    setSelectedVillage(option!);
                  }}
                />
              </div>
              <div>
                <Label htmlFor="zip_code">Zip Code</Label>
                <TextInput
                  id="zip_code"
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder={
                    companyType == "cooperative"
                      ? "Cooperative Zip Code"
                      : "Company Zip Code"
                  }
                  className="mt-1"
                />
              </div>
              <Button type="submit">Save</Button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
export default CreateCompanyPage;
