import type { FC } from "react";
import { CompanyModel, CompanySetting } from "../models/company";
import { Badge, Button, Label, Textarea, TextInput } from "flowbite-react";
import { AUTO_NUMERIC_FORMAL } from "../utils/constants";

interface MiscSettingProps {
  setting?: CompanyModel | null;
  setSetting: (setting: CompanyModel) => void;
  onSave: () => void;
}

const MiscSetting: FC<MiscSettingProps> = ({ setting, setSetting, onSave }) => {
  return (
    <div className="h-[calc(100vh-200px)] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
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
              <Label>Panjang Random Number</Label>
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
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-bold text-lg mb-4">Sales</h3>
          <div>
            <Label>Karakter Statis</Label>
            <TextInput
              value={setting?.sales_static_character ?? 0}
              onChange={(e) =>
                setSetting({
                  ...setting!,
                  sales_static_character: e.target.value,
                })
              }
              className="input-white"
            />
          </div>
          <div>
            <Label>Format Nomor</Label>
            <div>
              <Textarea
                value={setting?.sales_format}
                onChange={(val) =>
                  setSetting({
                    ...setting!,
                    sales_format: val.target.value,
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
                    backgroundColor: setting?.sales_format?.includes(e)
                      ? "magenta"
                      : "#dedede",
                    color: setting?.sales_format?.includes(e)
                      ? "white"
                      : "black",
                  }}
                  onClick={() => {
                    let v = setting?.sales_format ?? "";
                    if (v.includes(e)) {
                      v = v.replace(e, "");
                    } else {
                      v += e;
                    }
                    setSetting({
                      ...setting!,
                      sales_format: v,
                    });
                  }}
                >
                  {e}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-bold text-lg mb-4">Sales Quote</h3>
          <div>
            <Label>Karakter Statis</Label>
            <TextInput
              value={setting?.sales_quote_static_character ?? 0}
              onChange={(e) =>
                setSetting({
                  ...setting!,
                  sales_quote_static_character: e.target.value,
                })
              }
              className="input-white"
            />
          </div>
          <div>
            <Label>Format Nomor</Label>
            <div>
              <Textarea
                value={setting?.sales_quote_format}
                onChange={(val) =>
                  setSetting({
                    ...setting!,
                    sales_quote_format: val.target.value,
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
                    backgroundColor: setting?.sales_quote_format?.includes(e)
                      ? "magenta"
                      : "#dedede",
                    color: setting?.sales_quote_format?.includes(e)
                      ? "white"
                      : "black",
                  }}
                  onClick={() => {
                    let v = setting?.sales_quote_format ?? "";
                    if (v.includes(e)) {
                      v = v.replace(e, "");
                    } else {
                      v += e;
                    }
                    setSetting({
                      ...setting!,
                      sales_quote_format: v,
                    });
                  }}
                >
                  {e}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-bold text-lg mb-4">Sales Return</h3>
          <div>
            <Label>Karakter Statis</Label>
            <TextInput
              value={setting?.sales_return_static_character ?? 0}
              onChange={(e) =>
                setSetting({
                  ...setting!,
                  sales_return_static_character: e.target.value,
                })
              }
              className="input-white"
            />
          </div>
          <div>
            <Label>Format Nomor</Label>
            <div>
              <Textarea
                value={setting?.sales_return_format}
                onChange={(val) =>
                  setSetting({
                    ...setting!,
                    sales_return_format: val.target.value,
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
                    backgroundColor: setting?.sales_return_format?.includes(e)
                      ? "magenta"
                      : "#dedede",
                    color: setting?.sales_return_format?.includes(e)
                      ? "white"
                      : "black",
                  }}
                  onClick={() => {
                    let v = setting?.sales_return_format ?? "";
                    if (v.includes(e)) {
                      v = v.replace(e, "");
                    } else {
                      v += e;
                    }
                    setSetting({
                      ...setting!,
                      sales_return_format: v,
                    });
                  }}
                >
                  {e}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-bold text-lg mb-4">Delivery Order</h3>
          <div>
            <Label>Karakter Statis</Label>
            <TextInput
              value={setting?.delivery_static_character ?? 0}
              onChange={(e) =>
                setSetting({
                  ...setting!,
                  delivery_static_character: e.target.value,
                })
              }
              className="input-white"
            />
          </div>
          <div>
            <Label>Format Nomor</Label>
            <div>
              <Textarea
                value={setting?.delivery_format}
                onChange={(val) =>
                  setSetting({
                    ...setting!,
                    delivery_format: val.target.value,
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
                    backgroundColor: setting?.delivery_format?.includes(e)
                      ? "magenta"
                      : "#dedede",
                    color: setting?.delivery_format?.includes(e)
                      ? "white"
                      : "black",
                  }}
                  onClick={() => {
                    let v = setting?.delivery_format ?? "";
                    if (v.includes(e)) {
                      v = v.replace(e, "");
                    } else {
                      v += e;
                    }
                    setSetting({
                      ...setting!,
                      delivery_format: v,
                    });
                  }}
                >
                  {e}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-bold text-lg mb-4">Purchase</h3>
          <div>
            <Label>Karakter Statis</Label>
            <TextInput
              value={setting?.purchase_static_character ?? 0}
              onChange={(e) =>
                setSetting({
                  ...setting!,
                  purchase_static_character: e.target.value,
                })
              }
              className="input-white"
            />
          </div>
          <div>
            <Label>Format Nomor</Label>
            <div>
              <Textarea
                value={setting?.purchase_format}
                onChange={(val) =>
                  setSetting({
                    ...setting!,
                    purchase_format: val.target.value,
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
                    backgroundColor: setting?.purchase_format?.includes(e)
                      ? "magenta"
                      : "#dedede",
                    color: setting?.purchase_format?.includes(e)
                      ? "white"
                      : "black",
                  }}
                  onClick={() => {
                    let v = setting?.purchase_format ?? "";
                    if (v.includes(e)) {
                      v = v.replace(e, "");
                    } else {
                      v += e;
                    }
                    setSetting({
                      ...setting!,
                      purchase_format: v,
                    });
                  }}
                >
                  {e}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-bold text-lg mb-4">Purchase Order</h3>
          <div>
            <Label>Karakter Statis</Label>
            <TextInput
              value={setting?.purchase_order_static_character ?? 0}
              onChange={(e) =>
                setSetting({
                  ...setting!,
                  purchase_order_static_character: e.target.value,
                })
              }
              className="input-white"
            />
          </div>
          <div>
            <Label>Format Nomor</Label>
            <div>
              <Textarea
                value={setting?.purchase_order_format}
                onChange={(val) =>
                  setSetting({
                    ...setting!,
                    purchase_order_format: val.target.value,
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
                    backgroundColor: setting?.purchase_order_format?.includes(e)
                      ? "magenta"
                      : "#dedede",
                    color: setting?.purchase_order_format?.includes(e)
                      ? "white"
                      : "black",
                  }}
                  onClick={() => {
                    let v = setting?.purchase_order_format ?? "";
                    if (v.includes(e)) {
                      v = v.replace(e, "");
                    } else {
                      v += e;
                    }
                    setSetting({
                      ...setting!,
                      purchase_order_format: v,
                    });
                  }}
                >
                  {e}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-bold text-lg mb-4">Purchase Return</h3>
          <div>
            <Label>Karakter Statis</Label>
            <TextInput
              value={setting?.purchase_return_static_character ?? 0}
              onChange={(e) =>
                setSetting({
                  ...setting!,
                  purchase_return_static_character: e.target.value,
                })
              }
              className="input-white"
            />
          </div>
          <div>
            <Label>Format Nomor</Label>
            <div>
              <Textarea
                value={setting?.purchase_return_format}
                onChange={(val) =>
                  setSetting({
                    ...setting!,
                    purchase_return_format: val.target.value,
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
                    backgroundColor: setting?.purchase_return_format?.includes(e)
                      ? "magenta"
                      : "#dedede",
                    color: setting?.purchase_return_format?.includes(e)
                      ? "white"
                      : "black",
                  }}
                  onClick={() => {
                    let v = setting?.purchase_return_format ?? "";
                    if (v.includes(e)) {
                      v = v.replace(e, "");
                    } else {
                      v += e;
                    }
                    setSetting({
                      ...setting!,
                      purchase_return_format: v,
                    });
                  }}
                >
                  {e}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4"> 
        <Button className="w-32" onClick={onSave}>Save</Button>
      </div>
    </div>
  );
};
export default MiscSetting;
