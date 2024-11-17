import {
  Form,
  Collapse,
  Button,
  Popconfirm,
  Select,
  Input,
} from "@arco-design/web-react";
import { useRef, useState, type FC } from "react";

import clsx from "clsx";
import {
  IconArrowDown,
  IconArrowUp,
  IconDelete,
  IconPlus,
} from "@arco-design/web-react/icon";
import { newLocationConfig } from "@/common/newConfig";
import { get } from "lodash-es";
import { type LocationConfig } from "@/common/interface";
import { useConstOption } from "@/common/constUtils";
import { ConstMapLocationMode } from "@/common/const";
import { LocationTitle } from "@/common/LocationTitle";
import { PanelLocationExtra } from "./PanelLocationExtra";

export const PanelLocations: FC<{ className?: string }> = ({ className }) => {
  const [collapseOpenKeys, setCollapseOpenKeys] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const locationModeOptions = useConstOption(ConstMapLocationMode);
  return (
    <div className={clsx(className)} ref={scrollRef}>
      <Form.List noStyle field="locations">
        {(fields, { add, remove, move }) => (
          <>
            <Collapse
              activeKey={collapseOpenKeys}
              onChange={(_, keys) => {
                setCollapseOpenKeys(keys);
              }}
            >
              {fields.map((item, index) => {
                return (
                  <Form.Item noStyle key={item.field} shouldUpdate={true}>
                    {(formData) => {
                      const fieldData = get(
                        formData,
                        item.field
                      ) as LocationConfig;
                      return (
                        <Collapse.Item
                          name={fieldData.id}
                          css={`
                            .arco-collapse-item-header-title {
                              flex: auto;
                              overflow: hidden;
                            }
                            .arco-collapse-item-content-box {
                              padding: 8px;
                            }
                          `}
                          header={
                            <div className="w-full flex justify-between items-center">
                              <LocationTitle
                                className="flex-auto"
                                location={fieldData}
                              />
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="flex-none"
                              >
                                <Button
                                  type="text"
                                  icon={<IconArrowUp />}
                                  className="!p-0 !h-6 !w-6"
                                  disabled={index === 0}
                                  onClick={() => {
                                    move(index, index - 1);
                                  }}
                                />
                                <Button
                                  type="text"
                                  icon={<IconArrowDown />}
                                  className="!p-0 !h-6 !w-6"
                                  disabled={index === fields.length - 1}
                                  onClick={() => {
                                    move(index, index + 1);
                                  }}
                                />
                                <Popconfirm
                                  getPopupContainer={() => document.body}
                                  title="确认要删除当前路由吗？"
                                  onOk={() => {
                                    remove(index);
                                  }}
                                >
                                  <Button
                                    type="text"
                                    status="danger"
                                    icon={<IconDelete />}
                                    className="!p-0 !size-6"
                                  />
                                </Popconfirm>
                              </div>
                            </div>
                          }
                        >
                          <div className="flex">
                            <Form.Item
                              label="路径"
                              field={`${item.field}.path`}
                              labelCol={{ span: 8 }}
                              wrapperCol={{ span: 16 }}
                              rules={[
                                { required: true, message: "请设置路径" },
                              ]}
                            >
                              <Input />
                            </Form.Item>

                            <Form.Item
                              label="模式"
                              field={`${item.field}.mode`}
                              labelCol={{ span: 8 }}
                              wrapperCol={{ span: 16 }}
                              rules={[
                                { required: true, message: "请选择类型" },
                              ]}
                            >
                              <Select options={locationModeOptions} />
                            </Form.Item>
                          </div>

                          <PanelLocationExtra
                            location={fieldData}
                            field={item.field}
                          />

                          <Form.Item
                            label="脚本"
                            field={`${item.field}.nginxRaw`}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                          >
                            <Input.TextArea
                              placeholder={
                                "自定义 nginx 脚本，插入在 location内 末尾"
                              }
                              autoSize={{ minRows: 1 }}
                            />
                          </Form.Item>
                        </Collapse.Item>
                      );
                    }}
                  </Form.Item>
                );
              })}

              <div className="w-full h-10">
                <Button
                  type="text"
                  className="w-full !h-full"
                  icon={<IconPlus />}
                  onClick={() => {
                    const newLocation = newLocationConfig();
                    add(newLocation);
                    setCollapseOpenKeys((k: any) => [...k, newLocation.id]);
                    setTimeout(() => {
                      scrollRef.current?.scroll({
                        top: scrollRef.current.scrollHeight,
                        behavior: "smooth",
                      });
                    });
                  }}
                >
                  添加 Location
                </Button>
              </div>
            </Collapse>
          </>
        )}
      </Form.List>
    </div>
  );
};
